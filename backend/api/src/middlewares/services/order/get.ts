import { GetOrderResponse__Output } from "@/protoBufferTypes/GetOrderResponse";
import { ROLE } from "@prisma/client";
import { ParamsUser } from "@repositories/user";
import { Request, Response } from "express";

// Extend the Request interface to include the userRole property
interface CustomRequest
  extends Request<{}, {}, { userId: string }, qs.ParsedQs & ParamsUser> {
  userRole?: ROLE;
  response: GetOrderResponse__Output;
}

export const validationOwnershipOrder = (req: CustomRequest, res: Response) => {
  let status: number = 200;
  let message: string = "Order retrieved successfully";

  if (req.body.userId !== req.response.userId) {
    status = 401;
    message = "This order doesn't belong to user logged";
    req.response = null;
  }

  return res.status(status).json({ message, data: req.response });
};
