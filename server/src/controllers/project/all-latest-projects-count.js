import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const allLatestProjectsCount = async (req, res) => {
  Project.countDocuments({ draft: false })
    .then(count => {
      return sendResponse(
        res,
        200,
        'success',
        'Total projects count fetched successfully',
        { totalDocs: count }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default allLatestProjectsCount;
