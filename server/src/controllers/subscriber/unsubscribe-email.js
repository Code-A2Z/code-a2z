import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';
import { emailRegex } from '../../utils/regex.js';

const unsubscribeEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendResponse(res, 400, 'error', 'Email is required');
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, 'error', 'Invalid email');
  }

  try {
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return sendResponse(
        res,
        404,
        'error',
        'Email not found in our subscription list'
      );
    }
    if (!subscriber.isSubscribed) {
      return sendResponse(
        res,
        200,
        'success',
        'You are already unsubscribed from our newsletter'
      );
    }

    // Unsubscribe the subscriber
    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = new Date();

    await subscriber.save();
    return sendResponse(
      res,
      200,
      'success',
      'You have been unsubscribed from our newsletter'
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      error.message || 'Internal Server Error'
    );
  }
};

export default unsubscribeEmail;
