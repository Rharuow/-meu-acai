import express from "express";
import swaggerUi from "swagger-ui-express";
import "module-alias/register";
import cors from "cors";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

import { router } from "./routes";
import swaggerDef from "./swagger-spec.json";
import { ProtoGrpcType } from "./protoBufferTypes/order-service";
import { createDefaultAdmin, createRolesDefault } from "./seed";

const PORT = process.env.PORT || 8080;

// Create a instance of express services
const app = express();

// Adding middleware cores to express services
app.use(cors());

app.use((req, res, next) => {
  const allowedOrigins = [process.env.ORIGIN_URL, process.env.APP_URL]; // Add your allowed origins here

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } // Adjust as needed for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  ); // Use HSTS
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// Adding middleware to accept json at body requests and limiting 10kb
app.use(express.json({ limit: "10kb" }));

// Adding middleware to create routes to docs generated by swagger.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDef));

// Adding middleware to instance of all the routes.
app.use("/api/v1", router);

// gRPC Setup
const orderPackageDefinition = protoLoader.loadSync(
  path.join(__dirname, "./protos/order-service.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const orderPackage = grpc.loadPackageDefinition(
  orderPackageDefinition
) as unknown as ProtoGrpcType;

const orderStub = new orderPackage.OrderService(
  process.env.ORDER_SERVICE_URL,
  grpc.credentials.createInsecure()
);

// Methods to start server.
const start = async () => {
  try {
    // Method to make express service start to listen requests in port defined by const PORT.
    if (process.env.NODE_ENV !== "test")
      app.listen(PORT, async () => {
        await createRolesDefault();
        await createDefaultAdmin();
        console.log(`API RUN IN: ${process.env.ORIGIN_URL}`);
      });
  } catch (error) {
    process.exit(1);
  }
};

start();

export { app, orderStub };
