import { Response } from "express";

import { AuthenticatedRequest } from "../../../../middlewares/typings";
import Collection from "../../../../models/collection.model";
import User from "../../../../models/user.model";
import { sendResponse } from "../../../../utils/response";

const createCollection = async (
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

export default createCollection;
