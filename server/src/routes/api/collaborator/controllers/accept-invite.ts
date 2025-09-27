import { Response } from "express";

import Collaborator from "../../../../models/collaborator.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const acceptInvitation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const token = req.params.token;
  const user_id = req.user;

  try {
    const collaborationRequest = await Collaborator.findOne({ token: token, author_id: user_id, status: "pending" })
    if (!collaborationRequest) {
      return sendResponse(res, "error", "Invalid or expired token!", null, 404);
    }

    if (collaborationRequest.status !== "pending") {
      return sendResponse(res, "error", "This invitation has already been responded.", null, 400);
    }

    collaborationRequest.status = "accepted";
    collaborationRequest.token = " " // Invalidate the token after use
    await collaborationRequest.save();
    return sendResponse(res, "success", "You have accepted the collaboration invitation", null, 200);
  }
  catch (error) {
    return sendResponse(res, "error", "Internal Server Error", null, 500);
  }
};

export default acceptInvitation;
