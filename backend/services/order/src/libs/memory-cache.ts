import { GetOrderResponse__Output } from "@/protoBufferTypes/GetOrderResponse";
import { ListOrderResponse } from "@/protoBufferTypes/ListOrderResponse";
import { MemoryCache } from "memory-cache-node";

const TIMETOEXPIRECACHE = process.env.NODE_ENV === "test" ? 5 : 60 * 60; // 1 hour to expire items

export const ordersInMemory = new MemoryCache<string, ListOrderResponse>(
  TIMETOEXPIRECACHE,
  100 // number of items
);

export const orderInMemory = new MemoryCache<string, GetOrderResponse__Output>(
  TIMETOEXPIRECACHE,
  10
);
