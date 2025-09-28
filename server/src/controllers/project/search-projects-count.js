import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const searchProjectsCount = async (req, res) => {
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
      return sendResponse(
        res,
        200,
        'success',
        'Search projects count fetched successfully',
        { totalDocs: count }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default searchProjectsCount;
