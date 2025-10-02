import Project from '../../models/project.model.js';
import Notification from '../../models/notification.model.js';
import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const addComment = async (req, res) => {
  const user_id = req.user;
  const { _id, comment, project_author, replying_to, notification_id } =
    req.body;

  if (!comment.length) {
    return sendResponse(
      res,
      403,
      'error',
      'Write something to leave a comment',
      null
    );
  }

  let commentObj = {
    project_id: _id,
    project_author,
    comment,
    commented_by: user_id,
  };

  if (replying_to) {
    commentObj.parent = replying_to;
    commentObj.isReply = true;
  }

  new Comment(commentObj).save().then(async commentFile => {
    const { comment, createdAt, children } = commentFile;
    Project.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentFile._id },
        $inc: {
          'activity.total_comments': 1,
          'activity.total_parent_comments': replying_to ? 0 : 1,
        },
      }
    ).then(project => {
      console.log('New comment created', project._id);
    });

    let notificationObj = new Notification({
      type: replying_to ? 'reply' : 'comment',
      project: _id,
      notification_for: project_author,
      user: user_id,
      comment: commentFile._id,
    });

    if (replying_to) {
      notificationObj.replied_on_comment = replying_to;
      await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: commentFile._id } }
      ).then(replyingToCommentDoc => {
        notificationObj.notification_for = replyingToCommentDoc?.commented_by;
      });

      if (notification_id) {
        Notification.findOneAndUpdate(
          { _id: notification_id },
          { reply: commentFile._id }
        )
          .then(() => {
            console.log('Notification updated successfully');
          })
          .catch(err => {
            console.log(err);
          });
      }
    }

    notificationObj.save().then(notification => {
      console.log('New notification created', notification._id);
    });

    return res
      .status(200)
      .json({ comment, createdAt, _id: commentFile._id, user_id, children });
  });
};

export default addComment;
