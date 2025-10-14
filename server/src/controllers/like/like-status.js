import Notification from '../../models/notification.model.js';
import Project from '../../models/project.model.js';
import { NotificationTypes } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';

const likeStatus = async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.query;

    if (!project_id) {
      return sendResponse(res, 400, 'error', 'Project ID is required');
    }

    const project = await Project.findOne({ project_id }).select('_id');
    if (!project) return sendResponse(res, 404, 'error', 'Project not found');

    const isLiked = await Notification.exists({
      type: NotificationTypes.LIKE,
      project: project._id,
      user: user_id,
    });

    return sendResponse(
      res,
      200,
      'success',
      'Like status fetched successfully',
      { isLiked: Boolean(isLiked) }
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default likeStatus;
