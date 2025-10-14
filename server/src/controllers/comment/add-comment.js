import Project from '../../models/project.model.js';
import Notification from '../../models/notification.model.js';
import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const addComment = async (req, res) => {
  try {
    const user_id = req.user;
    const { _id, comment, project_author, replying_to, notification_id } =
      req.body;

    if (!comment?.trim()?.length) {
      return sendResponse(
        res,
        403,
        'error',
        'Write something to leave a comment'
      );
    }

    // Create comment object
    const commentObj = {
      project_id: _id,
      project_author,
      comment,
      commented_by: user_id,
      isReply: Boolean(replying_to),
      parent: replying_to || null,
    };

    // Save the comment
    const commentDoc = await new Comment(commentObj).save();

    // Update project activity and comments array
    await Project.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentDoc._id },
        $inc: {
          'activity.total_comments': 1,
          'activity.total_parent_comments': replying_to ? 0 : 1,
        },
      }
    );

    // Prepare notification
    const notificationObj = new Notification({
      type: replying_to ? 'reply' : 'comment',
      project: _id,
      notification_for: project_author,
      user: user_id,
      comment: commentDoc._id,
      replied_on_comment: replying_to || undefined,
    });

    // Handle replies
    if (replying_to) {
      const parentComment = await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: commentDoc._id } },
        { new: true }
      );

      notificationObj.notification_for =
        parentComment?.commented_by || project_author;

      if (notification_id) {
        await Notification.findOneAndUpdate(
          { _id: notification_id },
          { reply: commentDoc._id }
        );
      }
    }

    // Save notification
    await notificationObj.save();

    return sendResponse(res, 200, 'success', 'Comment added successfully', {
      _id: commentDoc._id,
      comment: commentDoc.comment,
      createdAt: commentDoc.createdAt,
      user_id,
      children: commentDoc.children,
    });
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default addComment;
