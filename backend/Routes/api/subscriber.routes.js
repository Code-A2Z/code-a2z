import express from "express";

import { 
    authenticateUser 
} from "../../Middlewares/auth.middleware.js";

import { 
    getAllSubscribers, 
    subscribeEmail, 
    unsubscribeEmail 
} from "../../Controllers/subscriber.controller.js";


const subscriberRoutes = express.Router();

subscriberRoutes.post("/subscribe", subscribeEmail);
subscriberRoutes.patch("/unsubscribe", unsubscribeEmail);

// Protected routes
subscriberRoutes.get("/all", authenticateUser, getAllSubscribers);


export default subscriberRoutes;
