import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const searchProjects = async (req, res) => {
  try {
    const {
      tag,
      query,
      author,
      page = 1,
      limit = 2,
      elminate_project,
    } = req.query;

    const findQuery = { draft: false };

    if (tag) {
      findQuery.tags = tag;
      if (elminate_project) findQuery.project_id = { $ne: elminate_project };
    } else if (query) {
      findQuery.title = new RegExp(query, 'i');
    } else if (author) {
      findQuery.author = author;
    }

    const maxLimit = parseInt(limit) || 2;
    const currentPage = parseInt(page) || 1;

    const projects = await Project.find(findQuery)
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id'
      )
      .sort({ publishedAt: -1 })
      .select('project_id title des banner tags activity publishedAt -_id')
      .skip((currentPage - 1) * maxLimit)
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

export default searchProjects;
