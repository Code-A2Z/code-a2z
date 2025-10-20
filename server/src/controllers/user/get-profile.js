/**
 * GET /api/user/profile?username= - Get user profile by username
 * @param {string} username - Username (query param)
 * @returns {Object} User profile
 */

import USER from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const getProfile = async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return sendResponse(res, 400, 'Username is required');
  }

  try {
    let user = await USER.findOne({ 'personal_info.username': username })
      .select(
        '-personal_info.password -updatedAt -projects -collaborated_projects -collections'
      )
      .populate({
        path: 'personal_info.subscriber_id',
        select: 'email -_id',
      })
      .lean();

    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }

    // Flatten email object to string
    if (user.personal_info?.subscriber_id?.email) {
      user.personal_info.subscriber_id = user.personal_info.subscriber_id.email;
    }

    return sendResponse(res, 200, 'User fetched successfully', user);
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default getProfile;
