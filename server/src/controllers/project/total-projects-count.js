/**
 * GET /api/project/total-count - Get total published projects count
 * @returns {Object} Total count
 */

import PROJECT from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const totalPublishedProjects = async (req, res) => {
  try {
    const count = await PROJECT.countDocuments({ is_draft: false });
    return sendResponse(res, 200, 'Total projects count fetched successfully', {
      totalDocs: count,
    });
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Internal server error');
  }
};

export default totalPublishedProjects;
