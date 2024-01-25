import { unauthorized } from "@serializer/erros/401";
import { ROLE, Role, User } from "@prisma/client";
import { ParamsUser, getUser } from "@repositories/user";
import { NextFunction, Request, Response } from "express";
import { VerifyErrors, verify } from "jsonwebtoken";

// Extend the Request interface to include the userRole property
interface CustomRequest
  extends Request<{}, {}, { userId: string }, qs.ParsedQs & ParamsUser> {
  userRole?: ROLE;
}

export const validationUserAccessToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) return unauthorized(res);

    const accessToken = authorization.split("Bearer ")[1];

    if (!accessToken) return unauthorized(res);

    const user = await new Promise<User & { role: Role }>((resolve, reject) => {
      return verify(
        accessToken,
        process.env.TOKEN_SECRET,
        async (err: VerifyErrors, decoded: User & { role: Role }) => {
          if (err) return reject(err);
          const hasUser = await getUser({
            id: decoded.id,
          });
          if (!hasUser) return reject("User not found");
          return resolve(decoded);
        }
      );
    });

    if (!user) return unauthorized(res);

    req.body.userId = user.id;
    req.userRole = user.role.name; // Save the user's role in the request object

    return next();
  } catch (error) {
    return unauthorized(res);
  }
};
