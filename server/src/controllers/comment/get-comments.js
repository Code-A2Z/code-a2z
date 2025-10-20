/**
 * GET /api/comment/list?project_id= - Get comments for a project
 * @param {string} project_id - Project ID (query param)
 * @param {number} [skip=0] - Number of comments to skip (pagination)
 * @returns {Object[]} Array of comments
 */

import COMMENT from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const getComments = async (req, res) => {
  try {
    const { project_id, skip = 0 } = req.query;
    const maxLimit = 5;

    if (!project_id) {
      return sendResponse(res, 400, 'Project ID is required');
    }

    const comments = await COMMENT.find({ project_id, is_reply: false })
      .populate(
        'user_id',
        'personal_info.username personal_info.fullname personal_info.profile_img -_id'
      )
      .skip(parseInt(skip))
      .limit(maxLimit)
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, 'Comments fetched successfully', comments);
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default getComments;
