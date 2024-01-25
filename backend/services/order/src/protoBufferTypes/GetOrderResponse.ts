// Original file: src/protos/order-service.proto

import type { Cream as _Cream, Cream__Output as _Cream__Output } from './Cream';
import type { Extra as _Extra, Extra__Output as _Extra__Output } from './Extra';
import type { Topping as _Topping, Topping__Output as _Topping__Output } from './Topping';

export interface GetOrderResponse {
  'id'?: (string);
  'name'?: (string);
  'size'?: (string);
  'paymentMethod'?: (string);
  'isPaid'?: (boolean);
  'maxCreamsAllowed'?: (number);
  'maxToppingsAllowed'?: (number);
  'price'?: (number);
  'totalPrice'?: (number);
  'status'?: (string);
  'creams'?: (_Cream)[];
  'extras'?: (_Extra)[];
  'toppings'?: (_Topping)[];
  'userId'?: (string);
}

export interface GetOrderResponse__Output {
  'id'?: (string);
  'name'?: (string);
  'size'?: (string);
  'paymentMethod'?: (string);
  'isPaid'?: (boolean);
  'maxCreamsAllowed'?: (number);
  'maxToppingsAllowed'?: (number);
  'price'?: (number);
  'totalPrice'?: (number);
  'status'?: (string);
  'creams'?: (_Cream__Output)[];
  'extras'?: (_Extra__Output)[];
  'toppings'?: (_Topping__Output)[];
  'userId'?: (string);
}
