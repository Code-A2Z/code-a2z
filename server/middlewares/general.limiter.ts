import { RateLimiterMemory } from 'rate-limiter-flexible';
import { sendResponse } from '../utils/response';
import { NextFunction, Response, Request } from 'express';

const generalLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60,
  blockDuration: 5 * 60,
});

const generalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  generalLimiter.consume(req.ip ?? 'unknown-ip')
    .then(() => next())
    .catch(() => sendResponse(res, "error", 'Too many requests, please try again later.', null, 429));
};

export default generalMiddleware;
