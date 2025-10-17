/**
 * POST /api/auth/signup - Register a new user
 * @param {string} fullname - User's full name (min 3 characters)
 * @param {string} email - Valid email address
 * @param {string} password - Password (6-20 chars, uppercase, lowercase, number)
 * @returns {Object} User object with account details
 */

import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import USER from '../../models/user.model.js';
import SUBSCRIBER from '../../models/subscriber.model.js';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../utils/regex.js';
import { SALT_ROUNDS } from '../../constants/index.js';
import { COOKIE_TOKEN, NODE_ENV } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_SECRET_REFRESH_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_ACCESS_EXPIRES_IN_NUM,
  JWT_REFRESH_EXPIRES_IN_NUM,
  SERVER_ENV,
} from '../../config/env.js';

/**
 * Generate a unique username from email
 * @param {string} email - User's email address
 * @returns {Promise<string>} - Unique username
 */
export const generateUsername = async email => {
  let username = email.split('@')[0];
  const isUsernameNotUnique = await USER.exists({
    'personal_info.username': username,
  });
  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 5);
  }
  return username;
};

/**
 * Generate access and refresh JWT tokens
 * @param {Object} payload - JWT payload data
 * @returns {Object} - Object containing accessToken and refreshToken
 */
export const generateTokens = payload => {
  const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS_KEY, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH_KEY, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || fullname.length < 3) {
    return sendResponse(
      res,
      400,
      'Full name must be at least 3 characters long'
    );
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return sendResponse(res, 400, 'Invalid email address');
  }

  if (!password || !PASSWORD_REGEX.test(password)) {
    return sendResponse(
      res,
      400,
      'Password must be 6-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    );
  }

  try {
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    const username = await generateUsername(email);

    let subscriber = await SUBSCRIBER.findOne({ email });

    if (subscriber) {
      const userExists = await USER.exists({
        'personal_info.subscriber_id': subscriber._id,
      });

      if (userExists) {
        return sendResponse(res, 400, 'Email is already registered');
      }

      if (!subscriber.is_subscribed) {
        subscriber.is_subscribed = true;
        subscriber.subscribed_at = new Date();
        subscriber.unsubscribed_at = null;
        await subscriber.save();
      }
    } else {
      subscriber = new SUBSCRIBER({
        email,
        is_subscribed: true,
        subscribed_at: new Date(),
      });
      await subscriber.save();
    }

    const user = new USER({
      personal_info: {
        fullname,
        subscriber_id: subscriber._id,
        password: hashed_password,
        username,
      },
    });

    const saved_user = await user.save();

    const payload = {
      user_id: saved_user._id,
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

    return sendResponse(res, 201, 'User registered successfully', {
      user_id: saved_user._id,
      username: saved_user.personal_info.username,
      fullname: saved_user.personal_info.fullname,
      profile_img: saved_user.personal_info.profile_img,
      role: saved_user.role,
    });
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default signup;
