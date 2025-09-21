import bcrypt from "bcrypt";
import { Request, Response } from "express";

import User from "../models/user.model";
import Subscriber from "../models/subscriber.model";
import generateUsername from "../utils/generate.username";
import { AuthenticatedRequest } from "../middlewares/typings";
import { emailRegex, passwordRegex } from "../utils/regex";
import { sendResponse } from "../utils/response";
import { SALT_ROUNDS } from "../constants";

export const signup = async (
  req: Request,
  res: Response,
) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return sendResponse(res, "error", "Full name should be at least 3 letters long", null, 400);
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, "error", "Invalid email", null, 400);
  }
  if (!passwordRegex.test(password)) {
    return sendResponse(
      res,
      "error",
      "Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      null,
      400
    );
  }

  try {
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    const username = await generateUsername(email);

    // Check if the email exists in subscribers collection, if yes, update isSubscribed to true, else create a new subscriber
    let subscribeUser = await Subscriber.findOne({ email });
    if (subscribeUser && !subscribeUser.isSubscribed) {
      subscribeUser.isSubscribed = true;
      subscribeUser.subscribedAt = new Date();
    } else if (!subscribeUser) {
      subscribeUser = new Subscriber({ email, isSubscribed: true, subscribedAt: new Date() });
    }
    await subscribeUser.save();

    const user = new User({
      personal_info: { fullname, email: subscribeUser._id, password: hashed_password, username }
    });

    const savedUser = await user.save();
    // TODO: Send access token in cookies
    return sendResponse(res, "success", "User registered successfully", { user: savedUser }, 201);
  } catch (err) {
    return sendResponse(res, "error", "Internal Server Error", null, 500);
  }
};

export const login = async (
  req: Request,
  res: Response,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return sendResponse(res, "error", "Email not found", null, 404);
    }

    if (!user.personal_info || !user.personal_info.password) {
      return sendResponse(res, "error", "User data is incomplete", null, 500);
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) return sendResponse(res, "error", "Incorrect password", null, 401);

    return sendResponse(res, "success", "Login successful", { user: user }, 200);
  } catch (err) {
    return sendResponse(res, "error", "Internal Server Error", null, 500);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { currentPassword, newPassword } = req.body;

  if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
    return sendResponse(
      res,
      "error",
      "Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      null,
      403
    );
  }

  User.findOne({ _id: req.user })
    .then((user) => {
      if (!user || !user.personal_info || !user.personal_info.password) {
        return sendResponse(res, "error", "User not found or user data is incomplete", null, 404);
      }
      bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
        if (err) {
          return sendResponse(res, "error", "Some error occured while changing the password, please try again later", null, 500);
        }

        if (!result) {
          return sendResponse(res, "error", "Incorrect current password", null, 403);
        }

        bcrypt.hash(newPassword, SALT_ROUNDS, (err, hashed_password) => {
          User.findOneAndUpdate({ _id: req.user }, { "personal_info.password": hashed_password })
            .then(() => {
              return sendResponse(res, "success", "Password changed successfully", null, 200);
            })
            .catch(err => {
              return sendResponse(res, "error", "Some error occured while saving new password, please try again later", null, 500);
            })
        })
      })
    })
    .catch(err => {
      return sendResponse(res, "error", "User not found!", null, 500);
    })
};
