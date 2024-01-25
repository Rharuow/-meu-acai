import { GetOrderRequest } from "@/protoBufferTypes/GetOrderRequest";
import { GetOrderResponse } from "@/protoBufferTypes/GetOrderResponse";
import * as grpc from "@grpc/grpc-js";

import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { orderInMemory } from "@libs/memory-cache";
import { getOrderRepository } from "@repositories/orders";

export const getOrderService = async (
  call: ServerUnaryCall<GetOrderRequest, GetOrderResponse>,
  callback: sendUnaryData<GetOrderResponse>
) => {
  try {
    if (!orderInMemory.hasItem(call.request.id)) {
      orderInMemory.storeExpiringItem(
        call.request.id,
        await getOrderRepository(call.request.id),
        process.env.NODE_ENV === "test" ? 5 : 3600
      ); // if test env expire in 5 miliseconds else 1 hour
    }
    return callback(null, orderInMemory.retrieveItemValue(call.request.id));
  } catch (err) {
    // console.error("GET Error to get service order =", err);
    const errorStatus = {
      code: grpc.status.INTERNAL,
      details: "Error to get service order: " + err.message,
    };
    callback(errorStatus, null);
  }
};
