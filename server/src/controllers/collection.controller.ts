import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/typings";
import Collection from "../models/collection.model";
import User from "../models/user.model";
import { sendResponse } from "../utils/response";

export const createCollection = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { collection_name } = req.body;

  const newCollection = new Collection({
    userId: user_id,
    collection_name,
  });

  newCollection.save()
    .then((collection) => {
      User.findOneAndUpdate({ _id: user_id }, { $push: { "collections": collection._id } })
        .then(user => {
          return sendResponse(res, "success", `${collection_name} collection created successfully`, { collection }, 201);
        })
        .catch(err => {
          return sendResponse(res, "error", err.message, null, 500);
        });
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const saveProjectInCollection = async (
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
