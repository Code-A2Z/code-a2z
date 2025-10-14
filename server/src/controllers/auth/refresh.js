import jwt from 'jsonwebtoken';
import { sendResponse } from '../../utils/response.js';
import { CookieToken, NodeEnv } from '../../typings/index.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_SECRET_REFRESH_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_EXPIRES_IN_NUM,
  NODE_ENV,
} from '../../config/env.js';

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[CookieToken.REFRESH_TOKEN];

    if (!refreshToken) {
      return sendResponse(res, 401, 'error', 'No refresh token provided');
    }

    // Verify the refresh token
    jwt.verify(refreshToken, JWT_SECRET_REFRESH_KEY, (err, decoded) => {
      if (err) {
        return sendResponse(
          res,
          401,
          'error',
          'Invalid or expired refresh token'
        );
      }

      const payload = {
        userId: decoded.userId,
        email: decoded.email,
      };

      // Generate a new access token
      const newAccessToken = jwt.sign(payload, JWT_SECRET_ACCESS_KEY, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      });

      // Replace old access token cookie
      res.cookie(CookieToken.ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
        secure: NODE_ENV === NodeEnv.PRODUCTION,
        sameSite: 'strict',
        maxAge: JWT_ACCESS_EXPIRES_IN_NUM,
      });

      return sendResponse(
        res,
        200,
        'success',
        'Access token refreshed successfully'
      );
    });
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default refresh;
