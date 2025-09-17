import { authLimiter } from './authLimiter.js'
import { generalLimiter } from './generalLimiter.js';

export const authMiddleware = (req, res, next) => {
    authLimiter.consume(req.ip).then(() => next()).catch(() => res.status(429).send("Too many requests to /auth"));
}

export const generalMiddleware = (req, res, next) => {
    generalLimiter.consume(req.ip).then(() => next()).catch(() => res.status(429).send("Too many requests"));
}