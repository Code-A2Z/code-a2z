import { Response } from 'express';

import Project from '../../../../models/project.model';
import User from '../../../../models/user.model';
import Notification from '../../../../models/notification.model';
import Comment from '../../../../models/comment.model';
import { AuthenticatedRequest } from '../../../../middlewares/typings';
import { sendResponse } from '../../../../utils/response';

const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { project_id } = req.body;

  Project.findOneAndDelete({ project_id })
    .then(project => {
      if (!project) {
        return sendResponse(res, "error", "Project not found", null, 404);
      }

      Notification.deleteMany({ project: project._id })
        .then(data => console.log("Notification deleted"))
        .catch(err => console.log(`Notification deletion error: ${err}`));

      Comment.deleteMany({ project: project._id })
        .then(data => console.log("Comments deleted"))
        .catch(err => console.log(`Comment deletion error: ${err}`));

      User.findOneAndUpdate({ _id: user_id }, { $pull: { projects: project._id }, $inc: { "account_info.total_posts": -1 } })
        .then(user => {
          return sendResponse(res, "success", "Project deleted successfully", null, 200);
        })
        .catch(err => {
          return sendResponse(res, "error", err.message, null, 500);
        });
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default deleteProject;
