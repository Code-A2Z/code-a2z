/**
 * POST /api/auth/refresh - Refresh access token using refresh token
 * @returns {Object} Success message with new access token
 */

import jwt from 'jsonwebtoken';
import { sendResponse } from '../../utils/response.js';
import { COOKIE_TOKEN, NODE_ENV } from '../../typings/index.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_SECRET_REFRESH_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_EXPIRES_IN_NUM,
  SERVER_ENV,
} from '../../config/env.js';

const refresh = async (req, res) => {
  try {
    const refresh_token = req.cookies?.[COOKIE_TOKEN.REFRESH_TOKEN];

    if (!refresh_token) {
      return sendResponse(res, 401, 'No refresh token provided');
    }

    // Verify the refresh token
    jwt.verify(refresh_token, JWT_SECRET_REFRESH_KEY, (err, decoded) => {
      if (err) {
        return sendResponse(res, 401, 'Invalid or expired refresh token');
      }

      const payload = {
        user_id: decoded.user_id,
        subscriber_id: decoded.subscriber_id,
      };

      // Generate a new access token
      const new_access_token = jwt.sign(payload, JWT_SECRET_ACCESS_KEY, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      });

      // Replace old access token cookie
      res.cookie(COOKIE_TOKEN.ACCESS_TOKEN, new_access_token, {
        httpOnly: true,
        secure: SERVER_ENV === NODE_ENV.PRODUCTION,
        sameSite: 'strict',
        maxAge: JWT_ACCESS_EXPIRES_IN_NUM,
      });

      return sendResponse(res, 200, 'Access token refreshed successfully');
    });
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default refresh;
