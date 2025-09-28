import Collection from '../../models/collection.model.js';
import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const createCollection = async (req, res) => {
  const user_id = req.user;
  const { collection_name } = req.body;

  const newCollection = new Collection({
    user_id,
    collection_name,
  });

  newCollection
    .save()
    .then(collection => {
      User.findOneAndUpdate(
        { _id: user_id },
        { $push: { collections: collection._id } }
      )
        .then(user => {
          return sendResponse(
            res,
            201,
            'success',
            `${collection_name} collection created successfully for ${user.personal_info.fullname}`,
            { collection }
          );
        })
        .catch(err => {
          return sendResponse(res, 500, 'error', err.message, null);
        });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default createCollection;
