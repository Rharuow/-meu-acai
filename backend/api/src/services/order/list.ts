import { orderStub } from "@/app";
import { ListOrderRequest__Output } from "@/protoBufferTypes/ListOrderRequest";
import { ListOrderResponse__Output } from "@/protoBufferTypes/ListOrderResponse";
import { ROLE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the userRole property
interface CustomRequest extends Request<{}, {}, {}, ListOrderRequest__Output> {
  userRole?: ROLE;
  response?: ListOrderResponse__Output;
}

export const listServiceOrder = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let status: number = 200;
  let message: string = "Orders listed successfully";
  try {
    return orderStub.listOrder(req.query, (error, response) => {
      if (error) {
        // console.log("code = ", error.code);
        // console.log("details = ", error.details);
        // console.log("metadata = ", error.metadata);
        // console.log("name = ", error.name);
        // console.log("stack = ", error.stack);
        console.log("message = ", error.message);
        status = 500;
        message = error.message;
      }

      if (!response) {
        status = 404;
        message = "orders not found";
      }

      if (req.userRole === "ADMIN" || status !== 200)
        return res
          .status(status)
          .json({ message, ...(response && { data: response }) });

      req.response = response;

      return next();
    });
  } catch (error) {
    console.error("Error producing message:", error);
    return res.status(500).send("Internal Server Error");
  }
};
