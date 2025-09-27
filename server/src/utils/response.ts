import { Response } from "express";
import { ResponseStatus } from "../typings";

export const sendResponse = (
  res: Response,
  status: ResponseStatus,
  message: string,
  data: object | null = null,
  code: number = 200
) => {
  return res.status(code).json({
    status,
    message,
    ...(data ? { data } : {})
  });
};
