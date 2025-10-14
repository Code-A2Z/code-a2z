import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';

const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isSubscribed: true })
      .select('email subscribedAt')
      .sort({ subscribedAt: -1 });

    return sendResponse(
      res,
      200,
      'success',
      'Fetched all subscribers',
      subscribers
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

export default getAllSubscribers;
