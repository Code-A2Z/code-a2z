import { Response } from "express";

import Notification from "../../../../models/notification.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const likeStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { _id } = req.body;

  Notification.exists({ type: "like", project: _id, user: user_id })
    .then(isLiked => {
      return sendResponse(res, "success", "Like status fetched successfully", { isLiked }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default likeStatus;
