import { Request, Response } from "express";

import User from "../../../../models/user.model";
import { sendResponse } from "../../../../utils/response";

const getProfile = async (
  req: Request,
  res: Response,
) => {
  const { username } = req.body;

  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -google_auth -updatedAt -projects")
    .then(user => {
      return sendResponse(res, "success", "User fetched successfully", { user }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default getProfile;
