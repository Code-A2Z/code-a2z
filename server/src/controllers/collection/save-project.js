import { Types } from 'mongoose';
import Collection from '../../models/collection.model.js';
import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const saveProjectInCollection = async (req, res) => {
  try {
    const user_id = req.user;
    const { collection_id, project_id } = req.body;

    if (!collection_id || !Types.ObjectId.isValid(collection_id)) {
      return sendResponse(
        res,
        400,
        'error',
        'Invalid or missing collection_id'
      );
    }

    if (!project_id || !Types.ObjectId.isValid(project_id)) {
      return sendResponse(res, 400, 'error', 'Invalid or missing project_id');
    }

    // Check project existence
    const projectExists = await Project.exists({ _id: project_id });
    if (!projectExists) {
      return sendResponse(res, 404, 'error', 'Project not found');
    }

    // Check collection existence for user
    const collection = await Collection.findOne({
      user_id,
      _id: collection_id,
    });
    if (!collection) {
      return sendResponse(res, 404, 'error', 'Collection not found');
    }

    // Prevent duplicate project
    if (collection.projects.some(id => id.toString() === project_id)) {
      return sendResponse(
        res,
        200,
        'success',
        'Project already exists in this collection'
      );
    }

    await Collection.updateOne(
      { user_id, _id: collection_id },
      { $push: { projects: project_id } }
    );

    return sendResponse(res, 201, 'success', 'Project saved successfully!');
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default saveProjectInCollection;
