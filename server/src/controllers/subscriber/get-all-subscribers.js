/**
 * GET /api/subscriber - Get all active subscribers
 * @returns {Object[]} Array of subscribers
 */

import SUBSCRIBER from '../../models/subscriber.model.js';
import { sendResponse } from '../../utils/response.js';

const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await SUBSCRIBER.find({ is_subscribed: true })
      .select('email subscribed_at')
      .sort({ subscribed_at: -1 });

    return sendResponse(res, 200, 'Fetched all subscribers', subscribers);
  } catch (error) {
    return sendResponse(res, 500, error.message || 'Internal Server Error');
  }
};

export default getAllSubscribers;
