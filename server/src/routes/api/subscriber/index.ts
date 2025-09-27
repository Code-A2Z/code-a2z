import express from "express";

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import subscribeEmail from "./controllers/subscribe-email";
import unsubscribeEmail from "./controllers/unsubscribe-email";
import getAllSubscribers from "./controllers/get-all-subscribers";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/subscribe", subscribeEmail);
subscriberRoutes.post("/unsubscribe", unsubscribeEmail);
subscriberRoutes.get("/all", authenticateUser, getAllSubscribers);

export default subscriberRoutes;
