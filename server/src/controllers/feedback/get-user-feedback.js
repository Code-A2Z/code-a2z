import Feedback from '../../models/feedback.model.js';

/**
 * Get all feedback submitted by the authenticated user
 */
const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const feedbacks = await Feedback.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message,
    });
  }
};

export default getUserFeedback;
