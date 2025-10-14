import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const trendingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ draft: false })
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id'
      )
      .sort({
        'activity.total_read': -1,
        'activity.total_likes': -1,
        publishedAt: -1,
      })
      .select('project_id title publishedAt -_id')
      .limit(5)
      .lean();

    return sendResponse(
      res,
      200,
      'success',
      'Trending projects fetched successfully',
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

export default trendingProjects;
