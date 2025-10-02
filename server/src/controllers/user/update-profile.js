import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';
import { PROFILE_BIO_LIMIT } from '../../constants/index.js';

export const updateProfile = async (req, res) => {
  const { username, bio, social_links } = req.body;

  if (username.length < 3) {
    return sendResponse(
      res,
      403,
      'error',
      'Username should be atleast 3 characters long',
      null
    );
  }

  if (bio.length > PROFILE_BIO_LIMIT) {
    return sendResponse(
      res,
      403,
      'error',
      `Bio should be less than ${PROFILE_BIO_LIMIT} characters`,
      null
    );
  }

  const socialLinksArr = Object.keys(social_links);
  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      if (social_links[socialLinksArr[i]].length) {
        const hostname = new URL(social_links[socialLinksArr[i]]).hostname;
        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != 'website'
        ) {
          return sendResponse(
            res,
            403,
            'error',
            `${socialLinksArr[i]} link is invalid. You must enter a full link`,
            null
          );
        }
      }
    }
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      `You must provide full social links with http(s) included - ${err.message}`,
      null
    );
  }

  const updateObj = {
    'personal_info.username': username,
    'personal_info.bio': bio,
    social_links,
  };

  User.findOneAndUpdate({ _id: req.user }, updateObj, {
    runValidators: true,
  })
    .then(() => {
      return sendResponse(res, 200, 'success', 'Profile updated successfully', {
        username,
      });
    })
    .catch(err => {
      if (err.code === 11000) {
        return sendResponse(
          res,
          409,
          'error',
          'Username is already taken',
          null
        );
      }
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default updateProfile;
