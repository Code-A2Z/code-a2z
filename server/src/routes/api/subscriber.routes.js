import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import getAllSubscribers from '../../controllers/subscriber/get-all-subscribers.js';
import subscribeEmail from '../../controllers/subscriber/subscribe-email.js';
import unsubscribeEmail from '../../controllers/subscriber/unsubscribe-email.js';

const subscriberRoutes = express.Router();

subscriberRoutes.post('/subscribe', subscribeEmail);
subscriberRoutes.patch('/unsubscribe', authenticateUser, unsubscribeEmail);
subscriberRoutes.get('/', authenticateUser, getAllSubscribers);

export default subscriberRoutes;
