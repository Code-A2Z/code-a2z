/**
 * GET /api/collection/sort-project - Sort projects in a collection
 * @param {string} collection_id - Collection ID (query param)
 * @param {string} [sortBy=newest] - Sort criteria ('likes', 'newest', 'oldest')
 * @returns {Object[]} Array of sorted projects
 */

import { Types } from 'mongoose';
import COLLECTION from '../../models/collection.model.js';
import PROJECT from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const sortProject = async (req, res) => {
  try {
    const user_id = req.user;
    const collection_id = req.query.collection_id;
    const sortBy = req.query.sortBy || 'newest';

    if (!collection_id || !Types.ObjectId.isValid(collection_id)) {
      return sendResponse(res, 400, 'Invalid or missing collection_id');
    }

    // Fetch the collection for this user
    const collection = await COLLECTION.findOne({ user_id, _id: collection_id })
      .select('project_ids')
      .lean();

    if (!collection) {
      return sendResponse(res, 404, 'Collection not found');
    }

    const projectIds = collection.project_ids || [];
    if (!projectIds.length) {
      return sendResponse(res, 200, 'No projects found in this collection', []);
    }

    // Define sorting criteria
    const sortOptions = {
      likes: { 'activity.total_likes': -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sortCriteria = sortOptions[sortBy] || sortOptions.newest;

    // Fetch projects with sorting and populate author
    const projects = await PROJECT.find({ _id: { $in: projectIds } })
      .sort(sortCriteria)
      .populate(
        'user_id',
        'personal_info.fullname personal_info.username personal_info.profile_img'
      )
      .lean();

    return sendResponse(res, 200, 'Projects fetched successfully', projects);
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal Server Error');
  }
};

export default sortProject;
