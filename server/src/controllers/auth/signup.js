import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.model.js';
import Subscriber from '../../models/subscriber.model.js';

import { emailRegex, passwordRegex } from '../../utils/regex.js';
import { sendResponse } from '../../utils/response.js';
import { SALT_ROUNDS } from '../../constants/index.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_EXPIRES_IN,
  NODE_ENV,
} from '../../constants/env.js';
import { NodeEnv } from '../../typings/index.js';

export const generateUsername = async email => {
  let username = email.split('@')[0];
  const isUsernameNotUnique = await User.exists({
    'personal_info.username': username,
  });
  if (isUsernameNotUnique) username += nanoid().substring(0, 5);
  return username;
};

const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return sendResponse(
      res,
      400,
      'error',
      'Full name should be at least 3 letters long',
      null
    );
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, 'error', 'Invalid email', null);
  }
  if (!passwordRegex.test(password)) {
    return sendResponse(
      res,
      400,
      'error',
      'Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      null
    );
  }

  try {
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    const username = await generateUsername(email);

    // Check if the email exists in subscribers collection, if yes, update isSubscribed to true, else create a new subscriber
    let subscribeUser = await Subscriber.findOne({ email });
    if (subscribeUser) {
      if (await User.exists({ 'personal_info.email': subscribeUser._id })) {
        return sendResponse(
          res,
          400,
          'error',
          'Email is already registered',
          null
        );
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
      email: savedUser?.personal_info?.email,
    };
    const secret = JWT_SECRET_ACCESS_KEY;
    const options = { expiresIn: Number(JWT_EXPIRES_IN) };

    const token = jwt.sign(payload, secret, options);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
      err.message || 'Internal Server Error',
      null
    );
  }
};

export default signup;
