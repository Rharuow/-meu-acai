import "module-alias/register";
import { CreateOrderResponse__Output } from "./../../protoBufferTypes/CreateOrderResponse";
import { orderStub } from "@/app";
import { Request, Response } from "express";

let data: CreateOrderResponse__Output;
let status: number = 200;
let message: string = "Order created successfully";

export const producerCreateServiceOrder = (
  req: Request<{}, {}, CreateOrderResponse__Output & { userId: string }, {}>,
  res: Response
) => {
  try {
    return orderStub.createOrder(req.body, (error, response) => {
      if (error) {
        // console.log("code = ", error.code);
        // console.log("details = ", error.details);
        // console.log("metadata = ", error.metadata);
        // console.log("name = ", error.name);
        // console.log("stack = ", error.stack);
        // console.log("message = ", error.message);
        status = 500;
        message = error.message;
      }
      data = response;
      return res
        .status(status)
        .json({ message, ...(data && data.id && { data: { id: data.id } }) });
    });
  } catch (error) {
    console.error("Error producing message:", error);
    return res.status(500).send("Internal Server Error");
  }
};
