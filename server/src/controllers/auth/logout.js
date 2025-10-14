import { sendResponse } from '../../utils/response.js';
import { CookieToken, NodeEnv } from '../../typings/index.js';
import { NODE_ENV } from '../../config/env.js';

const logout = async (req, res) => {
  try {
    // Clear both access and refresh cookies
    res.clearCookie(CookieToken.ACCESS_TOKEN, {
      httpOnly: true,
      secure: NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: 'strict',
    });

    res.clearCookie(CookieToken.REFRESH_TOKEN, {
      httpOnly: true,
      secure: NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: 'strict',
    });

    return sendResponse(res, 200, 'success', 'Logged out successfully');
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default logout;
