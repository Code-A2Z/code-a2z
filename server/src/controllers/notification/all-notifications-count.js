import Notification from '../../models/notification.model.js';
import { NotificationTypes } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';

const allNotificationsCount = async (req, res) => {
  try {
    const user_id = req.user;
    const filter = req.query.filter || NotificationTypes.ALL;

    const findQuery = { notification_for: user_id, user: { $ne: user_id } };
    if (filter !== NotificationTypes.ALL) findQuery.type = filter;

    const count = await Notification.countDocuments(findQuery);
    return sendResponse(
      res,
      200,
      'success',
      'Total notifications count fetched successfully',
      { totalDocs: count }
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Failed to fetch total notifications count'
    );
  }
};

export default allNotificationsCount;
