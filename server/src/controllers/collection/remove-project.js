import Collection from '../../models/collection.model.js';
import { sendResponse } from '../../utils/response.js';

const removeProject = async (req, res) => {
  const user_id = req.user;
  const { collection_id, project_id } = req.body;

  const updatedCollection = await Collection.findOneAndUpdate(
    { _id: collection_id, user_id, project_id: { $in: [project_id] } },
    { $pull: { project_id } },
    { new: true }
  );

  if (!updatedCollection) {
    return sendResponse(
      res,
      404,
      'error',
      'Project not found in this collection',
      null
    );
  }

  return sendResponse(
    res,
    200,
    'success',
    'Project removed from collection successfully',
    null
  );
};

export default removeProject;
