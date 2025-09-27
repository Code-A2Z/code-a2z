import bcrypt from "bcrypt";
import { Response } from "express";

import User from "../../../../models/user.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { passwordRegex } from "../../../../utils/regex";
import { sendResponse } from "../../../../utils/response";
import { SALT_ROUNDS } from "../../../../constants";

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

export default changePassword;
