import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const getAllProjects = async (req, res) => {
  const { page } = req.body;
  const maxLimit = 5;

  Project.find({ draft: false })
    .populate(
      'author',
      'personal_info.profile_img personal_info.username personal_info.fullname -_id'
    )
    .sort({ publishedAt: -1 })
    .select('project_id title des banner tags activity publishedAt -_id')
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(projects => {
      return sendResponse(
        res,
        200,
        'success',
        'Projects fetched successfully',
        { projects }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getAllProjects;
