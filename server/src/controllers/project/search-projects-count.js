import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const searchProjectsCount = async (req, res) => {
  try {
    const { tag, author, query } = req.query;

    let findQuery = { draft: false };

    if (tag) {
      findQuery.tags = tag;
    } else if (query) {
      findQuery.title = new RegExp(query, 'i');
    } else if (author) {
      findQuery.author = author;
    }

    const count = await Project.countDocuments(findQuery);
    return sendResponse(
      res,
      200,
      'success',
      'Search projects count fetched successfully',
      { totalDocs: count }
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal server error'
    );
  }
};

export default searchProjectsCount;
