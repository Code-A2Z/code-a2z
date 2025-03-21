import express from "express";
import { getAllSubscribers, subscribeEmail, unsubscribeEmail } from "../../Controllers/subscriber.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/subscribe", subscribeEmail);
subscriberRoutes.post("/unsubscribe", unsubscribeEmail);
subscriberRoutes.get("/all", authenticateUser, getAllSubscribers);

export default subscriberRoutes;
