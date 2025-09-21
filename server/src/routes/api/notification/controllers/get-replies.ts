import { Request, Response } from "express";

import Comment from "../../../../models/comment.model";
import { sendResponse } from "../../../../utils/response";

const getReplies = async (
  req: Request,
  res: Response,
) => {
  const { _id, skip } = req.body;
  const maxLimit = 5;

  Comment.findOne({ _id })
    .populate({
      path: "children",
      options: {
        limit: maxLimit,
        skip: skip,
        sort: { "commentedAt": -1 }
      },
      populate: {
        path: 'commented_by',
        select: 'personal_info.username personal_info.fullname personal_info.profile_img'
      },
      select: "-project_id -updatedAt"
    })
    .select("children")
    .then(doc => {
      return sendResponse(res, "success", "Replies fetched successfully", { replies: doc?.children }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default getReplies;
