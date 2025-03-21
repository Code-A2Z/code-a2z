import mongoose from "mongoose";
import notificationSchema from "../Schemas/notification.schema.js";

const Notification = mongoose.model("notifications", notificationSchema);

export default Notification;
