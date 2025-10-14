import Notification from '../../models/notification.model.js';
import { NotificationTypes } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';

const getNotifications = async (req, res) => {
  try {
    const user_id = req.user;
    const page = parseInt(req.query.page) || 1;
    const filter = req.query.filter || NotificationTypes.ALL;
    const deletedDocCount = parseInt(req.query.deletedDocCount) || 0;
    const maxLimit = 10;

    const findQuery = { notification_for: user_id, user: { $ne: user_id } };
    if (filter !== NotificationTypes.ALL) findQuery.type = filter;

    let skipDocs = (page - 1) * maxLimit;
    if (deletedDocCount) skipDocs -= deletedDocCount;

    const notifications = await Notification.find(findQuery)
      .skip(skipDocs)
      .limit(maxLimit)
      .populate('project', 'title project_id')
      .populate(
        'user',
        'personal_info.username personal_info.fullname personal_info.profile_img'
      )
      .populate('comment', 'comment')
      .populate('replied_on_comment', 'comment')
      .populate('reply', 'comment')
      .sort({ createdAt: -1 })
      .select('createdAt type seen reply')
      .lean();

    // Mark these notifications as seen
    Notification.updateMany(
      { _id: { $in: notifications.map(n => n._id) } },
      { seen: true }
    ).catch(err => console.log('Failed to mark notifications seen:', err));

    return sendResponse(
      res,
      200,
      'success',
      'Notifications fetched successfully',
      notifications
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

export default getNotifications;
