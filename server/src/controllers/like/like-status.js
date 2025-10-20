/**
 * GET /api/like/status?project_id= - Get like status for a project
 * @param {string} project_id - Project ID (query param)
 * @returns {Object} Like status
 */

import NOTIFICATION from '../../models/notification.model.js';
import PROJECT from '../../models/project.model.js';
import { NOTIFICATION_TYPES } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';

const likeStatus = async (req, res) => {
  const user_id = req.user;
  const { project_id } = req.query;
  if (!project_id) {
    return sendResponse(res, 400, 'Project ID is required');
  }

  try {
    const project = await PROJECT.findOne({ _id: project_id }).select('_id');
    if (!project) return sendResponse(res, 404, 'Project not found');

    const isLiked = await NOTIFICATION.exists({
      type: NOTIFICATION_TYPES.LIKE,
      project_id,
      user_id: user_id,
    });

    return sendResponse(res, 200, 'Like status fetched successfully', {
      isLiked: Boolean(isLiked),
    });
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default likeStatus;
