import { Response } from 'express';

import Project from '../../../../models/project.model';
import { AuthenticatedRequest } from '../../../../middlewares/typings';
import { sendResponse } from '../../../../utils/response';

const userWrittenProjectsCount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { draft, query } = req.body;

  Project.countDocuments({ author: user_id, draft, title: new RegExp(query, 'i') })
    .then(count => {
      return sendResponse(res, "success", "User projects count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default userWrittenProjectsCount;
