import Collection from '../../models/collection.model.js';
import { Types } from 'mongoose';
import { sendResponse } from '../../utils/response.js';

const removeProject = async (req, res) => {
  try {
    const user_id = req.user;
    const { collection_id, project_id } = req.body;

    if (!collection_id || !Types.ObjectId.isValid(collection_id)) {
      return sendResponse(
        res,
        400,
        'error',
        'Invalid or missing collection_id',
        null
      );
    }
    if (!project_id || !Types.ObjectId.isValid(project_id)) {
      return sendResponse(
        res,
        400,
        'error',
        'Invalid or missing project_id',
        null
      );
    }

    // Remove project from collection
    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: collection_id, user_id, projects: { $in: [project_id] } },
      { $pull: { projects: project_id } },
      { new: true }
    );

    if (!updatedCollection) {
      return sendResponse(
        res,
        404,
        'error',
        'Project not found in this collection',
        null
      );
    }

    return sendResponse(
      res,
      200,
      'success',
      'Project removed from collection successfully',
      null
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

export default removeProject;
