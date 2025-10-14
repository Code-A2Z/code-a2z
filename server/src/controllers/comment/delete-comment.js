import Project from '../../models/project.model.js';
import Notification from '../../models/notification.model.js';
import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteComments = async _id => {
  const comment = await Comment.findOneAndDelete({ _id });
  if (!comment) return null;

  // Remove from parent comment if exists
  if (comment.parent) {
    await Comment.findOneAndUpdate(
      { _id: comment.parent },
      { $pull: { children: _id } }
    ).catch(err => console.log(err));
  }

  // Remove notifications
  await Notification.findOneAndDelete({ comment: _id }).catch(err =>
    console.log(err)
  );
  await Notification.findOneAndUpdate(
    { reply: _id },
    { $unset: { reply: 1 } }
  ).catch(err => console.log(err));

  // Update project
  await Project.findOneAndUpdate(
    { _id: comment.project_id },
    {
      $pull: { comments: _id },
      $inc: {
        'activity.total_comments': -1,
        'activity.total_parent_comments': comment.parent ? 0 : -1,
      },
    }
  ).catch(err => console.log(err));

  // Recursively delete children
  if (comment.children.length) {
    for (const childId of comment.children) {
      await deleteComments(childId);
    }
  }

  return true;
};

const deleteComment = async (req, res) => {
  try {
    const user_id = req.user;
    const { comment_id } = req.params;

    if (!comment_id)
      return sendResponse(res, 400, 'error', 'Comment ID is required');

    const comment = await Comment.findOne({ _id: comment_id });

    if (!comment) return sendResponse(res, 404, 'error', 'Comment not found');

    if (
      user_id.toString() === comment.commented_by?.toString() ||
      user_id.toString() === comment.project_author?.toString()
    ) {
      await deleteComments(comment_id);
      return sendResponse(res, 200, 'success', 'Comment deleted successfully');
    } else {
      return sendResponse(
        res,
        403,
        'error',
        'You are not authorized to delete this comment'
      );
    }
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default deleteComment;
