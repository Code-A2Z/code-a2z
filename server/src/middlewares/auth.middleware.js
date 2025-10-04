import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response.js';
import { JWT_SECRET_ACCESS_KEY } from '../constants/env.js';

const authenticateUser = (req, res, next) => {
  try {
    if (!JWT_SECRET_ACCESS_KEY) {
      throw new Error("JWT secret not configured");
    }

    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return sendResponse(res, 401, 'error', 'Access Denied: No Token Provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET_ACCESS_KEY);
    req.user = decoded; // store full payload
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, 'error', 'Access token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      return sendResponse(res, 403, 'error', 'Access token invalid');
    }
    return sendResponse(res, 500, 'error', err.message || 'Authentication error');
  }
};

export default authenticateUser;
