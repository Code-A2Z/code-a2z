import { RateLimiterMemory } from 'rate-limiter-flexible';
import { sendResponse } from '../utils/response.js';

// Rate limit settings
const authLimit = new RateLimiterMemory({
  points: 10,            // allowed attempts
  duration: 15 * 60,     // per 15 minutes
  blockDuration: 15 * 60 // block for 15 minutes after limit reached
});

const authLimiter = async (req, res, next) => {
  try {
    // consume 1 point for this IP
    await authLimit.consume(req.ip);
    next();
  } catch (error) {
    return sendResponse(res, 429, 'Too many requests. Please try again later.');
  }
};

export default authLimiter;
