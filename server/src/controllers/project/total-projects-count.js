import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const totalPublishedProjects = async (req, res) => {
  try {
    const count = await Project.countDocuments({ draft: false });
    return sendResponse(
      res,
      200,
      'success',
      'Total projects count fetched successfully',
      { totalDocs: count }
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal server error'
    );
  }
};

export default totalPublishedProjects;
