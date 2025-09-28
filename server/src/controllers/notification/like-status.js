import Notification from '../../models/notification.model.js';
import { sendResponse } from '../../utils/response.js';

const likeStatus = async (req, res) => {
  const user_id = req.user;
  const { _id } = req.body;

  Notification.exists({ type: 'like', project: _id, user: user_id })
    .then(isLiked => {
      return sendResponse(
        res,
        200,
        'success',
        'Like status fetched successfully',
        { isLiked }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default likeStatus;
