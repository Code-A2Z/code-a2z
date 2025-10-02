import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const getProfile = async (req, res) => {
  const { username } = req.body;

  User.findOne({ 'personal_info.username': username })
    .select('-personal_info.password -google_auth -updatedAt -projects')
    .then(user => {
      return sendResponse(res, 200, 'success', 'User fetched successfully', {
        user,
      });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getProfile;
