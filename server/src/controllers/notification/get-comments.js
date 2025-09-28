import Comment from '../../models/comment.model.js';
import { sendResponse } from '../../utils/response.js';

const getComments = async (req, res) => {
  const { project_id, skip } = req.body;
  const maxLimit = 5;

  Comment.find({ project_id, isReply: false })
    .populate(
      'commented_by',
      'personal_info.username personal_info.fullname personal_info.profile_img'
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({ commentedAt: -1 })
    .then(comment => {
      return sendResponse(
        res,
        200,
        'success',
        'Comments fetched successfully',
        { comment }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getComments;
