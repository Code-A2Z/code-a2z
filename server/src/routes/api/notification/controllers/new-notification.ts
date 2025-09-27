import { Response } from "express";

import Notification from "../../../../models/notification.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const newNotification = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;

  Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } })
    .then(result => {
      if (result) {
        return sendResponse(res, "success", "New notification available", { new_notification_available: true }, 200);
      } else {
        return sendResponse(res, "success", "No new notifications", { new_notification_available: false }, 200);
      }
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default newNotification;
