import { NextFunction, Response, Request } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { sendResponse } from '../utils/response';

export const generalLimit = new RateLimiterMemory({
  points: 100,
  duration: 10 * 60,
  blockDuration: 5 * 60,
});

const generalLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  generalLimit.consume(req.ip ?? 'unknown-ip')
    .then(() => next())
    .catch(() => sendResponse(res, "error", 'Too many requests, please try again later.', null, 429));
};

export default generalLimiter;
