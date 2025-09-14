import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser extends JwtPayload {
  id: string;
};

export interface AuthenticatedRequest extends Request {
  user?: string;
};
