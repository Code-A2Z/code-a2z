import { Request, Response } from 'express';

import Project from '../../../../models/project.model';
import { sendResponse } from '../../../../utils/response';

const allLatestProjectsCount = async (
  req: Request,
  res: Response,
) => {
  Project.countDocuments({ draft: false })
    .then(count => {
      return sendResponse(res, "success", "Total projects count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default allLatestProjectsCount;
