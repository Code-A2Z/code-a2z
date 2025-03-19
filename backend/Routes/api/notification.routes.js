import express from "express";
import { addComment, getNotifications, deleteComment, getComments, getReplies, likeProject, likeStatus, newNotification } from "../../Controllers/notification.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const notificationRoutes = express.Router();

notificationRoutes.post("/like", authenticateUser, likeProject);
notificationRoutes.post("/like-status", authenticateUser, likeStatus);
notificationRoutes.post("/comment", authenticateUser, addComment);
notificationRoutes.post("/get-comments", getComments);
notificationRoutes.post("/get-replies", getReplies);
notificationRoutes.post("/delete-comment", authenticateUser, deleteComment);
notificationRoutes.get("/new", authenticateUser, newNotification);
notificationRoutes.post("/get", authenticateUser, getNotifications);

export default notificationRoutes;
