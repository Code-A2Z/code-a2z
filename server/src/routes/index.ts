import express from 'express';

// Import rate limiting middlewares
import authMiddleware from '../middlewares/auth.limiter';
import generalMiddleware from '../middlewares/general.limiter';

// Import route modules
import authRoutes from './api/auth.routes';
import userRoutes from './api/user.routes';
import mediaRoutes from './api/media.routes';
import projectRoutes from './api/project.routes';
import notificationRoutes from './api/notification.routes';
import subscriberRoutes from './api/subscriber.routes';
import collectionRoutes from './api/collections.routes';
import collaborationRoutes from './api/collaboration.routes';

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
