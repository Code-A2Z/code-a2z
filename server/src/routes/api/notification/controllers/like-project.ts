import { Response } from "express";

import Project from "../../../../models/project.model";
import Notification from "../../../../models/notification.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const likeProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { _id, islikedByUser } = req.body;
  const incrementVal = !islikedByUser ? 1 : -1;

  Project.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
    .then(project => {
      if (!project) {
        return sendResponse(res, "error", "Project not found", null, 404);
      }

      if (!islikedByUser) {
        const like = new Notification({
          type: "like",
          project: _id,
          notification_for: project.author,
          user: user_id
        });

        like.save()
          .then(notification => {
            return sendResponse(res, "success", "Project liked successfully", { liked_by_user: true }, 200);
          });
      } else {
        Notification.findOneAndDelete({ type: "like", project: _id, user: user_id })
          .then(() => {
            return sendResponse(res, "success", "Project unliked successfully", { liked_by_user: false }, 200);
          })
          .catch(err => {
            return res.status(500).json({ error: err.message });
          });
      }
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default likeProject;
