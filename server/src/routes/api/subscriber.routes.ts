import express from "express";
import authenticateUser from "../../middlewares/auth.middleware";
import {
  getAllSubscribers,
  subscribeEmail,
  unsubscribeEmail,
} from "../../controllers/subscriber.controller";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/subscribe", subscribeEmail);
subscriberRoutes.post("/unsubscribe", unsubscribeEmail);
subscriberRoutes.get("/all", authenticateUser, getAllSubscribers);

export default subscriberRoutes;
