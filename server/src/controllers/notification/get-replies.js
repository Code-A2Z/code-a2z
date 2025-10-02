import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const getReplies = async (req, res) => {
  const { _id, skip } = req.body;
  const maxLimit = 5;

  Comment.findOne({ _id })
    .populate({
      path: 'children',
      options: {
        limit: maxLimit,
        skip: skip,
        sort: { commentedAt: -1 },
      },
      populate: {
        path: 'commented_by',
        select:
          'personal_info.username personal_info.fullname personal_info.profile_img',
      },
      select: '-project_id -updatedAt',
    })
    .select('children')
    .then(doc => {
      return sendResponse(res, 200, 'success', 'Replies fetched successfully', {
        replies: doc?.children,
      });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getReplies;
