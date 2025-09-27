import { Request, Response } from 'express';

import Project from '../../../../models/project.model';
import { sendResponse } from '../../../../utils/response';

const getAllProjects = async (
  req: Request,
  res: Response,
) => {
  const { page } = req.body;
  const maxLimit = 5;

  Project.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("project_id title des banner tags activity publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(projects => {
      return sendResponse(res, "success", "Projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default getAllProjects;
