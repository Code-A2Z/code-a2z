import Subscriber from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';

const getAllSubscribers = async (req, res) => {
  await Subscriber.find({ isSubscribed: true })
    .select('email subscribedAt')
    .sort({ subscribedAt: -1 })
    .then(subscribers => {
      return sendResponse(res, 200, 'success', 'Fetched all subscribers', {
        subscribers,
      });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getAllSubscribers;
