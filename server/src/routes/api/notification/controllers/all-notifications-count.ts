import { Response } from "express";

import Notification from "../../../../models/notification.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const allNotificationsCount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { filter } = req.body;
  const findQuery: { [key: string]: any } = { notification_for: user_id, user: { $ne: user_id } };

  if (filter !== 'all') {
    findQuery.type = filter;
  }

  Notification.countDocuments(findQuery)
    .then(count => {
      return sendResponse(res, "success", "Total notifications count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", "Failed to fetch total notifications count", { error: err.message }, 500);
    });
};

export default allNotificationsCount;
