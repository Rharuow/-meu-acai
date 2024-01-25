import { app } from "@/app";
import request from "supertest";
import {
  cleanServiceOrderTestDatabase,
  presetToServiceOrderTests,
} from "../presets/services/order";
import { CreateOrderRequest__Output } from "@/protoBufferTypes/CreateOrderRequest";
import { saveSwaggerDefinitions } from "@/generateSwagger";

import swaggerDefinition from "@/swagger-spec.json";

let accessTokenAsAdmin: string;
let refreshTokenAsAdmin: string;

let accessTokenAsClient: string;
let refreshTokenAsClient: string;

let accessTokenAsMember: string;
let refreshTokenAsMember: string;

beforeAll(async () => {
  const { userAdmin, userClient, userMember } =
    await presetToServiceOrderTests();

  // console.log("USER ADMIN = ", userAdmin);
  // console.log("USER CLIENT = ", userClient);
  // console.log("USER MEMBER = ", userMember);

  const [
    responseSignInAsAdmin,
    responseSignInAsClient,
    responseSignInAsMember,
  ] = await Promise.all([
    request(app)
      .post("/api/v1/signin")
      .send({ name: userAdmin.name, password: "123" })
      .set("Accept", "application/json")
      .expect(200),
    request(app)
      .post("/api/v1/signin")
      .send({ name: userClient.name, password: "123" })
      .set("Accept", "application/json")
      .expect(200),
    request(app)
      .post("/api/v1/signin")
      .send({ name: userMember.name, password: "123" })
      .set("Accept", "application/json")
      .expect(200),
  ]);

  accessTokenAsAdmin = "Bearer " + responseSignInAsAdmin.body.accessToken;
  refreshTokenAsAdmin = "Bearer " + responseSignInAsAdmin.body.refreshToken;

  accessTokenAsClient = "Bearer " + responseSignInAsClient.body.accessToken;
  refreshTokenAsClient = "Bearer " + responseSignInAsClient.body.refreshToken;

  accessTokenAsMember = "Bearer " + responseSignInAsMember.body.accessToken;
  refreshTokenAsMember = "Bearer " + responseSignInAsMember.body.refreshToken;
});

const createServiceOrderRequestBody: CreateOrderRequest__Output = {
  name: "A Test ServiceOrder",
  price: 9.99,
  paymentMethod: "card",
  isPaid: true,
  creams: Array(2)
    .fill(null)
    .map((cream, index) => ({
      id: String(index),
      name: "Cream test",
      price: 9.99,
    })),
  maxCreamsAllowed: 2,
  maxToppingsAllowed: 3,
  size: "Size test",
  totalPrice: 99.99,
  status: "received",
  extras: Array(2)
    .fill(null)
    .map((extra, index) => ({
      id: String(index),
      name: "Extra test",
      price: 9.99,
    })),
  toppings: Array(3)
    .fill(null)
    .map((topping, index) => ({
      id: String(index),
      name: "Topping test",
      price: 9.99,
    })),
};

let orderId: string;
const orderIds: Array<string> = [];

let createSuccessBodyResponse = {};
let createUnprocessableBodyResponse = {};
let createUnauthorizedBodyResponse = {};

let getSuccessBodyResponse = {};
let getNotFoundBodyResponse = {};
let getUnauthorizedBodyResponse = {};

let listSuccessBodyResponse = {};
let listUnprocessableBodyResponse = {};
let listUnauthorizedBodyResponse = {};

let updateUnprocessableBodyResponse = {};
let updateUnauthorizedBodyResponse = {};

const basePath = "/api/v1/services/orders";
const setIdInBasePath = (id: string) => `/api/v1/services/orders/${id}`;

afterAll(async () => {
  for (const id of orderIds) {
    await request(app)
      .delete(setIdInBasePath(id))
      .set("Authorization", accessTokenAsAdmin)
      .set("refreshToken", refreshTokenAsAdmin)
      .expect(204);
  }
  await cleanServiceOrderTestDatabase();
  await saveSwaggerDefinitions({
    paths: {
      ...swaggerDefinition.paths,
      "/api/v1/services/orders": {
        post: {
          summary: "Create Order",
          description: "Endpoint to add a new Order to the system.",
          tags: ["Order"],
          requestBody: {
            description: "Order details for creation",
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: createServiceOrderRequestBody.name,
                      require: false,
                    },
                    size: {
                      type: "string",
                      example: createServiceOrderRequestBody.size,
                      require: true,
                    },
                    status: {
                      type: "string",
                      enum: ["received", "making", "delivering", "done"],
                      example: createServiceOrderRequestBody.status,
                      require: true,
                    },
                    paymentMethod: {
                      type: "string",
                      enum: ["cash", "pix", "card"],
                      example: createServiceOrderRequestBody.paymentMethod,
                      require: true,
                    },
                    price: {
                      type: "number",
                      example: createServiceOrderRequestBody.price,
                      require: true,
                    },
                    totalPrice: {
                      type: "number",
                      example: createServiceOrderRequestBody.totalPrice,
                      require: true,
                    },
                    maxCreamsAllowed: {
                      type: "number",
                      example: createServiceOrderRequestBody.maxCreamsAllowed,
                      require: true,
                    },
                    maxToppingsAllowed: {
                      type: "number",
                      example: createServiceOrderRequestBody.maxToppingsAllowed,
                      require: true,
                    },
                    isPaid: {
                      type: "boolean",
                      example: createServiceOrderRequestBody.isPaid,
                      require: true,
                    },
                    creams: {
                      type: "array",
                      example: createServiceOrderRequestBody.creams,
                      items: { $ref: "#/components/schemas/CreamToOrder" },
                      require: true,
                    },
                    toppings: {
                      type: "array",
                      example: createServiceOrderRequestBody.toppings,
                      items: { $ref: "#/components/schemas/ToppingToOrder" },
                      require: false,
                    },
                    extras: {
                      type: "array",
                      example: createServiceOrderRequestBody.extras,
                      items: { $ref: "#/components/schemas/Extra" },
                      require: false,
                    },
                  },
                  required: [
                    "price",
                    "paymentMethod",
                    "isPaid",
                    "creams",
                    "maxCreamsAllowed",
                    "maxToppingsAllowed",
                    "size",
                    "totalPrice",
                    "status",
                  ],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful creating order",
              content: {
                "application/json": { example: createSuccessBodyResponse },
              },
            },
            "422": {
              description: "Unprocessable Entity - parameters are invalid",
              content: {
                "application/json": {
                  example: createUnprocessableBodyResponse,
                },
              },
            },
            "401": {
              description: "Unauthorized - Invalid credentials",
              content: {
                "application/json": { example: createUnauthorizedBodyResponse },
              },
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
        get: {
          summary: "List Orders",
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Page to list orders",
              required: false,
              schema: {
                type: "number",
                default: 1,
              },
            },
            {
              name: "perPage",
              in: "query",
              description: "How many orders to return per page",
              required: false,
              schema: {
                type: "number",
                default: 10,
              },
            },
            {
              name: "orderBy",
              in: "query",
              description: "Order by some field table",
              required: false,
              schema: {
                type: "string",
                default: "id:asc",
              },
            },
            {
              name: "filter",
              in: "query",
              description: "Filter orders by some fields table",
              required: false,
              schema: {
                type: "string",
              },
              example:
                "name:like:some text here,id:some id here,totalPrice:gt:1000,size:like:some text here",
            },
          ],
          description:
            "Retrieve a list of orders based on optional query parameters.",
          tags: ["Order"],
          responses: {
            "200": {
              description: "Successful getting order",
              content: {
                "application/json": { example: listSuccessBodyResponse },
              },
            },
            "422": {
              description: "Unprocessable Entity - parameters are invalid",
              content: {
                "application/json": {
                  example: listUnprocessableBodyResponse,
                },
              },
            },
            "401": {
              description: "Unauthorized - Invalid credentials",
              content: {
                "application/json": { example: listUnauthorizedBodyResponse },
              },
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
      },
      "/api/v1/services/orders/{id}": {
        get: {
          summary: "Get Order by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "ID of the Order to retrieve",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          description: "Retrieve details of a specific Order by its ID.",
          tags: ["Order"],
          responses: {
            "200": {
              description: "Successful getting order",
              content: {
                "application/json": { example: getSuccessBodyResponse },
              },
            },
            "404": {
              description: "Unprocessable Entity - parameters are invalid",
              content: {
                "application/json": {
                  example: getNotFoundBodyResponse,
                },
              },
            },
            "401": {
              description: "Unauthorized - Invalid credentials",
              content: {
                "application/json": { example: getUnauthorizedBodyResponse },
              },
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
        put: {
          summary: "Update Order",
          description: "Endpoint to update a Order to the system.",
          tags: ["Order"],
          requestBody: {
            description: "Order details for updating",
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: createServiceOrderRequestBody.name,
                      require: false,
                    },
                    size: {
                      type: "string",
                      example: createServiceOrderRequestBody.size,
                      require: false,
                    },
                    status: {
                      type: "string",
                      enum: ["received", "making", "delivering", "done"],
                      example: createServiceOrderRequestBody.status,
                      require: false,
                    },
                    paymentMethod: {
                      type: "string",
                      enum: ["cash", "pix", "card"],
                      example: createServiceOrderRequestBody.paymentMethod,
                      require: false,
                    },
                    price: {
                      type: "number",
                      example: createServiceOrderRequestBody.price,
                      require: false,
                    },
                    totalPrice: {
                      type: "number",
                      example: createServiceOrderRequestBody.totalPrice,
                      require: false,
                    },
                    maxCreamsAllowed: {
                      type: "number",
                      example: createServiceOrderRequestBody.maxCreamsAllowed,
                      require: false,
                    },
                    maxToppingsAllowed: {
                      type: "number",
                      example: createServiceOrderRequestBody.maxToppingsAllowed,
                      require: false,
                    },
                    isPaid: {
                      type: "boolean",
                      example: createServiceOrderRequestBody.isPaid,
                      require: false,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "204": {
              description: "Successful updating order",
            },
            "422": {
              description: "Unprocessable Entity - parameters are invalid",
              content: {
                "application/json": {
                  example: updateUnprocessableBodyResponse,
                },
              },
            },
            "401": {
              description: "Unauthorized - Invalid credentials",
              content: {
                "application/json": { example: updateUnauthorizedBodyResponse },
              },
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
        delete: {
          summary: "Delete Order",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "id of order to delete",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          description: "Delete order based on id path parameter.",
          tags: ["Order"],
          responses: {
            "204": {
              description: "Successful deleting order",
            },
            "422": {
              description: "Unprocessable Entity - parameters are invalid",
            },
            "401": {
              description: "Unauthorized - Invalid credentials",
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        },
      },
    },
  });
});

describe("SERVICE ORDER TESTS", () => {
  describe("CREATE SERVICE ORDER", () => {
    describe("CREATING ORDER AS AN ADMIN", () => {
      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the valid params name, price, creams, maxCreamsAllowed, maxToppingsAllowed, size, paymentMethod, isPaid, totalPrice, extras and toppings" +
          " the response status code will be 200 and a message property that will be 'Order created successfully'",
        async () => {
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBody)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id");
          orderId = response.body.data.id;
          // console.warn("[CREATE AS ADMIN] orderId = ", orderId);
          createSuccessBodyResponse = response.body;
          return expect(response.body).toHaveProperty(
            "message",
            "Order created successfully"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing isPaid param)" +
          " the response status code will be 422 and a message property that will be 'isPaid must be a boolean and not empty'",
        async () => {
          const { isPaid, ...createServiceOrderRequestBodyMissingParam } =
            createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          createUnprocessableBodyResponse = response.body;

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "isPaid must be a boolean and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing paymentMethod param)" +
          " the response status code will be 422 and a message property that will be 'paymentMethod must be a string, not empty and must be 'cash', 'pix' or 'card''",
        async () => {
          const {
            paymentMethod,
            ...createServiceOrderRequestBodyMissingParam
          } = createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "paymentMethod must be a string, not empty and must be 'cash', 'pix' or 'card'"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing price param)" +
          " the response status code will be 422 and a message property that will be 'price must be a number and not empty'",
        async () => {
          const { price, ...createServiceOrderRequestBodyMissingParam } =
            createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "price must be a number and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing size param)" +
          " the response status code will be 422 and a message property that will be 'size must be a string and not empty'",
        async () => {
          const { size, ...createServiceOrderRequestBodyMissingParam } =
            createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "size must be a string and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing maxCreamsAllowed param)" +
          " the response status code will be 422 and a message property that will be 'maxCreamsAllowed must be a number and not empty'",
        async () => {
          const {
            maxCreamsAllowed,
            ...createServiceOrderRequestBodyMissingParam
          } = createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "maxCreamsAllowed must be a number and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing maxToppingsAllowed param)" +
          " the response status code will be 422 and a message property that will be 'maxToppingsAllowed must be a string and not empty'",
        async () => {
          const {
            maxToppingsAllowed,
            ...createServiceOrderRequestBodyMissingParam
          } = createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "maxToppingsAllowed must be a string and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing totalPrice param)" +
          " the response status code will be 422 and a message property that will be 'totalPrice must be a number and not empty'",
        async () => {
          const { totalPrice, ...createServiceOrderRequestBodyMissingParam } =
            createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "totalPrice must be a number and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (missing creams param)" +
          " the response status code will be 422 and a message property that will be 'creams must be an array and not empty'",
        async () => {
          const { creams, ...createServiceOrderRequestBodyMissingParam } =
            createServiceOrderRequestBody;
          const response = await request(app)
            .post(basePath)
            .send(createServiceOrderRequestBodyMissingParam)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "creams must be an array and not empty"
          );
        }
      );

      test(
        `When an Admin access POST ${basePath}` +
          " sending in the body request the invalid params (creams param empty)" +
          " the response status code will be 422 and a message property that will be 'creams must have at least one cream'",
        async () => {
          const response = await request(app)
            .post(basePath)
            .send({ ...createServiceOrderRequestBody, creams: [] })
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(422);
          return expect(response.body).toHaveProperty(
            "message",
            "creams must have at least one cream"
          );
        }
      );
    });

    describe("CREATING ORDER AS A CLIENT", () => {
      test(
        `When an Client access POST ${basePath}` +
          " sending in the body request the valid params name, price, creams, maxCreamsAllowed, maxToppingsAllowed, size, paymentMethod, isPaid, totalPrice, extras and toppings" +
          " the response status code will be 200 and a message property that will be 'Order created successfully'",
        async () => {
          const response = await request(app)
            .post(basePath)
            .send({
              ...createServiceOrderRequestBody,
              name: "B Test ServiceOrder Client",
            })
            .set("Authorization", accessTokenAsClient)
            .set("refreshToken", refreshTokenAsClient);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id");
          orderIds.push(response.body.data.id);
          // console.warn("[CREATE AS ADMIN] orderId = ", orderId);
          return expect(response.body).toHaveProperty(
            "message",
            "Order created successfully"
          );
        }
      );
    });

    describe("CREATING ORDER AS A MEMBER", () => {
      test(
        `When an Member access POST ${basePath}` +
          " sending in the body request the valid params name, price, creams, maxCreamsAllowed, maxToppingsAllowed, size, paymentMethod, isPaid, totalPrice, extras and toppings" +
          " the response status code will be 200 and a message property that will be 'Order created successfully'",
        async () => {
          const response = await request(app)
            .post(basePath)
            .send({
              ...createServiceOrderRequestBody,
              name: "C Test ServiceOrder Member",
            })
            .set("Authorization", accessTokenAsMember)
            .set("refreshToken", refreshTokenAsMember);

          // console.warn("[CREATE AS ADMIN] response.body = ", response.body);

          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id");
          orderIds.push(response.body.data.id);
          // console.warn("[CREATE AS ADMIN] orderId = ", orderId);
          return expect(response.body).toHaveProperty(
            "message",
            "Order created successfully"
          );
        }
      );
    });

    describe("CREATING ORDER WITHOUT AUTHENTICATION", () => {
      test(
        `When access POST ${basePath} without authentication` +
          " sending in the body request the valid params name, price, creams, maxCreamsAllowed, maxToppingsAllowed, size, paymentMethod, isPaid, totalPrice, extras and toppings" +
          " the response status code will be 401 and a message property that will be 'Unauthorized: No access token provided'",
        async () => {
          const response = await request(app)
            .post(basePath)
            .send({
              ...createServiceOrderRequestBody,
              name: "C Test ServiceOrder Member",
            });

          // console.warn("[CREATE AS ANONIMOUS] response.body = ", response.body);

          expect(response.statusCode).toBe(401);
          createUnauthorizedBodyResponse = response.body;
          return expect(response.body).toHaveProperty(
            "message",
            "Unauthorized: No access token provided"
          );
        }
      );
    });
  });

  describe("UPDATE SERVICE ORDER", () => {
    describe("UPDATING ORDER AS AN ADMIN", () => {
      test(
        `When an Admin access PUT ${basePath}/:id` +
          " sending, in the path param, the valid id of order and body with property 'status' as 'making' " +
          " the response status code will be 204",
        async () => {
          // console.info(`[PUT AS ADMIN] orderId = ${orderId}`);
          const response = await request(app)
            .put(setIdInBasePath(orderId))
            .send({
              status: "making",
            })
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[PUT AS ADMIN] response = ", response);
          return expect(response.statusCode).toBe(204);
        }
      );

      test(
        `When an Admin access PUT ${basePath}/:id` +
          " sending, in the path param, the valid id of order and body with invalid property" +
          " the response status code will be 422",
        async () => {
          // console.info(`[PUT AS ADMIN] orderId = ${orderId}`);
          const response = await request(app)
            .put(setIdInBasePath(orderId))
            .send({
              invalidParam: "invalidParam",
            })
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[PUT AS ADMIN] response = ", response.body);
          expect(response.body).toHaveProperty(
            "message",
            "At least one property must exist in the request body"
          );
          updateUnprocessableBodyResponse = response.body;
          return expect(response.statusCode).toBe(422);
        }
      );

      test(
        `When an Admin access PUT ${basePath}/:id` +
          " sending, in the path param, the valid id of order and empty body " +
          " the response status code will be 422 and the response body will contain the message with text 'Request body must not be empty'",
        async () => {
          // console.info(`[PUT AS ADMIN] orderId = ${orderId}`);
          const response = await request(app)
            .put(setIdInBasePath(orderId))
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[PUT AS ADMIN] response.body = ", response.body);
          expect(response.body).toHaveProperty(
            "message",
            "Request body must not be empty"
          );
          return expect(response.statusCode).toBe(422);
        }
      );
    });

    describe("UPDATING ORDER AS A CLIENT", () => {
      test(
        `When an Client access PUT ${basePath}/:id` +
          " sending, in the path param, the valid id of order and body with property 'status' as 'making' " +
          " the response status code will be 401 and the response body will contain the message with text 'User haven't permission'",
        async () => {
          // console.info(`[PUT AS CLIENT] orderId = ${orderId}`);
          const response = await request(app)
            .put(setIdInBasePath(orderId))
            .send({
              status: "making",
            })
            .set("Authorization", accessTokenAsClient)
            .set("refreshToken", refreshTokenAsClient);

          // console.info("[PUT AS CLIENT] response = ", response.body);
          expect(response.body).toHaveProperty(
            "message",
            "User haven't permission"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });

    describe("UPDATING ORDER AS A MEMBER", () => {
      test(
        `When an Member access PUT ${basePath}/:id` +
          " sending, in the path param, the valid id of order and body with property 'status' as 'making' " +
          " the response status code will be 401 and the response body will contain the message with text 'User haven't permission'",
        async () => {
          // console.info(`[PUT AS MEMBER] orderId = ${orderId}`);
          const response = await request(app)
            .put(setIdInBasePath(orderId))
            .send({
              status: "making",
            })
            .set("Authorization", accessTokenAsMember)
            .set("refreshToken", refreshTokenAsMember);

          // console.info("[PUT AS MEMBER] response = ", response.body);
          expect(response.body).toHaveProperty(
            "message",
            "User haven't permission"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });

    describe("UPDATING ORDER WITHOUT AUTHENTICATION", () => {
      test(
        `When access PUT ${basePath}/:id without authentication` +
          " sending, in the path param, the valid id of order and body with property 'status' as 'making' " +
          " the response status code will be 401 and the response body will contain the message with text 'No authorization required'",
        async () => {
          // console.info(`[PUT AS MEMBER] orderId = ${orderId}`);
          const response = await request(app)
            .put(setIdInBasePath(orderId))
            .send({
              status: "making",
            });

          // console.info(
          //   "[PUT WIHTOUT AUTHENTICATION] response = ",
          //   response.body
          // );
          updateUnauthorizedBodyResponse = response.body;
          expect(response.body).toHaveProperty(
            "message",
            "No authorization required"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });
  });

  describe("GET SERVICE ORDER", () => {
    describe("GETTING ORDER AS AN ADMIN", () => {
      test(
        `When an Admin access GET ${basePath}/:id` +
          " sending, in the path param, the valid id of order " +
          " the response status code will be 200 and the response body will contain the order object",
        async () => {
          // console.info(`[GET AS ADMIN] orderId = ${orderId}`);
          const response = await request(app)
            .get(setIdInBasePath(orderId))
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[GET AS ADMIN] response.body = ", response.body);
          getSuccessBodyResponse = response.body;
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id", orderId);
          expect(response.body.data).toHaveProperty("status", "making");
          expect(response.body.data).toHaveProperty(
            "name",
            createServiceOrderRequestBody.name
          );
          expect(response.body.data).toHaveProperty(
            "size",
            createServiceOrderRequestBody.size
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When an Admin access GET ${basePath}/:id` +
          " sending, in the path param, the valid id of order and this order not belongs to the admin looged" +
          ", the response status code will be 200 and the response body will contain the order object",
        async () => {
          // console.info(`[GET AS ADMIN] orderId = ${orderId}`);
          const response = await request(app)
            .get(setIdInBasePath(orderIds[0]))
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[GET AS ADMIN] response.body = ", response.body);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id", orderIds[0]);
          expect(response.body.data).toHaveProperty(
            "name",
            "B Test ServiceOrder Client"
          );
          expect(response.body.data).toHaveProperty(
            "size",
            createServiceOrderRequestBody.size
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When an Admin access GET ${basePath}/:id` +
          " sending, in the path param, the invalid id " +
          " the response status code will be 404 and the response body will contain the order object",
        async () => {
          const response = await request(app)
            .get(setIdInBasePath("invalid-id"))
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          getNotFoundBodyResponse = response.body;

          expect(response.body).toHaveProperty("message", "order not found");
          return expect(response.statusCode).toBe(404);
        }
      );
    });

    describe("GETTING ORDER AS A CLIENT", () => {
      test(
        `When a Client access GET ${basePath}/:id` +
          ", they should include a valid order ID in the path parameter. If the provided ID corresponds to an order that belongs to the authenticated user" +
          ", the expected response status code is 200. In this case, the response body should contain the corresponding order object.",
        async () => {
          // console.info(
          //   `[GET AS CLIENT] setIdInBasePath(orderIds[0]) = ${setIdInBasePath(
          //     orderIds[0]
          //   )}`
          // );
          const response = await request(app)
            .get(setIdInBasePath(orderIds[0]))
            .set("Authorization", accessTokenAsClient)
            .set("refreshToken", refreshTokenAsClient);

          // console.info("[GET AS CLIENT] response.body = ", response.body);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id", orderIds[0]);
          expect(response.body.data).toHaveProperty(
            "name",
            "B Test ServiceOrder Client"
          );
          expect(response.body.data).toHaveProperty(
            "size",
            createServiceOrderRequestBody.size
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When a Client access GET ${basePath}/:id` +
          " , they should include a valid order ID in the path parameter. If the provided ID corresponds to an order that does not belong to the authenticated user" +
          ", the expected response status code is 401. In this scenario, the response body should include the order object.",
        async () => {
          // console.info(
          //   `[GET AS CLIENT] setIdInBasePath(orderIds[1]) = ${setIdInBasePath(
          //     orderIds[1]
          //   )}`
          // );
          const response = await request(app)
            .get(setIdInBasePath(orderIds[1]))
            .set("Authorization", accessTokenAsClient)
            .set("refreshToken", refreshTokenAsClient);

          // console.info("[GET AS CLIENT] response.body = ", response.body);
          expect(response.body).toHaveProperty("data", null);
          expect(response.body).toHaveProperty(
            "message",
            "This order doesn't belong to user logged"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });

    describe("GETTING ORDER AS A MEMBER", () => {
      test(
        `When a Member access GET ${basePath}/:id` +
          ", they should include a valid order ID in the path parameter. If the provided ID corresponds to an order that belongs to the authenticated user" +
          ", the expected response status code is 200. In this case, the response body should contain the corresponding order object.",
        async () => {
          // console.info(
          //   `[GET AS MEMBER] setIdInBasePath(orderIds[1]) = ${setIdInBasePath(
          //     orderIds[1]
          //   )}`
          // );
          const response = await request(app)
            .get(setIdInBasePath(orderIds[1]))
            .set("Authorization", accessTokenAsMember)
            .set("refreshToken", refreshTokenAsMember);

          // console.info("[GET AS MEMBER] response.body = ", response.body);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("id", orderIds[1]);
          expect(response.body.data).toHaveProperty(
            "name",
            "C Test ServiceOrder Member"
          );
          expect(response.body.data).toHaveProperty(
            "size",
            createServiceOrderRequestBody.size
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When a Member access GET ${basePath}/:id` +
          " , they should include a valid order ID in the path parameter. If the provided ID corresponds to an order that does not belong to the authenticated user" +
          ", the expected response status code is 401. In this scenario, the response body should include the order object.",
        async () => {
          // console.info(
          //   `[GET AS MEMBER] setIdInBasePath(orderIds[0]) = ${setIdInBasePath(
          //     orderIds[0]
          //   )}`
          // );
          const response = await request(app)
            .get(setIdInBasePath(orderIds[0]))
            .set("Authorization", accessTokenAsMember)
            .set("refreshToken", refreshTokenAsMember);

          // console.info("[GET AS MEMBER] response.body = ", response.body);
          expect(response.body).toHaveProperty("data", null);
          expect(response.body).toHaveProperty(
            "message",
            "This order doesn't belong to user logged"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });

    describe("GETTING ORDER WITHOUT AUTHENTICATION", () => {
      test(
        `When access GET ${basePath}/:id without authentication` +
          ", they should include a valid order ID in the path parameter." +
          ", the expected response status code is 401. In this case, the response body should contain the corresponding message 'Unauthorized: No access token provided'.",
        async () => {
          // console.info(
          //   `[GET AS MEMBER] setIdInBasePath(orderIds[1]) = ${setIdInBasePath(
          //     orderIds[1]
          //   )}`
          // );
          const response = await request(app).get(setIdInBasePath(orderIds[1]));

          // console.info("[GET AS MEMBER] response.body = ", response.body);
          expect(response.body).toHaveProperty(
            "message",
            "Unauthorized: No access token provided"
          );
          getUnauthorizedBodyResponse = response.body;
          return expect(response.statusCode).toBe(401);
        }
      );
    });
  });

  describe("LIST SERVICE ORDERS", () => {
    describe("LISTING ORDERS AS AN ADMIN", () => {
      test(
        `When an Admin access GET ${basePath}` +
          " the response status code will be 200 and the response body will contain three orders and totalPages equals to 1 in 'data' property, finally in the body will contain the message 'Orders listed successfully'",
        async () => {
          const response = await request(app)
            .get(basePath)
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[LIST AS ADMIN] response.body = ", response.body.data);
          listSuccessBodyResponse = response.body;
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("orders");
          expect(response.body.data.orders).toHaveProperty("length", 3);
          expect(response.body.data).toHaveProperty("totalPages", 1);
          expect(response.body).toHaveProperty(
            "message",
            "Orders listed successfully"
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When an Admin access GET ${basePath}?perPage=2` +
          " the response status code will be 200 and the response body will contain two orders and totalPages equals to 2 in 'data' property, finally in the body will contain the message 'Orders listed successfully'",
        async () => {
          const response = await request(app)
            .get(basePath + "?perPage=2")
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[LIST AS ADMIN] response.body = ", response.body);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("orders");
          expect(response.body.data.orders).toHaveProperty("length", 2);
          expect(response.body.data).toHaveProperty("totalPages", 2);
          expect(response.body).toHaveProperty(
            "message",
            "Orders listed successfully"
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When an Admin access GET ${basePath}?orderBy=name:desc` +
          " the response status code will be 200 and the response body will contain three orders sorted desceding by name and totalPages equals to 1 in 'data' property, finally in the body will contain the message 'Orders listed successfully'",
        async () => {
          const response = await request(app)
            .get(basePath + "?orderBy=name:desc")
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info(
          //   "[LIST AS ADMIN] response.body.data = ",
          //   response.body.data
          // );
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("orders");
          expect(response.body.data.orders).toHaveProperty("length", 3);
          expect(
            response.body.data.orders[0].name >
              response.body.data.orders[1].name
          ).toBeTruthy();
          expect(response.body.data).toHaveProperty("totalPages", 1);
          expect(response.body).toHaveProperty(
            "message",
            "Orders listed successfully"
          );
          return expect(response.statusCode).toBe(200);
        }
      );

      test(
        `When an Admin access GET ${basePath}?invalid-params=invalid-value` +
          " the response status code will be 422 and the response body will contain the message 'Unknown field(s)'",
        async () => {
          const response = await request(app)
            .get(basePath + "?invalid-params=invalid-value")
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.info("[LIST AS ADMIN] response.body = ", response.body);

          listUnprocessableBodyResponse = response.body;
          expect(response.body).toHaveProperty("message", "Unknown field(s)");
          return expect(response.statusCode).toBe(422);
        }
      );
    });

    describe("LISTING ORDERS AS AN CLIENT", () => {
      test(
        `When an Client access GET ${basePath}` +
          " the response status code will be 200 and the response body will contain one orders (just one because this orders belongs to this client) and totalPages equals to 1 in 'data' property, finally in the body will contain the message 'Orders listed successfully'",
        async () => {
          const response = await request(app)
            .get(basePath)
            .set("Authorization", accessTokenAsClient)
            .set("refreshToken", refreshTokenAsClient);

          // console.info("[LIST AS CLIENT] response.body = ", response.body.data);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("orders");
          expect(response.body.data.orders).toHaveProperty("length", 1);
          expect(response.body.data).toHaveProperty("totalPages", 1);
          expect(response.body).toHaveProperty(
            "message",
            "Orders listed successfully"
          );
          return expect(response.statusCode).toBe(200);
        }
      );
    });

    describe("LISTING ORDERS AS AN MEMBER", () => {
      test(
        `When an Member access GET ${basePath}` +
          " the response status code will be 200 and the response body will contain one orders (just one because this orders belongs to this member) and totalPages equals to 1 in 'data' property, finally in the body will contain the message 'Orders listed successfully'",
        async () => {
          const response = await request(app)
            .get(basePath)
            .set("Authorization", accessTokenAsMember)
            .set("refreshToken", refreshTokenAsMember);

          // console.info("[LIST AS MEMBER] response.body = ", response.body.data);
          expect(response.body).toHaveProperty("data");
          expect(response.body.data).toHaveProperty("orders");
          expect(response.body.data.orders).toHaveProperty("length", 1);
          expect(response.body.data).toHaveProperty("totalPages", 1);
          expect(response.body).toHaveProperty(
            "message",
            "Orders listed successfully"
          );
          return expect(response.statusCode).toBe(200);
        }
      );
    });

    describe("LISTING ORDERS WIHTOUT AUTHENTICATION", () => {
      test(
        `When access GET ${basePath} without authentication` +
          " the response status code will be 401 and the response body will contain the message 'Unauthorized: No access token provided'",
        async () => {
          const response = await request(app).get(basePath);

          // console.info(
          //   "[LIST WIHTOUT AUTHENTICATION] response.body = ",
          //   response.body
          // );
          expect(response.body).toHaveProperty(
            "message",
            "Unauthorized: No access token provided"
          );
          listUnauthorizedBodyResponse = response.body;
          return expect(response.statusCode).toBe(401);
        }
      );
    });
  });

  describe("DELETE SERVICE ORDER", () => {
    describe("DELETING ORDER AS AN ADMIN", () => {
      test(
        `When an Admin access DELETE ${basePath}/:id` +
          " sending, in the path param, the valid id of order " +
          " the response status code will be 204",
        async () => {
          // console.warn("[DELETE AS ADMIN] orderId = ", orderId);
          const response = await request(app)
            .delete(setIdInBasePath(orderId))
            .set("Authorization", accessTokenAsAdmin)
            .set("refreshToken", refreshTokenAsAdmin);

          // console.warn(response.body);

          return expect(response.statusCode).toBe(204);
        }
      );
    });

    describe("DELETING ORDER AS AN CLIENT", () => {
      test(
        `When an Client access DELETE ${basePath}/:id` +
          " sending, in the path param, the valid id of order " +
          " the response status code will be 401",
        async () => {
          // console.warn("[DELETE AS CLIENT] orderId = ", orderId);
          const response = await request(app)
            .delete(setIdInBasePath(orderId))
            .set("Authorization", accessTokenAsClient)
            .set("refreshToken", refreshTokenAsClient);

          // console.warn(response.body);

          expect(response.body).toHaveProperty(
            "message",
            "User haven't permission"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });

    describe("DELETING ORDER AS AN MEMBER", () => {
      test(
        `When an Member access DELETE ${basePath}/:id` +
          " sending, in the path param, the valid id of order " +
          " the response status code will be 401",
        async () => {
          // console.warn("[DELETE AS MEMBER] orderId = ", orderId);
          const response = await request(app)
            .delete(setIdInBasePath(orderId))
            .set("Authorization", accessTokenAsMember)
            .set("refreshToken", refreshTokenAsMember);

          // console.warn(response.body);

          expect(response.body).toHaveProperty(
            "message",
            "User haven't permission"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });

    describe("DELETING ORDER WITHOUT AUTHENTICATION", () => {
      test(
        `When access DELETE ${basePath}/:id without authentication` +
          " sending, in the path param, the valid id of order " +
          " the response status code will be 401",
        async () => {
          // console.warn("[DELETE WITHOUT AUTHENTICATION] orderId = ", orderId);
          const response = await request(app).delete(setIdInBasePath(orderId));

          // console.warn(response.body);

          expect(response.body).toHaveProperty(
            "message",
            "No authorization required"
          );
          return expect(response.statusCode).toBe(401);
        }
      );
    });
  });
});
