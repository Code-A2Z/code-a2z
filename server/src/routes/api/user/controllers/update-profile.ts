import { Response } from "express";

import User from "../../../../models/user.model";
import { sendResponse } from "../../../../utils/response";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { PROFILE_BIO_LIMIT } from "../../../../constants";

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { username, bio, social_links } = req.body;

  if (username.length < 3) {
    return sendResponse(res, "error", "Username should be atleast 3 characters long", null, 403);
  }

  if (bio.length > PROFILE_BIO_LIMIT) {
    return sendResponse(res, "error", `Bio should be less than ${PROFILE_BIO_LIMIT} characters`, null, 403);
  }

  const socialLinksArr = Object.keys(social_links);
  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      if (social_links[socialLinksArr[i]].length) {
        const hostname = new URL(social_links[socialLinksArr[i]]).hostname;
        if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
          return sendResponse(res, "error", `${socialLinksArr[i]} link is invalid. You must enter a full link`, null, 403);
        }
      }
    }
  } catch (err) {
    return sendResponse(res, "error", "You must provide full social links with http(s) included", null, 500);
  }

  const updateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  }

  User.findOneAndUpdate({ _id: req.user }, updateObj, {
    runValidators: true
  })
    .then(() => {
      return sendResponse(res, "success", "Profile updated successfully", { username }, 200);
    })
    .catch(err => {
      if (err.code === 11000) {
        return sendResponse(res, "error", "Username is already taken", null, 409);
      }
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export default updateProfile;
