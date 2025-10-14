import { nanoid } from 'nanoid';

import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const createProject = async (req, res) => {
  const authorId = req.user;
  let {
    title,
    des,
    banner,
    project_url,
    repository,
    tags,
    content,
    draft,
    id,
  } = req.body;

  if (!title || !title.trim().length) {
    return sendResponse(res, 403, 'error', 'You must provide a title');
  }

  if (!draft) {
    if (!des || !des.trim().length || des.length > 200) {
      return sendResponse(
        res,
        403,
        'error',
        'You must provide project description under 200 characters'
      );
    }

    if (!banner || !banner.trim().length) {
      return sendResponse(
        res,
        403,
        'error',
        'You must provide project banner to publish it'
      );
    }

    if (!repository || !repository.trim().length) {
      return sendResponse(
        res,
        403,
        'error',
        'You must provide project repository to publish it'
      );
    }

    if (!tags?.length || tags.length > 10) {
      return sendResponse(
        res,
        403,
        'error',
        'Provide tags in order to publish the project, Maximum 10'
      );
    }

    if (!content?.[0]?.blocks?.length) {
      return sendResponse(
        res,
        403,
        'error',
        'There must be some project content to publish it'
      );
    }
  }

  // Normalize tags
  tags = tags?.map(tag => tag.toLowerCase()) || [];

  // Generate project ID
  const project_id =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, '-')
      .trim() + nanoid();

  try {
    if (id) {
      // Update existing project
      const updatedProject = await Project.findOneAndUpdate(
        { project_id },
        {
          title,
          des,
          banner,
          project_url,
          repository,
          content,
          tags,
          draft: Boolean(draft),
        },
        { new: true }
      );

      if (!updatedProject) {
        return sendResponse(res, 404, 'error', 'Project not found to update');
      }

      return sendResponse(res, 200, 'success', 'Project updated successfully', {
        id: project_id,
      });
    } else {
      // Create new project
      const project = new Project({
        project_id,
        title,
        banner,
        des,
        project_url,
        repository,
        content,
        tags,
        author: authorId,
        draft: Boolean(draft),
      });

      const savedProject = await project.save();

      // Update user's total posts and project list
      if (!draft) {
        await User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { 'account_info.total_posts': 1 },
            $push: { projects: savedProject._id },
          }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: authorId },
          { $push: { projects: savedProject._id } }
        );
      }

      return sendResponse(res, 200, 'success', 'Project created successfully', {
        id: savedProject.project_id,
      });
    }
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Internal server error'
    );
  }
};

export default createProject;
