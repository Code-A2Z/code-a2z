import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/typings";
import Collection from "../models/collection.model";
import User from "../models/user.model";
import { sendResponse } from "../utils/response";

export const createCollection = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user;
  const { collection_name } = req.body;

  const newCollection = new Collection({
    userId,
    collection_name,
  });

  newCollection.save()
    .then((collection) => {
      User.findOneAndUpdate({ _id: userId }, { $push: { "collections": collection._id } })
        .then(user => {
          return sendResponse(res, "success", `Collection ${collection_name} for ${user?.personal_info?.username} created successfully`, { collection }, 201);
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
  const userId = req.user;
  const { collection_name, project_id } = req.body;

  const existingProject = await Collection.findOne({ userId, collection_name, project_id });
  if (existingProject) {
    return sendResponse(res, "error", "Project already exists in this collection", null, 400);
  }

  const existingCollection = await Collection.find({ userId, collection_name });
  if (existingCollection.length === 0) {
    const defaultCollection = new Collection({
      userId,
      collection_name: "default-collection",
      project_id
    });
    await defaultCollection.save();

    return res.status(201).json(
      `Project saved in 'default-collection' for user ${userId}`
    );
  }

  // Case 2: Try to update empty project_id - in case of manula creation,we had project_is null, so here we try to update that id for that document, to use this document and avoid redudancy in the collection

  const emptySlot = await Collection.findOneAndUpdate(
    { userID, collection_name, project_id: null },
    { $set: { project_id } },
    { new: true }
  );

  if (emptySlot) {
    return res.status(200).json(
      `Project added to empty slot in collection '${collection_name}' for ${existingUser.personal_info.username}`
    );
  }


  // Case 3: No empty slots → create new document for the project being saved 
  const newDoc = new Collection(
    {
      userID,
      collection_name,
      project_id
    });

  await newDoc.save();


  return res.status(201).json(
    `New document created in collection '${collection_name}' with project for ${existingUser.personal_info.username}`
  );
};
