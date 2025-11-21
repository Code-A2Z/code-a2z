import express from 'express';

import authLimiter from '../middlewares/auth.limiter.js';
import generalLimiter from '../middlewares/general.limiter.js';

import authRoutes from './api/auth.routes.js';
import subscriberRoutes from './api/subscriber.routes.js';
import mediaRoutes from './api/media.routes.js';
import userRoutes from './api/user.routes.js';
import projectRoutes from './api/project.routes.js';
import likeRoutes from './api/like.routes.js';
import commentRoutes from './api/comment.routes.js';
import notificationRoutes from './api/notification.routes.js';
import collectionRoutes from './api/collections.routes.js';
import collaborationRoutes from './api/collaboration.routes.js';
import noteRoutes from './api/noteRoutes.js';


const router = express.Router();

router.use('/auth', authLimiter, authRoutes);
router.use('/subscriber', generalLimiter, subscriberRoutes);
router.use('/media', generalLimiter, mediaRoutes);
router.use('/user', generalLimiter, userRoutes);
router.use('/project', generalLimiter, projectRoutes);
router.use('/like', generalLimiter, likeRoutes);
router.use('/comment', generalLimiter, commentRoutes);
router.use('/notification', generalLimiter, notificationRoutes);
router.use('/collection', generalLimiter, collectionRoutes);
router.use('/collaboration', generalLimiter, collaborationRoutes);

// Notes API
router.use('/notes', generalLimiter, noteRoutes);

export default router;
