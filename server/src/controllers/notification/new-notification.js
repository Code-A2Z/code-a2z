import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';

const newNotification = async (req, res) => {
  const user_id = req.user;

  Notification.exists({
    notification_for: user_id,
    seen: false,
    user: { $ne: user_id },
  })
    .then(result => {
      if (result) {
        return sendResponse(res, 200, 'success', 'New notification available', {
          new_notification_available: true,
        });
      } else {
        return sendResponse(res, 200, 'success', 'No new notifications', {
          new_notification_available: false,
        });
      }
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default newNotification;
