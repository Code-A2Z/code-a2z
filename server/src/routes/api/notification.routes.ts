import express from "express";
import authenticateUser from "../../middlewares/auth.middleware";
import {
  addComment,
  getNotifications,
  deleteComment,
  getComments,
  getReplies,
  likeProject,
  likeStatus,
  newNotification,
  allNotificationsCount,
} from "../../controllers/notification.controller";

const notificationRoutes = express.Router();

notificationRoutes.post("/like", authenticateUser, likeProject);
notificationRoutes.post("/like-status", authenticateUser, likeStatus);
notificationRoutes.post("/comment", authenticateUser, addComment);
notificationRoutes.post("/get-comments", getComments);
notificationRoutes.post("/get-replies", getReplies);
notificationRoutes.post("/delete-comment", authenticateUser, deleteComment);
notificationRoutes.get("/new", authenticateUser, newNotification);
notificationRoutes.post("/get", authenticateUser, getNotifications);
notificationRoutes.post("/all-count", authenticateUser, allNotificationsCount);

export default notificationRoutes;
