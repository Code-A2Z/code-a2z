import User from '../../models/user.model.js';
import { URLRegex } from '../../utils/regex.js';
import { sendResponse } from '../../utils/response.js';

const updateProfileImg = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return sendResponse(res, 400, 'error', 'Profile image URL is required');
  }
  if (!URLRegex.test(url)) {
    return sendResponse(res, 400, 'error', 'Invalid URL format');
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user },
      { 'personal_info.profile_img': url },
      { new: true }
    ).select('personal_info.profile_img');

    if (!updatedUser) {
      return sendResponse(res, 404, 'error', 'User not found');
    }

    return sendResponse(
      res,
      200,
      'success',
      'Profile image updated successfully',
      {
        profile_img: updatedUser.personal_info.profile_img,
      }
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

export default updateProfileImg;
