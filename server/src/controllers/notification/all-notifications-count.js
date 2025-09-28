import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';

const allNotificationsCount = async (req, res) => {
  const user_id = req.user;
  const { filter } = req.body;
  const findQuery = { notification_for: user_id, user: { $ne: user_id } };

  if (filter !== 'all') {
    findQuery.type = filter;
  }

  Notification.countDocuments(findQuery)
    .then(count => {
      return sendResponse(
        res,
        200,
        'success',
        'Total notifications count fetched successfully',
        { totalDocs: count }
      );
    })
    .catch(err => {
      return sendResponse(
        res,
        500,
        'error',
        'Failed to fetch total notifications count',
        { error: err.message }
      );
    });
};

export default allNotificationsCount;
