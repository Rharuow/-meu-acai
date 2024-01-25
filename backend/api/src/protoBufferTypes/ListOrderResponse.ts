// Original file: src/protos/order-service.proto

import type { GetOrderResponse as _GetOrderResponse, GetOrderResponse__Output as _GetOrderResponse__Output } from './GetOrderResponse';

export interface ListOrderResponse {
  'orders'?: (_GetOrderResponse)[];
  'totalPages'?: (number);
}

export interface ListOrderResponse__Output {
  'orders'?: (_GetOrderResponse__Output)[];
  'totalPages'?: (number);
}
