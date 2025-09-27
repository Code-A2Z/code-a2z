import { Request, Response } from "express";

import User from "../../../../models/user.model";
import { sendResponse } from "../../../../utils/response";

const searchUser = async (
  req: Request,
  res: Response,
) => {
  const { query } = req.body;

  User.find({ "personal_info.username": new RegExp(query, 'i') })
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then(users => {
      return sendResponse(res, "success", "Users fetched successfully", { users }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default searchUser;
