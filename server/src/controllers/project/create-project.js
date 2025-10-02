import { nanoid } from 'nanoid';

import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const createProject = async (req, res) => {
  const authorId = req.user;
  let { title, des, banner, projectUrl, repository, tags, content, draft, id } =
    req.body;

  if (!title.length) {
    return sendResponse(res, 403, 'error', 'You must provide a title', null);
  }

  if (!draft) {
    if (!des.length || des.length > 200) {
      return sendResponse(
        res,
        403,
        'error',
        'You must provide project description under 200 characters',
        null
      );
    }

    if (!banner.length) {
      return sendResponse(
        res,
        403,
        'error',
        'You must provide project banner to publish it',
        null
      );
    }

    if (!repository.length) {
      return sendResponse(
        res,
        403,
        'error',
        'You must provide project repository to publish it',
        null
      );
    }

    if (!content.blocks.length) {
      return sendResponse(
        res,
        403,
        'error',
        'There must be some project content to publish it',
        null
      );
    }

    if (!tags.length || tags.length > 10) {
      return sendResponse(
        res,
        403,
        'error',
        'Provide tags in order to publish the project, Maximum 10',
        null
      );
    }
  }

  tags = tags.map(tag => tag.toLowerCase());
  const project_id =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, '-')
      .trim() + nanoid();

  if (id) {
    Project.findOneAndUpdate(
      { project_id },
      {
        title,
        des,
        banner,
        projectUrl,
        repository,
        content,
        tags,
        draft: draft ? draft : false,
      }
    )
      .then(project => {
        console.log('Project updated successfully', project._id);
        return sendResponse(
          res,
          200,
          'success',
          'Project updated successfully',
          { id: project_id }
        );
      })
      .catch(err => {
        return sendResponse(res, 500, 'error', err.message, null);
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
      draft: Boolean(draft),
    });

    project
      .save()
      .then(project => {
        const incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { 'account_info.total_posts': incrementVal },
            $push: { projects: project._id },
          }
        )
          .then(user => {
            console.log('Project created successfully', user._id);
            return sendResponse(
              res,
              200,
              'success',
              'Project created successfully',
              { id: project.project_id }
            );
          })
          .catch(err => {
            return sendResponse(
              res,
              500,
              'error',
              err.message || 'Failed to update total posts number',
              null
            );
          });
      })
      .catch(err => {
        return sendResponse(res, 500, 'error', err.message, null);
      });
  }
};

export default createProject;
