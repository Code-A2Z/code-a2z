import { model } from "mongoose";
import notificationSchema from "../schemas/notification.schema";

const Notification = model("notifications", notificationSchema);

export default Notification;
