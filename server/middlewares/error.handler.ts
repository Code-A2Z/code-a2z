import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/response";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);
  return sendResponse(res, "error", err.message || "Internal Server Error", null, 500);
};
