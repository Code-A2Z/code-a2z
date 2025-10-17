import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response.js';
import { COOKIE_TOKEN } from '../typings/index.js';
import { JWT_SECRET_ACCESS_KEY } from '../config/env.js';

const authenticateUser = (req, res, next) => {
  const token = req.cookies?.[COOKIE_TOKEN.ACCESS_TOKEN];

  if (!token) {
    return sendResponse(res, 401, 'Access Denied: No access token provided');
  }

  try {
    jwt.verify(token, JWT_SECRET_ACCESS_KEY, (err, decoded) => {
      if (err) {
        // Token invalid or expired
        return sendResponse(
          res,
          401,
          'Access token invalid or expired. Please refresh.'
        );
      }
      req.user = decoded.userId;
      next();
    });
  } catch (error) {
    return sendResponse(res, 500, error.message || 'Token verification failed');
  }
};

export default authenticateUser;
