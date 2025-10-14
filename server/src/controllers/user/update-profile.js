import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';
import { PROFILE_BIO_LIMIT } from '../../constants/index.js';
import { URLRegex } from '../../utils/regex.js';

const updateProfile = async (req, res) => {
  const { username, bio, social_links } = req.body;

  if (!username || username.length < 3) {
    return sendResponse(
      res,
      403,
      'error',
      'Username should be at least 3 characters long'
    );
  }

  if (bio && bio.length > PROFILE_BIO_LIMIT) {
    return sendResponse(
      res,
      403,
      'error',
      `Bio should be less than ${PROFILE_BIO_LIMIT} characters`
    );
  }

  // Validate social links
  try {
    const socialLinksArr = Object.keys(social_links || {});
    for (let i = 0; i < socialLinksArr.length; i++) {
      const link = social_links[socialLinksArr[i]];
      if (link && link.length > 0) {
        const hostname = new URL(link).hostname;
        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] !== 'website' &&
          !URLRegex.test(link)
        ) {
          return sendResponse(
            res,
            403,
            'error',
            `${socialLinksArr[i]} link is invalid. You must enter a full link with http(s)`
          );
        }
      }
    }
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      `You must provide full social links with http(s) included - ${err.message}`
    );
  }

  const updateObj = {
    'personal_info.username': username,
    'personal_info.bio': bio || '',
    social_links: social_links || {},
  };

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user },
      updateObj,
      { runValidators: true, new: true, context: 'query' }
    );

    if (!updatedUser) {
      return sendResponse(res, 404, 'error', 'User not found');
    }

    return sendResponse(res, 200, 'success', 'Profile updated successfully', {
      username: updatedUser.personal_info.username,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (username already taken)
      return sendResponse(res, 409, 'error', 'Username is already taken');
    }
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default updateProfile;
