import Collab from '../../models/collab.model.js';
import { COLLABORATION_STATUS } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';

const rejectInvitation = async (req, res) => {
  try {
    const user_id = req.user;
    const token = req.params.token;

    const collaboration = await Collab.findOne({
      token,
      author_id: user_id,
      status: COLLABORATION_STATUS.PENDING,
    });

    if (!collaboration) {
      return sendResponse(res, 404, 'error', 'Invalid or expired token!');
    }

    // Update status to rejected and invalidate token
    collaboration.status = COLLABORATION_STATUS.REJECTED;
    collaboration.token = ' '; // invalidate token
    await collaboration.save();

    return sendResponse(
      res,
      200,
      'success',
      'Collaboration invitation rejected successfully'
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

export default rejectInvitation;
