import express from "express";
import { subscribeEmail, unsubscribeEmail } from "../../Controllers/subscriber.controller.js";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/subscribe", subscribeEmail);
subscriberRoutes.post("/unsubscribe", unsubscribeEmail);

export default subscriberRoutes;
