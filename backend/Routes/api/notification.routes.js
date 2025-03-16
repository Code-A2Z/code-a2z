import express from "express";
import { likeProject, likeStatus } from "../../Controllers/notification.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const notificationRoutes = express.Router();

notificationRoutes.post("/like", authenticateUser, likeProject);
notificationRoutes.post("/like-status", authenticateUser, likeStatus);

export default notificationRoutes;
