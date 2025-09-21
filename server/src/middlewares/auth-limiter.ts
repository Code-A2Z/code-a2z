import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { sendResponse } from '../utils/response';

export const authLimit = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
});

const authLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  authLimit.consume(req.ip ?? 'unknown-ip')
    .then(() => next())
    .catch(() => sendResponse(res, "error", 'Too many requests, please try again later.', null, 429));
};

export default authLimiter;
