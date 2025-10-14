import { Types } from 'mongoose';
import Collection from '../../models/collection.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteCollection = async (req, res) => {
  try {
    const user_id = req.user;
    const { collection_id } = req.body;

    if (!collection_id || !Types.ObjectId.isValid(collection_id)) {
      return sendResponse(
        res,
        400,
        'error',
        'Invalid or missing collection_id',
        null
      );
    }

    const deletedCollection = await Collection.findOneAndDelete({
      user_id,
      _id: collection_id,
    });

    if (!deletedCollection) {
      return sendResponse(res, 404, 'error', 'Collection not found', null);
    }

    return sendResponse(
      res,
      200,
      'success',
      `${deletedCollection.collection_name} collection deleted successfully!`
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

export default deleteCollection;
