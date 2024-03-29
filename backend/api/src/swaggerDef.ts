export const swaggerDef = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ice cream market.",
      description:
        "This project it's api to feed the ice cream market application service.",
      contact: {
        phone: "+55(84)981758502",
        email: "haryssonsoares@gmail.com",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "If you run this project locally",
      },
      // {
      //   url: "https://coodesh-test-spacex-api.onrender.com",
      //   description: "To access routes in production",
      // },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ROLE: {
          type: "string",
          enum: ["ADMIN", "MEMBER", "CLIENT"],
        },
        Role: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            name: { $ref: "#/components/schemas/ROLE" },
            user: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            name: { type: "string" },
            password: { type: "string" },
            roleId: { type: "string", format: "uuid" },
            role: { $ref: "#/components/schemas/Role" },
            adminId: { type: "string", format: "uuid", nullable: true },
            admin: { $ref: "#/components/schemas/Admin" },
            clientId: { type: "string", format: "uuid", nullable: true },
            client: { $ref: "#/components/schemas/Client" },
            memberId: { type: "string", format: "uuid", nullable: true },
            member: { $ref: "#/components/schemas/Member" },
          },
        },
        Admin: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            email: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            userId: { type: "string", format: "uuid", nullable: true },
            user: { $ref: "#/components/schemas/User" },
            toppings: {
              type: "array",
              items: { $ref: "#/components/schemas/Topping" },
            },
            creams: {
              type: "array",
              items: { $ref: "#/components/schemas/Cream" },
            },
            products: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        Client: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            email: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            userId: { type: "string", format: "uuid", nullable: true },
            user: { $ref: "#/components/schemas/User" },
            addressId: { type: "string", format: "uuid", nullable: true },
            address: { $ref: "#/components/schemas/Address" },
            members: {
              type: "array",
              items: { $ref: "#/components/schemas/Member" },
            },
          },
        },
        Member: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            email: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            relationship: { type: "string", nullable: true },
            userId: { type: "string", format: "uuid", nullable: true },
            user: { $ref: "#/components/schemas/User" },
            clientId: { type: "string", format: "uuid", nullable: true },
            client: { $ref: "#/components/schemas/Client" },
          },
        },
        Address: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            square: { type: "string" },
            house: { type: "string" },
            clientId: { type: "string", format: "uuid" },
            client: { $ref: "#/components/schemas/Client" },
          },
        },
        Topping: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            name: { type: "string" },
            photo: { type: "string", nullable: true },
            isSpecial: { type: "boolean" },
            available: { type: "boolean" },
            price: { type: "number" },
            amount: { type: "integer" },
            unit: { type: "string", default: "Unidades" },
            adminId: { type: "string", format: "uuid" },
            createdBy: { $ref: "#/components/schemas/Admin" },
          },
        },
        Cream: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            photo: { type: "string", nullable: true },
            name: { type: "string" },
            isSpecial: { type: "boolean" },
            available: { type: "boolean" },
            price: { type: "number" },
            amount: { type: "integer" },
            unit: { type: "string", default: "Unidades" },
            adminId: { type: "string", format: "uuid" },
            createdBy: { $ref: "#/components/schemas/Admin" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            size: { type: "string", unique: true },
            name: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            photo: { type: "string", nullable: true },
            deletedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
            available: { type: "boolean" },
            price: { type: "number" },
            maxCreamsAllowed: { type: "integer" },
            maxToppingsAllowed: { type: "integer" },
            adminId: { type: "string", format: "uuid" },
            createdBy: { $ref: "#/components/schemas/Admin" },
          },
        },
        Order: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            size: { type: "string", required: true },
            paymentMethod: { type: "string", required: true },
            isPaid: {
              type: "boolean",
              required: true,
            },
            maxCreamsAllowed: {
              type: "number",
              required: true,
            },
            maxToppingsAllowed: {
              type: "number",
              required: true,
            },
            price: {
              type: "number",
              required: true,
            },
            totalPrice: {
              type: "number",
              required: true,
            },
            status: {
              type: "string",
              enum: ["received", "making", "delivering", "done"],
              required: true,
            },
            creams: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CreamToOrder",
              },
            },
            toppings: {
              type: "array",
              items: { $ref: "#/components/schemas/ToppingToOrder" },
            },
            extras: {
              type: "array",
              items: { $ref: "#/components/schemas/Extra" },
            },
            userId: {
              type: "string",
              required: true,
            },
          },
        },
        CreamToOrer: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            price: {
              type: "number",
            },
          },
        },
        Extra: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            price: {
              type: "number",
            },
          },
        },
        ToppingToOrer: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            price: {
              type: "number",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/**/*.ts"], // Adjust the path based on your project structure
};
