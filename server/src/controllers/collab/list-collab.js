import Collab from '../../models/collab.model.js';
import { sendResponse } from '../../utils/response.js';

const getListOfCollaborators = async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.params;

    const collaborators = await Collab.find({
      project_id,
      author_id: user_id,
    }).lean();

    if (!collaborators.length) {
      return sendResponse(res, 404, 'error', 'No collaborators found!');
    }

    return sendResponse(
      res,
      200,
      'success',
      'Collaborators fetched successfully',
      collaborators
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal Server Error'
    );
  }
};

export default getListOfCollaborators;
