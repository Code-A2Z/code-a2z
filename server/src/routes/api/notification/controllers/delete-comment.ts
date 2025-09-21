import { Response } from "express";
import { Types } from "mongoose";

import Project from "../../../../models/project.model";
import Notification from "../../../../models/notification.model";
import Comment from "../../../../models/comment.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const deleteComments = (res: Response, _id: Types.ObjectId) => {
  Comment.findOneAndDelete({ _id })
    .then(comment => {
      if (!comment) {
        return sendResponse(res, "error", "Comment not found", null, 404);
      }

      if (comment.parent) {
        Comment.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: _id } })
          .then(data => {
            console.log('Comment deleted successfully')
          })
          .catch(err => {
            console.log(err);
          });
      }

      Notification.findOneAndDelete({ comment: _id })
        .then(notification => console.log('Notification deleted successfully'))
        .catch(err => console.log(err));

      Notification.findOneAndUpdate({ reply: _id }, { $unset: { reply: 1 } })
        .then(notification => console.log('Notification deleted successfully'))
        .catch(err => console.log(err));

      Project.findOneAndUpdate({ _id: comment.project_id }, { $pull: { comments: _id }, $inc: { "activity.total_comments": -1 }, "activity.total_parent_comments": comment.parent ? 0 : -1 })
        .then(project => {
          if (comment.children.length) {
            comment.children.map(replies => {
              deleteComments(res, replies);
            })
          }
        })
    })
    .catch(err => {
      console.log(err.message);
    });
}

const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { _id } = req.body;

  Comment.findOne({ _id })
    .then(comment => {
      if (!comment) {
        return sendResponse(res, "error", "Comment not found", null, 404);
      }
      if (
        user_id === comment.commented_by?.toString() ||
        user_id === comment.project_author?.toString()
      ) {
        deleteComments(res, _id);
        return sendResponse(res, "success", "Comment deleted successfully", null, 200);
      } else {
        return sendResponse(res, "error", "You are not authorized to delete this comment", null, 403);
      }
    });
};

export default deleteComment;
