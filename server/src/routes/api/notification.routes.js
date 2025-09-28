import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import likeProject from '../../controllers/notification/like-project.js';
import likeStatus from '../../controllers/notification/like-status.js';
import addComment from '../../controllers/notification/add-comment.js';
import getComments from '../../controllers/notification/get-comments.js';
import getReplies from '../../controllers/notification/get-replies.js';
import deleteComment from '../../controllers/notification/delete-comment.js';
import newNotification from '../../controllers/notification/new-notification.js';
import getNotifications from '../../controllers/notification/get-notifications.js';
import allNotificationsCount from '../../controllers/notification/all-notifications-count.js';

const notificationRoutes = express.Router();

notificationRoutes.post('/like', authenticateUser, likeProject);
notificationRoutes.post('/like-status', authenticateUser, likeStatus);
notificationRoutes.post('/comment', authenticateUser, addComment);
notificationRoutes.post('/get-comments', getComments);
notificationRoutes.post('/get-replies', getReplies);
notificationRoutes.post('/delete-comment', authenticateUser, deleteComment);
notificationRoutes.get('/new', authenticateUser, newNotification);
notificationRoutes.post('/get', authenticateUser, getNotifications);
notificationRoutes.post('/all-count', authenticateUser, allNotificationsCount);

export default notificationRoutes;
