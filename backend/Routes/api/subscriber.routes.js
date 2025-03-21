import express from "express";
import { subscribeEmail } from "../../Controllers/subscriber.controller.js";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/subscribe", subscribeEmail);

export default subscriberRoutes;
