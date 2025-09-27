import { Request, Response } from 'express';

import Project from '../../../../models/project.model';
import User from '../../../../models/user.model';
import { sendResponse } from '../../../../utils/response';

const getProject = async (
  req: Request,
  res: Response,
) => {
  const { project_id, draft, mode } = req.body;
  const incrementVal = mode !== 'edit' ? 1 : 0;

  Project.findOneAndUpdate({ project_id }, { $inc: { "activity.total_reads": incrementVal } }, { new: true })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt project_id tags projectUrl repository")
    .then(project => {
      if (!project) {
        return sendResponse(res, "error", "Project not found", null, 404);
      }

      // Ensure project.author is populated and not just ObjectId
      if (project.author && typeof project.author === 'object' && 'personal_info' in project.author) {
        const authorWithPersonalInfo = project.author as { personal_info: { username: string } };
        User.findOneAndUpdate({ "personal_info.username": authorWithPersonalInfo.personal_info.username }, {
          $inc: { 'account_info.total_reads': incrementVal }
        })
          .catch(err => {
            return sendResponse(res, "error", err.message, null, 500);
          });
      }

      if (project.draft && !draft) {
        return sendResponse(res, "error", "You can't access draft project", null, 500);
      }

      return sendResponse(res, "success", "Project fetched successfully", { project }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default getProject;
