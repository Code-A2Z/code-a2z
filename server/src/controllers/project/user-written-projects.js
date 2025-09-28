import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const userWrittenProjects = async (req, res) => {
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
    .select('title banner publishedAt project_id activity des draft -_id')
    .then(projects => {
      return sendResponse(
        res,
        200,
        'success',
        'User projects fetched successfully',
        { projects }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default userWrittenProjects;
