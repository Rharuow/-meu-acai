import { ListOrderResponse__Output } from "@/protoBufferTypes/ListOrderResponse";
import { ROLE } from "@prisma/client";
import { ParamsUser } from "@repositories/user";
import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the userRole property
interface CustomRequest
  extends Request<{}, {}, { userId: string }, qs.ParsedQs & ParamsUser> {
  userRole?: ROLE;
  response: ListOrderResponse__Output;
}

export const addDefaultOrderBy = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  req.query.orderBy = req.query.orderBy ?? "id";

  return next();
};

export const validationClientOrMemberOwnerOrder = (
  req: CustomRequest,
  _: Response,
  next: NextFunction
) => {
  if (req.userRole === "CLIENT" || req.userRole === "MEMBER") {
    req.query.filter = req.query.filter
      ? req.query.filter + `,userId:like:${req.body.userId}`
      : `userId:like:${req.body.userId}`;
  }

  return next();
};

export const validationOwnershipOrders = (
  req: CustomRequest,
  res: Response
) => {
  let status: number = 200;
  let message: string = "Orders listed successfully";

  if (req.response.orders.some((order) => order.userId !== req.body.userId)) {
    status = 401;
    message = "This order doesn't belong to user logged";
    req.response = null;
  }

  return res.status(status).json({ message, data: req.response });
};
