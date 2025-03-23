import express from 'express';
import authRoutes from './api/auth.routes.js';
import mediaRoutes from './api/media.routes.js';
import projectRoutes from './api/project.routes.js';
import userRoutes from './api/user.routes.js';
import notificationRoutes from './api/notification.routes.js';
import subscriberRoutes from './api/subscriber.routes.js';
import commentRoutes from './api/comment.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use("/comment", commentRoutes);
router.use('/media', mediaRoutes);
router.use('/notification', notificationRoutes);
router.use('/project', projectRoutes);
router.use('/subscriber', subscriberRoutes);
router.use('/user', userRoutes);

export default router;
