import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const getAllProjects = async (req, res) => {
  let page = req.query.page || 1;
  const maxLimit = 5;

  if (page < 1) page = 1;

  try {
    const projects = await Project.find({ draft: false })
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id'
      )
      .sort({ publishedAt: -1 })
      .select('project_id title des banner tags activity publishedAt -_id')
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    return sendResponse(
      res,
      200,
      'success',
      'Projects fetched successfully',
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

export default getAllProjects;
