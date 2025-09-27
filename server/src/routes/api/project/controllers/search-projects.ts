import { Request, Response } from 'express';

import Project from '../../../../models/project.model';
import { sendResponse } from '../../../../utils/response';

const searchProjects = async (
  req: Request,
  res: Response,
) => {
  const { tag, query, author, page, limit, elminate_project } = req.body;
  let findQuery: Record<string, any> = { draft: false };

  if (tag) {
    findQuery.tags = tag;
    findQuery.project_id = { $ne: elminate_project };
  } else if (query) {
    findQuery.title = new RegExp(query, 'i');
  } else if (author) {
    findQuery.author = author;
  }

  const maxLimit = limit ? limit : 2;
  Project.find(findQuery)
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

export default searchProjects;
