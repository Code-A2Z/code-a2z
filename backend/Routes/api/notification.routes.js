import express from "express";

import {
    authenticateUser
} from "../../Middlewares/auth.middleware.js";

import {
    getNotifications,
    likeProject,
    likeStatus,
    newNotification,
    allNotificationsCount
} from "../../Controllers/notification.controller.js";


const notificationRoutes = express.Router();

// User protected routes
notificationRoutes.post("/like", authenticateUser, likeProject);
notificationRoutes.get("/like-status", authenticateUser, likeStatus);
notificationRoutes.get("/new", authenticateUser, newNotification);
notificationRoutes.get("/get", authenticateUser, getNotifications);
notificationRoutes.get("/count", authenticateUser, allNotificationsCount);


export default notificationRoutes;
