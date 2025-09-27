import { Response } from "express";

import { AuthenticatedRequest } from "../../../../middlewares/typings";
import Collection from "../../../../models/collection.model";
import { sendResponse } from "../../../../utils/response";

const deleteCollection = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user_id = req.user;
    const { collection_name } = req.body;

    if (!collection_name) {
      return sendResponse(res, "error", "Collection name is required", null, 400);
    }

    const deleted = await Collection.findOneAndDelete({ user_id, collection_name });

    if (!deleted) {
      return sendResponse(res, "error", "Collection not found", null, 404);
    }

    return sendResponse(res, "success", "Collection deleted successfully", { deleted }, 200);
  } catch (err: any) {
    return sendResponse(res, "error", err.message, null, 500);
  }
};

export default deleteCollection;
