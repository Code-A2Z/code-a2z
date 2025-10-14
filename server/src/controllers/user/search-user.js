import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const searchUser = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return sendResponse(res, 400, 'error', 'Search query is required');
  }

  try {
    const users = await User.find({
      'personal_info.username': new RegExp(query, 'i'),
    })
      .limit(50)
      .select(
        'personal_info.fullname personal_info.username personal_info.profile_img -_id'
      );

    return sendResponse(
      res,
      200,
      'success',
      'Users fetched successfully',
      users
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

export default searchUser;
