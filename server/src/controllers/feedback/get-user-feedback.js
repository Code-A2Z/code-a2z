/**
 * GET /api/feedback/user - Get all feedback submitted by the authenticated user
 * @returns {Object} List of user feedbacks
 */

import Feedback from '../../models/feedback.model.js';
import { sendResponse } from '../../utils/response.js';

const getUserFeedback = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const feedbacks = await Feedback.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    return sendResponse(res, 200, 'User feedback fetched successfully', {
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    return sendResponse(res, 500, 'Server Error', { error: error.message });
  }
};

export default getUserFeedback;
