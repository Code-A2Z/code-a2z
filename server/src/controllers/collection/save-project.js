import Collection from '../../models/collection.model.js';
import { sendResponse } from '../../utils/response.js';

const saveProjectInCollection = async (req, res) => {
  const user_id = req.user;
  const { collection_name, project_id } = req.body;

  const existingProject = await Collection.findOne({
    user_id,
    collection_name,
    project_id,
  });
  if (existingProject) {
    return sendResponse(
      res,
      400,
      'error',
      'Project already exists in this collection',
      null
    );
  }

  let updatedCollection = await Collection.findOneAndUpdate(
    { user_id, collection_name },
    { $push: { project_id } },
    { new: true }
  );

  if (!updatedCollection) {
    updatedCollection = await Collection.findOneAndUpdate(
      { user_id, collection_name: 'default-collection', project_id },
      { $push: { project_id } },
      { new: true, upsert: true }
    );
    return sendResponse(
      res,
      201,
      'success',
      "Project saved in 'default-collection'",
      null
    );
  }

  return sendResponse(
    res,
    201,
    'success',
    `Project saved in '${collection_name}'`,
    null
  );
};

export default saveProjectInCollection;
