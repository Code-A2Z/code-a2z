import { Response } from "express";

import User from "../../../../models/user.model";
import { sendResponse } from "../../../../utils/response";
import { AuthenticatedRequest } from "../../../../middlewares/typings";

const updateProfileImg = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { url } = req.body;

  User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url })
    .then(() => {
      return sendResponse(res, "success", "Profile image updated successfully", { profile_img: url }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default updateProfileImg;
