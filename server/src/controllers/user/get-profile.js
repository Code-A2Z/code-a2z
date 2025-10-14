import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const getProfile = async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return sendResponse(res, 400, 'error', 'Username is required');
  }

  try {
    let user = await User.findOne({ 'personal_info.username': username })
      .select(
        '-personal_info.password -updatedAt -projects -collaborated_projects -collections'
      )
      .populate({
        path: 'personal_info.email',
        select: 'email -_id',
      })
      .lean();

    if (!user) {
      return sendResponse(res, 404, 'error', 'User not found');
    }

    // Flatten email object to string
    if (user.personal_info?.email?.email) {
      user.personal_info.email = user.personal_info.email.email;
    }

    return sendResponse(res, 200, 'success', 'User fetched successfully', user);
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default getProfile;
