/**
 * GET /api/user/search?q= - Search users by username
 * @param {string} query - Search query (query param)
 * @returns {Object[]} Array of users
 */

import USER from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const searchUser = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return sendResponse(res, 400, 'Search query is required');
  }

  try {
    // TODO: Implement pagination for large result sets
    const users = await USER.find({
      'personal_info.username': new RegExp(query, 'i'),
    })
      .limit(50)
      .select(
        'personal_info.fullname personal_info.username personal_info.profile_img -_id'
      );

    return sendResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    return sendResponse(res, 500, error.message || 'Internal Server Error');
  }
};

export default searchUser;
