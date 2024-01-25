import { ListOrderRequest__Output } from "@/protoBufferTypes/ListOrderRequest";
import { ListOrderResponse__Output } from "@/protoBufferTypes/ListOrderResponse";
import * as grpc from "@grpc/grpc-js";

import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { ordersInMemory } from "@libs/memory-cache";
import { listOrderRepository } from "@repositories/orders";

export const listOrderService = async (
  call: ServerUnaryCall<ListOrderRequest__Output, ListOrderResponse__Output>,
  callback: sendUnaryData<ListOrderResponse__Output>
) => {
  try {
    if (!ordersInMemory.hasItem(JSON.stringify(call.request))) {
      ordersInMemory.storeExpiringItem(
        JSON.stringify(call.request),
        await listOrderRepository(call.request),
        process.env.NODE_ENV === "test" ? 5 : 3600
      ); // if test env expire in 5 miliseconds else 1 hour
    }
    return callback(
      null,
      ordersInMemory.retrieveItemValue(JSON.stringify(call.request))
    );
  } catch (err) {
    // console.error("LIST Error to list service order =", err);
    const errorStatus = {
      code: grpc.status.INTERNAL,
      details: "Error to list service order: " + err.message,
    };
    callback(errorStatus, null);
  }
};
