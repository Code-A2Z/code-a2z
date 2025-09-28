import jwt from 'jsonwebtoken';

import { sendResponse } from '../utils/response.js';
import { JWT_SECRET_ACCESS_KEY } from '../constants/env.js';

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return sendResponse(res, 401, 'error', 'Access Denied: No Token Provided');
  }

  try {
    jwt.verify(token, JWT_SECRET_ACCESS_KEY, (err, user) => {
      if (err) {
        return sendResponse(res, 403, 'error', 'Access token is invalid');
      }
      req.user = user.id;
      next();
    });
  } catch (error) {
    return sendResponse(res, 500, 'error', error.message || 'Token not found');
  }
};

export default authenticateUser;
