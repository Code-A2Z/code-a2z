import Project from '../../models/project.model.js';
import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';
import { NotificationTypes } from '../../typings/index.js';

const likeProject = async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id, isLikedByUser } = req.body;

    if (!project_id) {
      return sendResponse(res, 400, 'error', 'Project ID is required');
    }

    const incrementVal = Boolean(isLikedByUser) ? 1 : -1;

    // Update project like count
    const project = await Project.findOneAndUpdate(
      { project_id },
      { $inc: { 'activity.total_likes': incrementVal } },
      { new: true }
    );

    if (!project) {
      return sendResponse(res, 404, 'error', 'Project not found');
    }

    // Handle like / unlike notifications
    if (Boolean(isLikedByUser)) {
      await Notification.create({
        type: NotificationTypes.LIKE,
        project: project._id,
        notification_for: project.author,
        user: user_id,
      });

      return sendResponse(res, 200, 'success', 'Project liked successfully!', {
        liked_by_user: true,
        total_likes: project.activity.total_likes,
      });
    } else {
      await Notification.findOneAndDelete({
        type: 'like',
        project: project._id,
        user: user_id,
      });

      return sendResponse(res, 200, 'success', 'Project unliked successfully', {
        liked_by_user: false,
        total_likes: project.activity.total_likes,
      });
    }
  } catch (err) {
    return sendResponse(res, 500, 'error', err.message);
  }
};

export default likeProject;
