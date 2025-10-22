/**
 * GET /api/project/search - Search projects by tag, query, or author
 * @param {string} [tag] - Tag to filter
 * @param {string} [query] - Title search
 * @param {string} [user_id] - Author ID
 * @param {number} [page=1] - Page number
 * @param {number} [limit=2] - Results per page
 * @param {string} [rmv_project_by_id] - Project ID to exclude
 * @returns {Object[]} Array of projects
 */

import PROJECT from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const searchProjects = async (req, res) => {
  const {
    tag,
    query,
    user_id,
    page = 1,
    limit = 2,
    rmv_project_by_id,
  } = req.query;

  const findQuery = { is_draft: false };
  if (tag) {
    findQuery.tags = tag;
    if (rmv_project_by_id) findQuery._id = { $ne: rmv_project_by_id };
  } else if (query) {
    findQuery.title = new RegExp(query, 'i');
  } else if (user_id) {
    findQuery.user_id = user_id;
  }

  const maxLimit = parseInt(limit) || 2;
  const currentPage = parseInt(page) || 1;

  try {
    const projects = await PROJECT.find(findQuery)
      .populate(
        'user_id',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id'
      )
      .sort({ publishedAt: -1 })
      .select('title banner_url description tags activity publishedAt _id')
      .skip((currentPage - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    // Remove user_id and add personal_info in the response
    const projectsWithAuthor = projects.map(project => ({
      ...project,
      personal_info: project.user_id.personal_info,
      user_id: undefined,
    }));

    return sendResponse(
      res,
      200,
      'Projects fetched successfully',
      projectsWithAuthor
    );
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal server error');
  }
};

export default searchProjects;
