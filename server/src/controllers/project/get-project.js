import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import { ProjectVisibilityModes } from '../../typings/index.js';
import { sendResponse } from '../../utils/response.js';

const getProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { mode } = req.query; // mode can be 'edit' or 'read' & removed 'draft = false' boolean param
    if (!project_id)
      return sendResponse(res, 400, 'error', 'Project ID is required');

    const incrementVal = mode !== ProjectVisibilityModes.EDIT ? 1 : 0;

    const project = await Project.findOneAndUpdate(
      { project_id },
      { $inc: { 'activity.total_reads': incrementVal } },
      { new: true }
    )
      .populate(
        'author',
        'personal_info.fullname personal_info.username personal_info.profile_img'
      )
      .select(
        'title des content banner activity publishedAt project_id tags project_url repository draft'
      )
      .lean();

    console.log('calling from get project');
    if (!project) return sendResponse(res, 404, 'error', 'Project not found');

    if (project.draft && mode !== ProjectVisibilityModes.EDIT) {
      return sendResponse(res, 403, 'error', "You can't access draft project");
    }

    // Increment author's total_reads asynchronously, no need to block response
    if (project.author && project.author.personal_info?.username) {
      User.findOneAndUpdate(
        { 'personal_info.username': project.author.personal_info.username },
        { $inc: { 'account_info.total_reads': incrementVal } }
      ).catch(() => {}); // ignore errors here
    }

    return sendResponse(
      res,
      200,
      'success',
      'Project fetched successfully',
      project
    );
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal server error'
    );
  }
};

export default getProject;
