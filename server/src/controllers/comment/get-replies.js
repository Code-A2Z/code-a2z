import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const getReplies = async (req, res) => {
  try {
    const { comment_id, skip = 0 } = req.query;
    const maxLimit = 5;

    if (!comment_id) {
      return sendResponse(res, 400, 'error', 'Comment ID is required');
    }

    const commentDoc = await Comment.findOne({ _id: comment_id })
      .populate({
        path: 'children',
        options: {
          limit: parseInt(maxLimit),
          skip: parseInt(skip),
          sort: { commentedAt: -1 },
        },
        populate: {
          path: 'commented_by',
          select:
            'personal_info.username personal_info.fullname personal_info.profile_img -_id',
        },
        select: '-project_id -updatedAt',
      })
      .select('children')
      .lean();

    return sendResponse(
      res,
      200,
      'success',
      'Replies fetched successfully',
      commentDoc?.children || []
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

export default getReplies;
