import * as grpc from "@grpc/grpc-js";

import { CreateOrderRequest } from "@/protoBufferTypes/CreateOrderRequest";
import { CreateOrderResponse } from "@/protoBufferTypes/CreateOrderResponse";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { createOrderRepository } from "@repositories/orders";
import { orderInMemory, ordersInMemory } from "@libs/memory-cache";

export const createOrderService = async (
  call: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
  callback: sendUnaryData<CreateOrderResponse>
) => {
  try {
    orderInMemory.clear();
    ordersInMemory.clear();
    const orderCreated = await createOrderRepository(call.request);
    return callback(null, { id: orderCreated.id });
  } catch (err) {
    console.error("CREATE Error to create service order =", err);
    const errorStatus = {
      code: grpc.status.INTERNAL,
      details: "Error to create service order: " + err.message,
    };
    callback(errorStatus, null);
  }
};
