/**
 * DELETE /api/project/:project_id - Delete a project
 * @param {string} project_id - Project ID (URL param)
 * @returns {Object} Success message
 */

import USER from '../../models/user.model.js';
import NOTIFICATION from '../../models/notification.model.js';
import COMMENT from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteProject = async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.params;

    if (!project_id) {
      return sendResponse(res, 400, 'Project ID is required');
    }

    // Clean up related data asynchronously (non-blocking)
    NOTIFICATION.deleteMany({ project_id }).catch(() => {});
    COMMENT.deleteMany({ project_id }).catch(() => {});

    // Update user stats
    await USER.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { project_ids: project_id },
        $inc: { 'account_info.total_posts': -1 },
      }
    );

    return sendResponse(res, 200, 'Project deleted successfully');
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal server error');
  }
};

export default deleteProject;
