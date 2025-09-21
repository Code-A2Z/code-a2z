import { Response } from "express";

import { AuthenticatedRequest } from "../../../../middlewares/typings";
import Collection from "../../../../models/collection.model";
import { sendResponse } from "../../../../utils/response";

const saveProjectInCollection = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { collection_name, project_id } = req.body;

  const existingProject = await Collection.findOne({ userId: user_id, collection_name, project_id });
  if (existingProject) {
    return sendResponse(res, "error", "Project already exists in this collection", null, 400);
  }

  let updatedCollection = await Collection.findOneAndUpdate(
    { user_id, collection_name },
    { $push: { project_id } },
    { new: true }
  );

  if (!updatedCollection) {
    updatedCollection = await Collection.findOneAndUpdate(
      { user_id, collection_name: "default-collection", project_id },
      { $push: { project_id } },
      { new: true, upsert: true }
    );
    return sendResponse(res, "success", "Project saved in 'default-collection'", null, 201);
  }

  return sendResponse(res, "success", `Project saved in '${collection_name}'`, null, 201);
};

export default saveProjectInCollection;
