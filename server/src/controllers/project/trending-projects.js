/**
 * GET /api/project/trending - Get trending projects
 * @returns {Object[]} Array of trending projects
 */

import PROJECT from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const trendingProjects = async (req, res) => {
  try {
    const projects = await PROJECT.find({ is_draft: false })
      .populate(
        'user_id',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id'
      )
      .sort({
        'activity.total_read': -1,
        'activity.total_likes': -1,
        publishedAt: -1,
      })
      .select('title publishedAt -_id')
      .limit(5)
      .lean();

    return sendResponse(
      res,
      200,
      'Trending projects fetched successfully',
      projects
    );
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal server error');
  }
};

export default trendingProjects;
