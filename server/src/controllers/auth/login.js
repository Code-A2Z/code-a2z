import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.model.js';
import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';
import { CookieToken, NodeEnv } from '../../typings/index.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_SECRET_REFRESH_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_ACCESS_EXPIRES_IN_NUM,
  JWT_REFRESH_EXPIRES_IN_NUM,
  NODE_ENV,
} from '../../config/env.js';

// Helper function to generate both tokens
const generateTokens = payload => {
  const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS_KEY, {
    expiresIn: JWT_ACCESS_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH_KEY, {
    expiresIn: JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check subscriber existence
    const isSubscriber = await Subscriber.exists({ email });
    if (!isSubscriber) {
      return sendResponse(res, 404, 'error', 'Email not found');
    }

    const user = await User.findOne({
      'personal_info.email': isSubscriber._id,
    });
    if (!user) {
      return sendResponse(res, 404, 'error', 'User not found');
    }

    if (!user.personal_info?.password) {
      return sendResponse(res, 500, 'error', 'User data is incomplete');
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) return sendResponse(res, 401, 'error', 'Incorrect password');

    const payload = { userId: user._id, email: user.personal_info.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Set secure cookies
    res.cookie(CookieToken.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: 'strict',
      maxAge: JWT_ACCESS_EXPIRES_IN_NUM,
    });

    res.cookie(CookieToken.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: 'strict',
      maxAge: JWT_REFRESH_EXPIRES_IN_NUM,
    });

    return sendResponse(res, 200, 'success', 'Login successful', user);
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default login;
