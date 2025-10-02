import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';
import { emailRegex } from '../../utils/regex.js';

const unsubscribeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, 400, 'error', 'Email is required', null);
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, 'error', 'Invalid email', null);
  }

  const subscriber = await Subscriber.findOne({ email });

  if (!subscriber) {
    return sendResponse(
      res,
      404,
      'error',
      'Email not found in our subscription list',
      null
    );
  }

  if (!subscriber.isSubscribed) {
    return sendResponse(
      res,
      200,
      'success',
      'You are already unsubscribed from our newsletter',
      null
    );
  }

  subscriber.isSubscribed = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber
    .save()
    .then(() => {
      return sendResponse(
        res,
        200,
        'success',
        'You have been unsubscribed from our newsletter',
        null
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default unsubscribeEmail;
