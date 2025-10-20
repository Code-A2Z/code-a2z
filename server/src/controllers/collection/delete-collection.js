/**
 * DELETE /api/collection/delete - Delete a collection
 * @param {string} collection_id - Collection ID (body param)
 * @returns {Object} Success message
 */

import { Types } from 'mongoose';
import COLLECTION from '../../models/collection.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteCollection = async (req, res) => {
  try {
    const user_id = req.user;
    const { collection_id } = req.body;

    if (!collection_id || !Types.ObjectId.isValid(collection_id)) {
      return sendResponse(res, 400, 'Invalid or missing collection_id');
    }

    const deleted_collection = await COLLECTION.findOneAndDelete({
      user_id,
      _id: collection_id,
    });

    if (!deleted_collection) {
      return sendResponse(res, 404, 'Collection not found');
    }

    return sendResponse(
      res,
      200,
      `${deleted_collection.collection_name} collection deleted successfully!`
    );
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default deleteCollection;
