import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const searchUser = async (req, res) => {
  const { query } = req.body;

  User.find({ 'personal_info.username': new RegExp(query, 'i') })
    .limit(50)
    .select(
      'personal_info.fullname personal_info.username personal_info.profile_img -_id'
    )
    .then(users => {
      return sendResponse(res, 200, 'success', 'Users fetched successfully', {
        users,
      });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default searchUser;
