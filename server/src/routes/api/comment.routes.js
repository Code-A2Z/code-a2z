import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import addComment from '../../controllers/comment/add-comment.js';
import getComments from '../../controllers/comment/get-comments.js';
import getReplies from '../../controllers/comment/get-replies.js';
import deleteComment from '../../controllers/comment/delete-comment.js';

const commentRoutes = express.Router();

commentRoutes.post('/', authenticateUser, addComment);
commentRoutes.get('/', getComments);
commentRoutes.get('/replies', getReplies);
commentRoutes.delete('/:comment_id', authenticateUser, deleteComment);

export default commentRoutes;
