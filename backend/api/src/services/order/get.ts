import { orderStub } from "@/app";
import { GetOrderResponse__Output } from "@/protoBufferTypes/GetOrderResponse";
import { ROLE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the userRole property
interface CustomRequest extends Request<{ id: string }, {}, {}, {}> {
  userRole?: ROLE;
  response?: GetOrderResponse__Output;
}

export const getServiceOrder = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let status: number = 200;
  let message: string = "Order retrieved successfully";
  try {
    return orderStub.getOrder(req.params, (error, response) => {
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

      if (!response) {
        status = 404;
        message = "order not found";
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
