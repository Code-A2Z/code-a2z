import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';

const notificationStatus = async (req, res) => {
  try {
    const user_id = req.user;

    const result = await Notification.exists({
      notification_for: user_id,
      seen: false,
      user: { $ne: user_id },
    });

    return sendResponse(
      res,
      200,
      'success',
      result ? 'New notification available' : 'No new notifications',
      { new_notification_available: Boolean(result) }
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default notificationStatus;
