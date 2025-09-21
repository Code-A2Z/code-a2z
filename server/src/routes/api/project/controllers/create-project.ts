import { nanoid } from 'nanoid';
import { Response } from 'express';

import Project from '../../../../models/project.model';
import User from '../../../../models/user.model';
import { AuthenticatedRequest } from '../../../../middlewares/typings';
import { sendResponse } from '../../../../utils/response';

const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const authorId = req.user;
  let { title, des, banner, projectUrl, repository, tags, content, draft, id } = req.body;

  if (!title.length) {
    return sendResponse(res, "error", "You must provide a title", null, 403);
  }

  if (!draft) {
    if (!des.length || des.length > 200) {
      return sendResponse(res, "error", "You must provide project description under 200 characters", null, 403);
    }

    if (!banner.length) {
      return sendResponse(res, "error", "You must provide project banner to publish it", null, 403);
    }

    if (!repository.length) {
      return sendResponse(res, "error", "You must provide project repository to publish it", null, 403);
    }

    if (!content.blocks.length) {
      return sendResponse(res, "error", "There must be some project content to publish it", null, 403);
    }

    if (!tags.length || tags.length > 10) {
      return sendResponse(res, "error", "Provide tags in order to publish the project, Maximum 10", null, 403);
    }
  }

  tags = tags.map((tag: string) => tag.toLowerCase());
  const project_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();

  if (id) {
    Project.findOneAndUpdate({ project_id }, { title, des, banner, projectUrl, repository, content, tags, draft: draft ? draft : false })
      .then(project => {
        return sendResponse(res, "success", "Project updated successfully", { id: project_id }, 200);
      })
      .catch(err => {
        return sendResponse(res, "error", err.message, null, 500);
      });
  } else {
    const project = new Project({
      title,
      des,
      banner,
      projectUrl,
      repository,
      tags,
      content,
      author: authorId,
      project_id,
      draft: Boolean(draft)
    });

    project.save()
      .then(project => {
        const incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "projects": project._id } })
          .then(user => {
            return sendResponse(res, "success", "Project created successfully", { id: project.project_id }, 200);
          })
          .catch(err => {
            return sendResponse(res, "error", "Failed to update total posts number", null, 500);
          });
      })
      .catch(err => {
        return sendResponse(res, "error", err.message, null, 500);
      });
  }
};

export default createProject;
