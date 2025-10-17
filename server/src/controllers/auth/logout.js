/**
 * POST /api/auth/logout - Clear authentication cookies and log out user
 * @returns {Object} Success message
 */

import { sendResponse } from '../../utils/response.js';
import { COOKIE_TOKEN, NODE_ENV } from '../../typings/index.js';
import { SERVER_ENV } from '../../config/env.js';

const logout = async (req, res) => {
  try {
    // Clear both access and refresh cookies
    res.clearCookie(COOKIE_TOKEN.ACCESS_TOKEN, {
      httpOnly: true,
      secure: SERVER_ENV === NODE_ENV.PRODUCTION,
      sameSite: 'strict',
    });

    res.clearCookie(COOKIE_TOKEN.REFRESH_TOKEN, {
      httpOnly: true,
      secure: SERVER_ENV === NODE_ENV.PRODUCTION,
      sameSite: 'strict',
    });

    return sendResponse(res, 200, 'Logged out successfully');
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default logout;
