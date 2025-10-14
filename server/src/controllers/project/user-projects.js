import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const userProjects = async (req, res) => {
  try {
    const user_id = req.user;
    const { page = 1, draft, query = '', deletedDocCount = 0 } = req.query;

    const maxLimit = 5;
    const skipDocs = Math.max(0, (page - 1) * maxLimit - deletedDocCount);

    const projects = await Project.find({
      author: user_id,
      draft: draft === 'true', // convert query string to boolean
      title: new RegExp(query, 'i'),
    })
      .skip(skipDocs)
      .limit(maxLimit)
      .sort({ publishedAt: -1 })
      .select('title banner publishedAt project_id activity des draft -_id')
      .lean();

    return sendResponse(
      res,
      200,
      'success',
      'User projects fetched successfully',
      projects
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

export default userProjects;
