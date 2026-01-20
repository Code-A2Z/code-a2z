/**
 * GET /api/feedback/user - Get feedback submitted by the authenticated user
 * @query {number} limit - Number of items per page (default: 10)
 * @query {number} skip - Number of items to skip (default: 0)
 * @returns {Object} List of feedback items and total count
 */

import FEEDBACK from '../../models/feedback.model.js';
import { sendResponse } from '../../utils/response.js';

const getUserFeedback = async (req, res) => {
  const user_id = req.user.user_id;
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  try {
    const feedback = await FEEDBACK.find({ user_id })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const total = await FEEDBACK.countDocuments({ user_id });

    return sendResponse(res, 200, 'Feedback retrieved successfully', {
      feedback,
      total,
      hasMore: total > skip + limit,
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    return sendResponse(res, 500, 'Internal Server Error');
  }
};

export default getUserFeedback;
