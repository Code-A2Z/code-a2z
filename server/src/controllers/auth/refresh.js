/**
 * POST /api/auth/refresh - Refresh access token using refresh token
 * @returns {Object} Success message with new access token
 */

import jwt from 'jsonwebtoken';
import { sendResponse } from '../../utils/response.js';
import { COOKIE_TOKEN } from '../../typings/index.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_SECRET_REFRESH_KEY,
  JWT_ACCESS_EXPIRES_IN,
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

      return sendResponse(res, 200, 'Access token refreshed successfully', {
        access_token: new_access_token,
      });
    });
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default refresh;
