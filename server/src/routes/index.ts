import express from 'express';

// Import rate limiting middlewares
import authLimiter from '../middlewares/auth-limiter';
import generalLimiter from '../middlewares/general-limiter';

// Import route modules
import authRoutes from './api/auth';
import userRoutes from './api/user';
import mediaRoutes from './api/media';
import projectRoutes from './api/project';
import notificationRoutes from './api/notification';
import subscriberRoutes from './api/subscriber';
import collectionRoutes from './api/collection';
import collaboratorRoutes from './api/collaborator';

const router = express.Router();

router.use('/auth', authLimiter, authRoutes);
router.use('/user', generalLimiter, userRoutes);
router.use('/media', generalLimiter, mediaRoutes);
router.use('/project', generalLimiter, projectRoutes);
router.use('/notification', generalLimiter, notificationRoutes);
router.use('/subscriber', generalLimiter, subscriberRoutes);
router.use('/collection', generalLimiter, collectionRoutes);
router.use('/collaborator', generalLimiter, collaboratorRoutes);

export default router;
