import bcrypt from "bcrypt";
import { Request, Response } from "express";

import User from "../../../../models/user.model";
import { sendResponse } from "../../../../utils/response";

const login = async (
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

export default login;
