import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const userProjectsCount = async (req, res) => {
  try {
    const user_id = req.user;
    const { draft, query = '' } = req.query;

    const draftValue = draft === 'true';
    const titleFilter = new RegExp(query, 'i');

    const totalDocs = await Project.countDocuments({
      author: user_id,
      draft: draftValue,
      title: titleFilter,
    });

    return sendResponse(
      res,
      200,
      'success',
      'User projects count fetched successfully',
      { totalDocs }
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

export default userProjectsCount;
