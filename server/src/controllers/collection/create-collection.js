import Collection from '../../models/collection.model.js';
import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const createCollection = async (req, res) => {
  try {
    const user_id = req.user;
    const { collection_name } = req.body;

    if (!collection_name?.trim()) {
      return sendResponse(
        res,
        400,
        'error',
        'Collection name is required',
        null
      );
    }

    // Check for duplicate collection name for the same user
    const existingCollection = await Collection.findOne({
      user_id,
      collection_name: collection_name.trim(),
    });
    if (existingCollection) {
      return sendResponse(
        res,
        400,
        'error',
        `Collection '${collection_name}' already exists.`,
        null
      );
    }

    // Create new collection
    const newCollection = await Collection.create({ user_id, collection_name });

    // Push the collection into user's collections array
    const user = await User.findByIdAndUpdate(
      user_id,
      { $push: { collections: newCollection._id } },
      { new: true }
    ).select('personal_info.fullname');

    if (!user) {
      return sendResponse(res, 404, 'error', 'User not found', null);
    }

    return sendResponse(
      res,
      201,
      'success',
      `${collection_name} collection created successfully!`,
      newCollection
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error',
      null
    );
  }
};

export default createCollection;
