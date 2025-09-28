import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';
import { emailRegex } from '../../utils/regex.js';

const subscribeEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendResponse(res, 400, 'error', 'Email is required', null);
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, 'error', 'Invalid email', null);
  }

  let subscriber = await Subscriber.findOne({ email });
  if (subscriber) {
    if (subscriber.isSubscribed) {
      return sendResponse(
        res,
        200,
        'success',
        'You are already subscribed to our newsletter',
        null
      );
    }

    subscriber.isSubscribed = true;
    subscriber.unsubscribedAt = null;

    await subscriber
      .save()
      .then(() => {
        return sendResponse(
          res,
          200,
          'success',
          'You have been resubscribed to our newsletter',
          null
        );
      })
      .catch(err => {
        return sendResponse(res, 500, 'error', err.message, null);
      });
  }

  subscriber = new Subscriber({ email });
  await subscriber
    .save()
    .then(() => {
      return sendResponse(
        res,
        201,
        'success',
        'Thank you for subscribing to our newsletter',
        null
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default subscribeEmail;
