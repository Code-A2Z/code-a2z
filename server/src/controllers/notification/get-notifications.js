import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';

const getNotifications = async (req, res) => {
  const user_id = req.user;
  const { page, filter, deletedDocCount } = req.body;
  const maxLimit = 10;

  const findQuery = { notification_for: user_id, user: { $ne: user_id } };
  if (filter !== 'all') {
    findQuery.type = filter;
  }

  let skipDocs = (page - 1) * maxLimit;
  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Notification.find(findQuery)
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
    .then(notifications => {
      Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then(() => {
          console.log('Notifications seen');
        })
        .catch(err => {
          console.log(err);
        });

      return sendResponse(
        res,
        200,
        'success',
        'Notifications fetched successfully',
        { notifications }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getNotifications;
