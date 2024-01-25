import { validationAdminAccessToken } from "@middlewares/authorization/validationAdminAccessToken";
import { validationUserAccessToken } from "@middlewares/authorization/validationUserAccessToken";
import {
  validationParams,
  validationQueryParams,
} from "@middlewares/paramsRouter";
import { validationFilterParams } from "@middlewares/resources/cream/validationFilterParams";
import { validationOwnershipOrder } from "@middlewares/services/order/get";
import {
  addDefaultOrderBy,
  validationClientOrMemberOwnerOrder,
  validationOwnershipOrders,
} from "@middlewares/services/order/list";
import { validationListQueryParamsSchema } from "@routes/resources/list/schema";
import { producerCreateServiceOrder } from "@services/order/create";
import { producerDeleteServiceOrder } from "@services/order/delete";
import { getServiceOrder } from "@services/order/get";
import { listServiceOrder } from "@services/order/list";
import { producerUpdateServiceOrder } from "@services/order/update";
import { Router } from "express";
import {
  Schema,
  body,
  check,
  checkExact,
  checkSchema,
  param,
  query,
} from "express-validator";

export const validationCreateOrderBodySchema: Schema = {
  name: {
    optional: true,
    isString: true,
    errorMessage: "name must be a string",
  },
  size: {
    notEmpty: true,
    isString: true,
    errorMessage: "size must be a string and not empty",
  },
  paymentMethod: {
    notEmpty: true,
    isIn: { options: [["cash", "pix", "card"]] },
    errorMessage:
      "paymentMethod must be a string, not empty and must be 'cash', 'pix' or 'card'",
  },
  isPaid: {
    notEmpty: true,
    isBoolean: true,
    errorMessage: "isPaid must be a boolean and not empty",
  },
  maxCreamsAllowed: {
    notEmpty: true,
    isNumeric: true,
    errorMessage: "maxCreamsAllowed must be a number and not empty",
  },
  maxToppingsAllowed: {
    notEmpty: true,
    isNumeric: true,
    errorMessage: "maxToppingsAllowed must be a string and not empty",
  },
  price: {
    isNumeric: true,
    notEmpty: true,
    errorMessage: "price must be a number and not empty",
  },
  totalPrice: {
    isNumeric: true,
    notEmpty: true,
    errorMessage: "totalPrice must be a number and not empty",
  },
  status: {
    notEmpty: true,
    isIn: { options: [["received", "making", "delivering", "done"]] },
    errorMessage:
      "status must be a string, not empty and must be 'received', 'making', 'delivering' or 'done'",
  },
  creams: {
    isArray: true,
    notEmpty: true,
    errorMessage: "creams must be an array and not empty",
    // Add validation for each cream object in the array
    custom: {
      options: (creams: Array<{ name: string; price: number }>) => {
        if (!Array.isArray(creams)) throw new Error("creams must be an array");

        if (creams.length === 0)
          throw new Error("creams must have at least one cream");

        for (const cream of creams) {
          if (typeof cream !== "object" || cream === null)
            throw new Error("Each cream must be an object");

          // Add specific validation for cream properties (e.g., name, price, etc.)
          // For example, validating that the cream has a name property and it is a string
          if (!cream.name || typeof cream.name !== "string")
            throw new Error("Each cream must have a valid name");

          if (!cream.price || typeof cream.price !== "number")
            throw new Error("Each cream must have a valid price");
        }
        return true;
      },
    },
  },
  toppings: {
    isArray: true,
    optional: true,
    errorMessage: "toppings must be an array",
    // Add validation for each topping object in the array
    custom: {
      options: (toppings: Array<null | { name: string; price: number }>) => {
        if (!Array.isArray(toppings)) {
          throw new Error("toppings must be an array");
        }

        for (const topping of toppings) {
          if (typeof topping !== "object") {
            throw new Error("Each topping must be an object");
          }

          // Add specific validation for topping properties (e.g., name, price, etc.)
          // For example, validating that the topping has a name property and it is a string
          if (!topping.name || typeof topping.name !== "string") {
            throw new Error("Each topping must have a valid name");
          }

          if (!topping.price || typeof topping.price !== "number") {
            throw new Error("Each topping must have a valid price");
          }
        }
        return true;
      },
    },
  },
  extras: {
    isArray: true,
    optional: true,
    errorMessage: "extras must be an array",
    // Add validation for each extra object in the array
    custom: {
      options: (extras: Array<null | { name: string; price: number }>) => {
        if (!Array.isArray(extras)) {
          throw new Error("extras must be an array");
        }

        for (const extra of extras) {
          if (typeof extra !== "object" || extra === null) {
            throw new Error("Each extra must be an object");
          }

          // Add specific validation for extra properties (e.g., name, price, etc.)
          // For example, validating that the extra has a name property and it is a string
          if (!extra.name || typeof extra.name !== "string") {
            throw new Error("Each extra must have a valid name");
          }

          if (!extra.price || typeof extra.price !== "number") {
            throw new Error("Each extra must have a valid price");
          }
        }
        return true;
      },
    },
  },
};

export const validationUpdateOrderBodySchema: Schema = {
  name: {
    optional: true,
    isString: true,
    errorMessage: "name must be a string",
  },
  size: {
    optional: true,
    isString: true,
    errorMessage: "size must be a string and not empty",
  },
  paymentMethod: {
    optional: true,
    isIn: { options: [["cash", "pix", "card"]] },
    errorMessage:
      "paymentMethod must be a string, not empty and must be 'cash', 'pix' or 'card'",
  },
  isPaid: {
    optional: true,
    isBoolean: true,
    errorMessage: "isPaid must be a boolean and not empty",
  },
  maxCreamsAllowed: {
    optional: true,
    isNumeric: true,
    errorMessage: "maxCreamsAllowed must be a number and not empty",
  },
  maxToppingsAllowed: {
    optional: true,
    isNumeric: true,
    errorMessage: "maxToppingsAllowed must be a string and not empty",
  },
  price: {
    isNumeric: true,
    optional: true,
    errorMessage: "price must be a number and not empty",
  },
  totalPrice: {
    isNumeric: true,
    optional: true,
    errorMessage: "totalPrice must be a number and not empty",
  },
  status: {
    optional: true,
    isIn: { options: [["received", "making", "delivering", "done"]] },
    errorMessage:
      "status must be a string, not empty and must be 'received', 'making', 'delivering' or 'done'",
  },
};

export const paramsOrderByOptions = [
  "id",
  "id:asc",
  "id:desc",
  "name",
  "name:asc",
  "name:desc",
  "size",
  "size:asc",
  "size:desc",
  "totalPrice",
  "totalPrice:asc",
  "totalPrice:desc",
] as const;

const ordersRouter = Router();

ordersRouter.post(
  "/orders",
  checkExact([
    checkSchema(validationCreateOrderBodySchema, ["body"]),
    query([], "Query parameters unpermitted"), // check if has any query parameters
    param([], "Path parameters unpermitted"), // check if has any in the route parameters
  ]),
  validationParams,
  validationUserAccessToken,
  producerCreateServiceOrder
);

ordersRouter.delete(
  "/orders/:id",
  checkExact([
    body([], "Body parameters unpermitted"),
    query([], "Query parameters unpermitted"), // check if has any query parameters
    param(["id"], "Just id is permitted in path params"), // check if 'id' is present in the route parameters
  ]),
  validationParams,
  validationAdminAccessToken,
  producerDeleteServiceOrder
);

ordersRouter.get(
  "/orders/:id",
  checkExact([
    body([], "Body parameters unpermitted"),
    query([], "Query parameters unpermitted"), // check if has any query parameters
    param(["id"], "Just id is permitted in path params"), // check if 'id' is present in the route parameters
  ]),
  validationParams,
  validationUserAccessToken,
  getServiceOrder,
  validationOwnershipOrder
);

ordersRouter.get(
  "/orders",
  validationFilterParams,
  addDefaultOrderBy,
  checkExact([
    checkSchema(validationListQueryParamsSchema(paramsOrderByOptions), [
      "query",
    ]),
    body([], "Query parameters unpermitted"), // check if has any query parameters
    param([], "Query parameters unpermitted"), // check if has any router parameters
  ]),
  validationQueryParams,
  validationUserAccessToken,
  validationClientOrMemberOwnerOrder,
  listServiceOrder,
  validationOwnershipOrders
);

ordersRouter.put(
  "/orders/:id",
  checkExact([
    checkSchema(validationUpdateOrderBodySchema, ["body"]),
    query([], "Query parameters unpermitted"), // check if has any query parameters
    param(["id"], "Just id is permitted in path params"), // check if 'id' is present in the route parameters
    // Check if at least one property exists in the request body
    check().custom((value, { req }) => {
      const requestBodyKeys = Object.keys(req.body);

      if (requestBodyKeys.length === 0) {
        throw new Error("Request body must not be empty");
      }
      const {
        name,
        size,
        paymentMethod,
        isPaid,
        maxCreamsAllowed,
        maxToppingsAllowed,
        price,
        totalPrice,
        status,
        creams,
        toppings,
        extras,
      } = req.body;

      if (
        !name &&
        !size &&
        !paymentMethod &&
        !isPaid &&
        !maxCreamsAllowed &&
        !maxToppingsAllowed &&
        !price &&
        !totalPrice &&
        !status
      ) {
        throw new Error("At least one property must exist in the request body");
      }

      req.body = {
        name,
        size,
        paymentMethod,
        isPaid,
        maxCreamsAllowed,
        maxToppingsAllowed,
        price,
        totalPrice,
        status,
        creams,
        toppings,
        extras,
      };

      return true;
    }),
  ]),
  validationParams,
  validationAdminAccessToken,
  producerUpdateServiceOrder
);

export { ordersRouter };
