import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';


import submitFeedback from '../../controllers/feedback/submit-feedback.js';
import getUserFeedback from '../../controllers/feedback/get-user-feedback.js';

const feedbackRoutes = express.Router();

// Route checks authentication and handles single file upload logic for 'attachment' field
feedbackRoutes.post('/submit', authenticateUser, submitFeedback);

feedbackRoutes.get('/user', authenticateUser, getUserFeedback);

export default feedbackRoutes;
