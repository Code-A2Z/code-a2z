/**
 * GET /api/project/all?page=1 - Get all published projects (paginated)
 * @param {number} [page=1] - Page number (query param)
 * @returns {Object[]} Array of projects
 */

import PROJECT from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const getAllProjects = async (req, res) => {
  let page = req.query.page || 1;
  const maxLimit = 5;

  if (page < 1) page = 1;

  try {
    const projects = await PROJECT.find({ is_draft: false })
      .populate(
        'user_id',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id'
      )
      .sort({ publishedAt: -1 })
      .select('title banner_url description tags activity publishedAt -_id')
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    return sendResponse(res, 200, 'Projects fetched successfully', projects);
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal server error');
  }
};

export default getAllProjects;
