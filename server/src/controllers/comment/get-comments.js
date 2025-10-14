import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const getComments = async (req, res) => {
  try {
    const { project_id, skip = 0 } = req.query;
    const maxLimit = 5;

    if (!project_id) {
      return sendResponse(res, 400, 'error', 'Project ID is required');
    }

    const comments = await Comment.find({ project_id, isReply: false })
      .populate(
        'commented_by',
        'personal_info.username personal_info.fullname personal_info.profile_img -_id'
      )
      .skip(parseInt(skip))
      .limit(maxLimit)
      .sort({ commentedAt: -1 })
      .lean();

    return sendResponse(
      res,
      200,
      'success',
      'Comments fetched successfully',
      comments
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

export default getComments;
