import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { AuthenticatedRequest, AuthenticatedUser } from "./typings";
import { sendResponse } from "../utils/response";

dotenv.config();

const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void | Response => {
  const secret_key = process.env.SECRET_ACCESS_KEY;
  if (!secret_key) {
    return sendResponse(res, "error", "Secret key not found", null, 500);
  }

  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return sendResponse(res, "error", "Access Denied: No Token Provided", null, 401);
  }

  try {
    jwt.verify(token.split(" ")[1], secret_key, (err, decoded) => {
      if (err || !decoded) {
        return sendResponse(res, "error", "Access token is invalid", null, 403);
      }
      req.user = (decoded as AuthenticatedUser).id;
      next();
    });
  } catch {
    return sendResponse(res, "error", "Token verification failed", null, 500);
  }
};

export default authenticateUser;
