import { Request, Response } from 'express';

import Project from '../../../../models/project.model';
import { sendResponse } from '../../../../utils/response';

const searchProjectsCount = async (
  req: Request,
  res: Response,
) => {
  const { tag, author, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, 'i') };
  } else if (author) {
    findQuery = { draft: false, author: author };
  }

  Project.countDocuments(findQuery)
    .then(count => {
      return sendResponse(res, "success", "Search projects count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default searchProjectsCount;
