import Project from '../../models/project.model.js';
import Notification from '../../models/notification.model.js';
import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteComments = (res, _id) => {
  Comment.findOneAndDelete({ _id })
    .then(comment => {
      if (!comment) {
        return sendResponse(res, 404, 'error', 'Comment not found', null);
      }

      if (comment.parent) {
        Comment.findOneAndUpdate(
          { _id: comment.parent },
          { $pull: { children: _id } }
        )
          .then(data => {
            console.log('Comment deleted successfully', data._id);
          })
          .catch(err => {
            console.log(err);
          });
      }

      Notification.findOneAndDelete({ comment: _id })
        .then(notification =>
          console.log('Notification deleted successfully', notification._id)
        )
        .catch(err => console.log(err));

      Notification.findOneAndUpdate({ reply: _id }, { $unset: { reply: 1 } })
        .then(notification =>
          console.log('Notification deleted successfully', notification._id)
        )
        .catch(err => console.log(err));

      Project.findOneAndUpdate(
        { _id: comment.project_id },
        {
          $pull: { comments: _id },
          $inc: { 'activity.total_comments': -1 },
          'activity.total_parent_comments': comment.parent ? 0 : -1,
        }
      ).then(project => {
        console.log('Comment deleted from project', project._id);
        if (comment.children.length) {
          comment.children.map(replies => {
            deleteComments(res, replies);
          });
        }
      });
    })
    .catch(err => {
      console.log(err.message);
    });
};

const deleteComment = async (req, res) => {
  const user_id = req.user;
  const { _id } = req.body;

  Comment.findOne({ _id }).then(comment => {
    if (!comment) {
      return sendResponse(res, 404, 'error', 'Comment not found', null);
    }
    if (
      user_id === comment.commented_by?.toString() ||
      user_id === comment.project_author?.toString()
    ) {
      deleteComments(res, _id);
      return sendResponse(
        res,
        200,
        'success',
        'Comment deleted successfully',
        null
      );
    } else {
      return sendResponse(
        res,
        403,
        'error',
        'You are not authorized to delete this comment',
        null
      );
    }
  });
};

export default deleteComment;
