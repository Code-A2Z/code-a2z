import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user.model.js';
import Subscriber from '../../models/subscriber.model.js';

import { sendResponse } from '../../utils/response.js';
import {
  JWT_SECRET_ACCESS_KEY,
  JWT_EXPIRES_IN,
  NODE_ENV,
} from '../../constants/env.js';
import { NodeEnv } from '../../typings/index.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isSubscriber = await Subscriber.exists({ email });
    if (!isSubscriber) {
      return sendResponse(res, 404, 'error', 'Email not found', null);
    }

    const user = await User.findOne({
      'personal_info.email': isSubscriber?._id,
    });
    if (!user) {
      return sendResponse(res, 404, 'error', 'User not found', null);
    }

    if (!user.personal_info || !user.personal_info.password) {
      return sendResponse(res, 500, 'error', 'User data is incomplete', null);
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch)
      return sendResponse(res, 401, 'error', 'Incorrect password', null);

    const payload = { userId: user._id, email: user?.personal_info?.email };
    const secret = JWT_SECRET_ACCESS_KEY;
    const options = { expiresIn: JWT_EXPIRES_IN };

    const token = jwt.sign(payload, secret, options);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: NODE_ENV === NodeEnv.PRODUCTION,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendResponse(res, 200, 'success', 'Login successful', user);
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

export default login;
