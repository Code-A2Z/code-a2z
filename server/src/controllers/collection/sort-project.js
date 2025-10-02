import Collection from '../../models/collection.model.js';
import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const sortProject = async (req, res) => {
  try {
    const user_id = req.user;
    const { sortBy } = req.query;

    // Get all project IDs from the user's collections
    const collections = await Collection.find({ user_id }).lean();
    const projectIds = collections.flatMap(c => c.project_id);

    if (!projectIds.length) {
      return sendResponse(
        res,
        200,
        'success',
        'No projects found in collections',
        []
      );
    }

    let query = Project.find({ _id: { $in: projectIds } });

    switch (sortBy) {
      case 'likes':
        query = query.sort({ 'activity.total_likes': -1 });
        break;
      case 'newest':
        query = query.sort({ createdAt: -1 });
        break;
      case 'oldest':
        query = query.sort({ createdAt: 1 });
        break;
      default:
        query = query.sort({ createdAt: -1 }); // fallback: newest
    }

    const projects = await query
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
    return sendResponse(res, 500, 'error', err.message, null);
  }
};

export default sortProject;
