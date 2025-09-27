import { Response } from 'express';

import Project from '../../../../models/project.model';
import { AuthenticatedRequest } from '../../../../middlewares/typings';
import { sendResponse } from '../../../../utils/response';

const userWrittenProjects = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { page, draft, query, deletedDocCount } = req.body;

  const maxLimit = 5;
  let skipDocs = (page - 1) * maxLimit;

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Project.find({ author: user_id, draft, title: new RegExp(query, 'i') })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select("title banner publishedAt project_id activity des draft -_id")
    .then(projects => {
      return sendResponse(res, "success", "User projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default userWrittenProjects;
