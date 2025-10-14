import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';
import { emailRegex } from '../../utils/regex.js';

const subscribeEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendResponse(res, 400, 'error', 'Email is required');
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, 'error', 'Invalid email');
  }

  try {
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.isSubscribed) {
        return sendResponse(
          res,
          200,
          'success',
          'You are already subscribed to our newsletter'
        );
      }

      // Resubscribe the existing subscriber
      subscriber.isSubscribed = true;
      subscriber.unsubscribedAt = null;

      await subscriber.save();
      return sendResponse(
        res,
        200,
        'success',
        'You have been resubscribed to our newsletter'
      );
    }

    // New subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();
    return sendResponse(
      res,
      201,
      'success',
      'Thank you for subscribing to our newsletter'
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

export default subscribeEmail;
