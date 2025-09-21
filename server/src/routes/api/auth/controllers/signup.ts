import { Request, Response } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

import User from "../../../../models/user.model";
import Subscriber from "../../../../models/subscriber.model";
import { emailRegex, passwordRegex } from "../../../../utils/regex";
import { sendResponse } from "../../../../utils/response";
import { SALT_ROUNDS } from "../../../../constants";

export const generateUsername = async (email: string) => {
  let username = email.split("@")[0];
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });
  if (isUsernameNotUnique) username += nanoid().substring(0, 5);
  return username;
};

const signup = async (
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

export default signup;
