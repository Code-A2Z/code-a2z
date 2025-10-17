/**
 * POST /api/auth/login - Authenticate user and return tokens
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} User object with authentication tokens
 */

import bcrypt from 'bcrypt';

import USER from '../../models/user.model.js';
import SUBSCRIBER from '../../models/subscriber.model.js';
import { COOKIE_TOKEN, NODE_ENV } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';
import { generateTokens } from './signup.js';
import {
  JWT_ACCESS_EXPIRES_IN_NUM,
  JWT_REFRESH_EXPIRES_IN_NUM,
  SERVER_ENV,
} from '../../config/env.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, 400, 'Email and password are required');
  }

  try {
    const subscriber = await SUBSCRIBER.findOne({ email });

    if (!subscriber) {
      return sendResponse(res, 404, 'Email not found');
    }

    const user = await USER.findOne({
      'personal_info.subscriber_id': subscriber._id,
    });

    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }

    if (!user.personal_info?.password) {
      return sendResponse(res, 500, 'User data is incomplete');
    }

    const is_password_match = await bcrypt.compare(
      password,
      user.personal_info.password
    );

    if (!is_password_match) {
      return sendResponse(res, 401, 'Incorrect password');
    }

    const payload = {
      user_id: user._id,
      subscriber_id: subscriber._id,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie(COOKIE_TOKEN.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: SERVER_ENV === NODE_ENV.PRODUCTION,
      sameSite: 'strict',
      maxAge: JWT_ACCESS_EXPIRES_IN_NUM,
    });

    res.cookie(COOKIE_TOKEN.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: SERVER_ENV === NODE_ENV.PRODUCTION,
      sameSite: 'strict',
      maxAge: JWT_REFRESH_EXPIRES_IN_NUM,
    });

    return sendResponse(res, 200, 'Login successful', {
      user_id: user._id,
      username: user.personal_info.username,
      fullname: user.personal_info.fullname,
      profile_img: user.personal_info.profile_img,
      role: user.role,
    });
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default login;
