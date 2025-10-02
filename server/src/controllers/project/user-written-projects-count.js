import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const userWrittenProjectsCount = async (req, res) => {
  const user_id = req.user;
  const { draft, query } = req.body;

  Project.countDocuments({
    author: user_id,
    draft,
    title: new RegExp(query, 'i'),
  })
    .then(count => {
      return sendResponse(
        res,
        200,
        'success',
        'User projects count fetched successfully',
        { totalDocs: count }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default userWrittenProjectsCount;
