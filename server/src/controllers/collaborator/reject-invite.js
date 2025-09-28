import Collaborator from '../../models/collaborator.model.js';
import { sendResponse } from '../../utils/response.js';

const rejectInvitation = async (req, res) => {
  const token = req.params.token;
  const user_id = req.user;

  try {
    const collaborationRequest = await Collaborator.findOne({
      token: token,
      author_id: user_id,
      status: 'pending',
    });
    if (!collaborationRequest) {
      return sendResponse(res, 404, 'error', 'Invalid or expired token!', null);
    }

    if (collaborationRequest.status !== 'pending') {
      return sendResponse(
        res,
        400,
        'error',
        'This invitation has already been responded.',
        null
      );
    }

    collaborationRequest.status = 'rejected';
    collaborationRequest.token = ' '; // Invalidate the token after use
    await collaborationRequest.save();
    return sendResponse(
      res,
      200,
      'success',
      'You have rejected the collaboration invitation',
      null
    );
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

export default rejectInvitation;
