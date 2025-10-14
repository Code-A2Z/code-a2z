import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import getNotifications from '../../controllers/notification/get-notifications.js';
import notificationStatus from '../../controllers/notification/notification-status.js';
import allNotificationsCount from '../../controllers/notification/all-notifications-count.js';

const notificationRoutes = express.Router();

notificationRoutes.get('/', authenticateUser, getNotifications);
notificationRoutes.get('/status', authenticateUser, notificationStatus);
notificationRoutes.get('/count', authenticateUser, allNotificationsCount);

export default notificationRoutes;
