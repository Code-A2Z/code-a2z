import express from 'express';
import authRoutes from './api/auth.routes.js';
import userRoutes from './api/user.routes.js';
import mediaRoutes from './api/media.routes.js';
import projectRoutes from './api/project.routes.js';
import notificationRoutes from './api/notification.routes.js';
import subscriberRoutes from './api/subscriber.routes.js';
import collectionRoutes from './api/collections.routes.js';
import collaborationRoutes from './api/collaboration.routes.js';
import { authMiddleware, generalMiddleware } from '../Middlewares/rateLimit/index.js';

const router = express.Router();

router.use('/auth', authMiddleware, authRoutes);
router.use('/user', generalMiddleware, userRoutes);
router.use('/media', generalMiddleware, mediaRoutes);
router.use('/project', generalMiddleware, projectRoutes);
router.use('/notification', generalMiddleware, notificationRoutes);
router.use('/subscriber', generalMiddleware, subscriberRoutes);
router.use('/collection', generalMiddleware, collectionRoutes);
router.use('/collaboration', generalMiddleware, collaborationRoutes);

export default router;
