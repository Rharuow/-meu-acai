// Original file: src/protos/order-service.proto


export interface ListOrderRequest {
  'page'?: (number);
  'perPage'?: (number);
  'orderBy'?: (string);
  'filter'?: (string);
}

export interface ListOrderRequest__Output {
  'page'?: (number);
  'perPage'?: (number);
  'orderBy'?: (string);
  'filter'?: (string);
}
