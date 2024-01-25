import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { OrderServiceClient as _OrderServiceClient, OrderServiceDefinition as _OrderServiceDefinition } from './OrderService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Cream: MessageTypeDefinition
  CreateOrderRequest: MessageTypeDefinition
  CreateOrderResponse: MessageTypeDefinition
  Extra: MessageTypeDefinition
  GetOrderRequest: MessageTypeDefinition
  GetOrderResponse: MessageTypeDefinition
  ListOrderRequest: MessageTypeDefinition
  ListOrderResponse: MessageTypeDefinition
  OrderService: SubtypeConstructor<typeof grpc.Client, _OrderServiceClient> & { service: _OrderServiceDefinition }
  Topping: MessageTypeDefinition
}

