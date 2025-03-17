import express from "express";
import { addComment, getComments, getReplies, likeProject, likeStatus } from "../../Controllers/notification.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const notificationRoutes = express.Router();

notificationRoutes.post("/like", authenticateUser, likeProject);
notificationRoutes.post("/like-status", authenticateUser, likeStatus);
notificationRoutes.post("/comment", authenticateUser, addComment);
notificationRoutes.post("/get-comments", getComments);
notificationRoutes.post("/get-replies", getReplies);

export default notificationRoutes;
