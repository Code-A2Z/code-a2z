import Collection from '../../models/collection.model.js';
import { sendResponse } from '../../utils/response.js';

const deleteCollection = async (req, res) => {
  try {
    const user_id = req.user;
    const { collection_name } = req.body;

    if (!collection_name) {
      return sendResponse(
        res,
        400,
        'error',
        'Collection name is required',
        null
      );
    }

    const deleted = await Collection.findOneAndDelete({
      user_id,
      collection_name,
    });

    if (!deleted) {
      return sendResponse(res, 404, 'error', 'Collection not found', null);
    }

    return sendResponse(
      res,
      200,
      'success',
      'Collection deleted successfully',
      { deleted }
    );
  } catch (err) {
    return sendResponse(res, 500, 'error', err.message, null);
  }
};

export default deleteCollection;
