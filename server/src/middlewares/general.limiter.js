import { RateLimiterMemory } from 'rate-limiter-flexible';
import { sendResponse } from '../utils/response.js';

const generalLimit = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60,
  blockDuration: 5 * 60,
});

const generalLimiter = (req, res, next) => {
  generalLimit
    .consume(req.ip)
    .then(() => next())
    .catch(() => sendResponse(res, 429, 'Too many requests'));
};

export default generalLimiter;
