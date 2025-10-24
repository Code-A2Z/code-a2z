/**
 * PATCH /api/subscriber/unsubscribe - Unsubscribe an email from newsletter
 * @param {string} email - Email address (body param)
 * @returns {Object} Success message
 */

import SUBSCRIBER from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';
import { EMAIL_REGEX } from '../../utils/regex.js';

const unsubscribeEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendResponse(res, 400, 'Email is required');
  }
  if (!EMAIL_REGEX.test(email)) {
    return sendResponse(res, 400, 'Invalid email');
  }

  try {
    const subscriber = await SUBSCRIBER.findOne({ email });
    if (!subscriber) {
      return sendResponse(res, 404, 'Email not found in our subscription list');
    }
    if (!subscriber.is_subscribed) {
      return sendResponse(
        res,
        200,
        'You are already unsubscribed from our newsletter'
      );
    }

    // Unsubscribe the subscriber
    subscriber.is_subscribed = false;
    subscriber.unsubscribed_at = new Date();

    await subscriber.save();
    return sendResponse(
      res,
      200,
      'You have been unsubscribed from our newsletter'
    );
  } catch (error) {
    return sendResponse(res, 500, error.message || 'Internal Server Error');
  }
};

export default unsubscribeEmail;
