import { Types } from 'mongoose';
import Collection from '../../models/collection.model.js';
import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const sortProject = async (req, res) => {
  try {
    const user_id = req.user;
    const collection_id = req.query.collection_id;
    const sortBy = req.query.sortBy || 'newest';

    if (!collection_id || !Types.ObjectId.isValid(collection_id)) {
      return sendResponse(
        res,
        400,
        'error',
        'Invalid or missing collection_id',
        null
      );
    }

    // Fetch the collection for this user
    const collection = await Collection.findOne({ user_id, _id: collection_id })
      .select('projects')
      .lean();

    if (!collection) {
      return sendResponse(res, 404, 'error', 'Collection not found', null);
    }

    const projectIds = collection.projects || [];
    if (!projectIds.length) {
      return sendResponse(
        res,
        200,
        'success',
        'No projects found in this collection',
        []
      );
    }

    // Define sorting criteria
    const sortOptions = {
      likes: { 'activity.total_likes': -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sortCriteria = sortOptions[sortBy] || sortOptions.newest;

    // Fetch projects with sorting and populate author
    const projects = await Project.find({ _id: { $in: projectIds } })
      .sort(sortCriteria)
      .populate(
        'author',
        'personal_info.fullname personal_info.username personal_info.profile_img'
      )
      .lean();

    return sendResponse(
      res,
      200,
      'success',
      'Projects fetched successfully',
      projects
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

export default sortProject;
