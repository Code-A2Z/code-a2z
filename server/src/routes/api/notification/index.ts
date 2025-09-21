import express from "express";

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import likeProject from "./controllers/like-project";
import likeStatus from "./controllers/like-status";
import addComment from "./controllers/add-comment";
import getComments from "./controllers/get-comments";
import getReplies from "./controllers/get-replies";
import deleteComment from "./controllers/delete-comment";
import newNotification from "./controllers/new-notification";
import getNotifications from "./controllers/get-notifications";
import allNotificationsCount from "./controllers/all-notifications-count";

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
