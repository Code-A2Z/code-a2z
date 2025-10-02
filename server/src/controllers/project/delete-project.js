import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import Notification from '../../models/notification.model.js';
import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteProject = async (req, res) => {
  const user_id = req.user;
  const { project_id } = req.body;

  Project.findOneAndDelete({ project_id })
    .then(project => {
      if (!project) {
        return sendResponse(res, 404, 'error', 'Project not found', null);
      }

      Notification.deleteMany({ project: project._id })
        .then(data =>
          console.log('Notification deleted successfully', data.deletedCount)
        )
        .catch(err => console.log(`Notification deletion error: ${err}`));

      Comment.deleteMany({ project: project._id })
        .then(data =>
          console.log('Comments deleted successfully', data.deletedCount)
        )
        .catch(err => console.log(`Comment deletion error: ${err}`));

      User.findOneAndUpdate(
        { _id: user_id },
        {
          $pull: { projects: project._id },
          $inc: { 'account_info.total_posts': -1 },
        }
      )
        .then(user => {
          console.log('User updated successfully', user._id);
          return sendResponse(
            res,
            200,
            'success',
            'Project deleted successfully',
            null
          );
        })
        .catch(err => {
          return sendResponse(res, 500, 'error', err.message, null);
        });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default deleteProject;
