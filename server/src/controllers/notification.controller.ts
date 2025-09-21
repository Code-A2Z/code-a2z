import { Request, Response } from "express";
import { Types } from "mongoose";

import Project from "../models/project.model";
import Notification from "../models/notification.model";
import Comment from "../models/comment.model";
import { AuthenticatedRequest } from "../middlewares/typings";
import { sendResponse } from "../utils/response";

export const likeProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { _id, islikedByUser } = req.body;
  const incrementVal = !islikedByUser ? 1 : -1;

  Project.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
    .then(project => {
      if (!project) {
        return sendResponse(res, "error", "Project not found", null, 404);
      }

      if (!islikedByUser) {
        const like = new Notification({
          type: "like",
          project: _id,
          notification_for: project.author,
          user: user_id
        });

        like.save()
          .then(notification => {
            return sendResponse(res, "success", "Project liked successfully", { liked_by_user: true }, 200);
          });
      } else {
        Notification.findOneAndDelete({ type: "like", project: _id, user: user_id })
          .then(() => {
            return sendResponse(res, "success", "Project unliked successfully", { liked_by_user: false }, 200);
          })
          .catch(err => {
            return res.status(500).json({ error: err.message });
          });
      }
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const likeStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { _id } = req.body;

  Notification.exists({ type: "like", project: _id, user: user_id })
    .then(isLiked => {
      return sendResponse(res, "success", "Like status fetched successfully", { isLiked }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const addComment = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { _id, comment, project_author, replying_to, notification_id } = req.body;

  if (!comment.length) {
    return sendResponse(res, "error", "Write something to leave a comment", null, 403);
  }

  let commentObj: {
    project_id: any;
    project_author: any;
    comment: any;
    commented_by: string | undefined;
    parent?: any;
    isReply?: boolean;
  } = {
    project_id: _id,
    project_author,
    comment,
    commented_by: user_id,
  }

  if (replying_to) {
    commentObj.parent = replying_to;
    commentObj.isReply = true;
  }

  new Comment(commentObj).save()
    .then(async (commentFile) => {
      const { comment, createdAt, children } = commentFile;
      Project.findOneAndUpdate({ _id }, { $push: { "comments": commentFile._id }, $inc: { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 } })
        .then(project => {
          console.log('New comment created')
        });

      let notificationObj = new Notification({
        type: replying_to ? "reply" : "comment",
        project: _id,
        notification_for: project_author,
        user: user_id,
        comment: commentFile._id,
      })

      if (replying_to) {
        notificationObj.replied_on_comment = replying_to;
        await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentFile._id } })
          .then((replyingToCommentDoc) => {
            notificationObj.notification_for = replyingToCommentDoc?.commented_by as Types.ObjectId;
          });

        if (notification_id) {
          Notification.findOneAndUpdate({ _id: notification_id }, { reply: commentFile._id })
            .then(() => {
              console.log('Notification updated successfully')
            })
            .catch(err => {
              console.log(err);
            })
        }
      }

      notificationObj.save().then(notification => {
        console.log('New notification created')
      });

      return res.status(200).json({ comment, createdAt, _id: commentFile._id, user_id, children });
    })
};

export const getComments = async (
  req: Request,
  res: Response,
) => {
  const { project_id, skip } = req.body;
  const maxLimit = 5;

  Comment.find({ project_id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(maxLimit)
    .sort({ "commentedAt": -1 })
    .then(comment => {
      return sendResponse(res, "success", "Comments fetched successfully", { comment }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const getReplies = async (
  req: Request,
  res: Response,
) => {
  const { _id, skip } = req.body;
  const maxLimit = 5;

  Comment.findOne({ _id })
    .populate({
      path: "children",
      options: {
        limit: maxLimit,
        skip: skip,
        sort: { "commentedAt": -1 }
      },
      populate: {
        path: 'commented_by',
        select: 'personal_info.username personal_info.fullname personal_info.profile_img'
      },
      select: "-project_id -updatedAt"
    })
    .select("children")
    .then(doc => {
      return sendResponse(res, "success", "Replies fetched successfully", { replies: doc?.children }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

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

export const deleteComment = async (
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

export const newNotification = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;

  Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } })
    .then(result => {
      if (result) {
        return sendResponse(res, "success", "New notification available", { new_notification_available: true }, 200);
      } else {
        return sendResponse(res, "success", "No new notifications", { new_notification_available: false }, 200);
      }
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { page, filter, deletedDocCount } = req.body;
  const maxLimit = 10;
  
  const findQuery: { [key: string]: any } = { notification_for: user_id, user: { $ne: user_id } };
  if (filter !== 'all') {
    findQuery.type = filter;
  }

  let skipDocs = (page - 1) * maxLimit;
  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate("project", "title project_id")
    .populate("user", "personal_info.username personal_info.fullname personal_info.profile_img")
    .populate("comment", "comment")
    .populate("replied_on_comment", "comment")
    .populate("reply", "comment")
    .sort({ createdAt: -1 })
    .select("createdAt type seen reply")
    .then(notifications => {
      Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then(() => {
          console.log('Notifications seen')
        })
        .catch(err => {
          console.log(err);
        });

      return sendResponse(res, "success", "Notifications fetched successfully", { notifications }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const allNotificationsCount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { filter } = req.body;
  const findQuery: { [key: string]: any } = { notification_for: user_id, user: { $ne: user_id } };

  if (filter !== 'all') {
    findQuery.type = filter;
  }

  Notification.countDocuments(findQuery)
    .then(count => {
      return sendResponse(res, "success", "Total notifications count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", "Failed to fetch total notifications count", { error: err.message }, 500);
    });
};
