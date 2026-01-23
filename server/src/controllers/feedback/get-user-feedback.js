import Feedback from '../../models/feedback.model.js';
import { sendResponse } from '../../utils/response.js';

/**
 * Get all feedback submitted by the authenticated user
 */
const getUserFeedback = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const feedbacks = await Feedback.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    return sendResponse(
      res,
      200,
      'User feedback fetched successfully',
      feedbacks
    );
  } catch (error) {
    next(error);
  }
};

export default getUserFeedback;
