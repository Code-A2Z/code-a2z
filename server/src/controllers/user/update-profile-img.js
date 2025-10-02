import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const updateProfileImg = async (req, res) => {
  const { url } = req.body;

  User.findOneAndUpdate({ _id: req.user }, { 'personal_info.profile_img': url })
    .then(() => {
      return sendResponse(
        res,
        200,
        'success',
        'Profile image updated successfully',
        { profile_img: url }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default updateProfileImg;
