import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import Notification from '../../models/notification.model.js';
import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteProject = async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.params;

    if (!project_id)
      return sendResponse(res, 400, 'error', 'Project ID is required');

    const project = await Project.findOneAndDelete({ project_id });
    if (!project) return sendResponse(res, 404, 'error', 'Project not found');

    // Clean up related data asynchronously (non-blocking)
    Notification.deleteMany({ project: project._id }).catch(err =>
      console.error(`Notification deletion error: ${err}`)
    );
    Comment.deleteMany({ project: project._id }).catch(err =>
      console.error(`Comment deletion error: ${err}`)
    );

    // Update user stats
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { projects: project._id },
        $inc: { 'account_info.total_posts': -1 },
      }
    );

    return sendResponse(res, 200, 'success', 'Project deleted successfully');
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal server error'
    );
  }
};

export default deleteProject;
