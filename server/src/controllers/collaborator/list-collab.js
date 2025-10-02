import Collaborator from '../../models/collaborator.model.js';
import { sendResponse } from '../../utils/response.js';

const getListOfCollaborators = async (req, res) => {
  const user_id = req.user;
  const { project_id } = req.params;

  try {
    const existingCollaborators = await Collaborator.find({
      project_id: project_id,
      author_id: user_id,
    });

    if (!existingCollaborators || existingCollaborators.length === 0) {
      return sendResponse(res, 404, 'error', 'No collaborators found!', null);
    }

    return sendResponse(res, 200, 'success', 'Collaborators fetched successfully', existingCollaborators);
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      error.message || 'Internal Server Error',
      null
    );
  }
};

export default getListOfCollaborators;
