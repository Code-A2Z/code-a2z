import { Response } from "express";

import Collection from "../../../../models/collection.model";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import { sendResponse } from "../../../../utils/response";

const removeProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { collection_id, project_id } = req.body;

  const updatedCollection = await Collection.findOneAndUpdate(
    { _id: collection_id, user_id, project_id: { $in: [project_id] } },
    { $pull: { project_id } },
    { new: true }
  );

  if (!updatedCollection) {
    return sendResponse(res, "error", "Project not found in this collection", null, 404);
  }

  return sendResponse(res, "success", "Project removed from collection successfully", null, 200);
};

export default removeProject;
