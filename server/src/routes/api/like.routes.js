import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import likeProject from '../../controllers/like/like-project.js';
import likeStatus from '../../controllers/like/like-status.js';

const likeRoutes = express.Router();

likeRoutes.patch('/', authenticateUser, likeProject);
likeRoutes.get('/', authenticateUser, likeStatus);

export default likeRoutes;
