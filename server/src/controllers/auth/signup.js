import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.model.js';
import Subscriber from '../../models/subscriber.model.js';
import { emailRegex, passwordRegex } from '../../utils/regex.js';
import { sendResponse } from '../../utils/response.js';
import { SALT_ROUNDS } from '../../constants/index.js';
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

// Generate unique username
export const generateUsername = async email => {
  let username = email.split('@')[0];
  const isUsernameNotUnique = await User.exists({
    'personal_info.username': username,
  });
  if (isUsernameNotUnique) username += nanoid().substring(0, 5);
  return username;
};

// Helper to create tokens
const generateTokens = payload => {
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

  if (fullname.length < 3)
    return sendResponse(
      res,
      400,
      'error',
      'Full name should be at least 3 letters long'
    );
  if (!emailRegex.test(email))
    return sendResponse(res, 400, 'error', 'Invalid email');
  if (!passwordRegex.test(password))
    return sendResponse(
      res,
      400,
      'error',
      'Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    );

  try {
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    const username = await generateUsername(email);

    // Check Subscriber
    let subscribeUser = await Subscriber.findOne({ email });
    if (subscribeUser) {
      if (await User.exists({ 'personal_info.email': subscribeUser._id })) {
        return sendResponse(res, 400, 'error', 'Email is already registered');
      }
      if (!subscribeUser.isSubscribed) {
        subscribeUser.isSubscribed = true;
        subscribeUser.subscribedAt = new Date();
        await subscribeUser.save();
      }
    } else {
      subscribeUser = new Subscriber({
        email,
        isSubscribed: true,
        subscribedAt: new Date(),
      });
      await subscribeUser.save();
    }

    const user = new User({
      personal_info: {
        fullname,
        email: subscribeUser._id,
        password: hashed_password,
        username,
      },
    });

    const savedUser = await user.save();
    const payload = {
      userId: savedUser._id,
      email: savedUser.personal_info.email,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Set cookies securely
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

    return sendResponse(
      res,
      201,
      'success',
      'User registered successfully',
      savedUser
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default signup;
