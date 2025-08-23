import express from 'express';
import authRoutes from './api/auth.routes.js';
import mediaRoutes from './api/media.routes.js';
import projectRoutes from './api/project.routes.js';
import userRoutes from './api/user.routes.js';
import notificationRoutes from './api/notification.routes.js';
import subscriberRoutes from './api/subscriber.routes.js';
import collectionRoutes from './api/collections.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/media', mediaRoutes);
router.use('/project', projectRoutes);
router.use('/notification', notificationRoutes);
router.use('/subscriber', subscriberRoutes);
router.use("/collection", collectionRoutes);
export default router;
