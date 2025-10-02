import Project from '../../models/project.model.js';
import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';

const likeProject = async (req, res) => {
  const user_id = req.user;
  const { _id, islikedByUser } = req.body;
  const incrementVal = !islikedByUser ? 1 : -1;

  Project.findOneAndUpdate(
    { _id },
    { $inc: { 'activity.total_likes': incrementVal } }
  )
    .then(project => {
      if (!project) {
        return sendResponse(res, 404, 'error', 'Project not found', null);
      }

      if (!islikedByUser) {
        const like = new Notification({
          type: 'like',
          project: _id,
          notification_for: project.author,
          user: user_id,
        });

        like.save().then(notification => {
          console.log('New like notification created', notification._id);
          return sendResponse(
            res,
            200,
            'success',
            'Project liked successfully!',
            { liked_by_user: true }
          );
        });
      } else {
        Notification.findOneAndDelete({
          type: 'like',
          project: _id,
          user: user_id,
        })
          .then(() => {
            return sendResponse(
              res,
              200,
              'success',
              'Project unliked successfully',
              { liked_by_user: false }
            );
          })
          .catch(err => {
            return res.status(500).json({ error: err.message });
          });
      }
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default likeProject;
