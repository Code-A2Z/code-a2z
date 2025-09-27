import { Request, Response } from "express";

import Comment from "../../../../models/comment.model";
import { sendResponse } from "../../../../utils/response";

const getComments = async (
  req: Request,
  res: Response,
) => {
  const { project_id, skip } = req.body;
  const maxLimit = 5;

  Comment.find({ project_id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(maxLimit)
    .sort({ "commentedAt": -1 })
    .then(comment => {
      return sendResponse(res, "success", "Comments fetched successfully", { comment }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default getComments;
