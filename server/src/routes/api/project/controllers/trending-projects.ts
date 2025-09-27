import { Request, Response } from 'express';

import Project from '../../../../models/project.model';
import { sendResponse } from '../../../../utils/response';

const trendingProjects = async (
  req: Request,
  res: Response,
) => {
  Project.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
    .select("project_id title publishedAt -_id")
    .limit(5)
    .then(projects => {
      return sendResponse(res, "success", "Trending projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default trendingProjects;
