import { RateLimiterMemory } from 'rate-limiter-flexible';
import { sendResponse } from '../utils/response';
import { Request, Response, NextFunction } from 'express';

const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
});

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  authLimiter.consume(req.ip ?? 'unknown-ip')
    .then(() => next())
    .catch(() => sendResponse(res, "error", 'Too many requests, please try again later.', null, 429));
};

export default authMiddleware;
