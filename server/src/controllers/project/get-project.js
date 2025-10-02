import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import { sendResponse } from '../../utils/response.js';

const getProject = async (req, res) => {
  const { project_id, draft, mode } = req.body;
  const incrementVal = mode !== 'edit' ? 1 : 0;

  Project.findOneAndUpdate(
    { project_id },
    { $inc: { 'activity.total_reads': incrementVal } },
    { new: true }
  )
    .populate(
      'author',
      'personal_info.fullname personal_info.username personal_info.profile_img'
    )
    .select(
      'title des content banner activity publishedAt project_id tags projectUrl repository'
    )
    .then(project => {
      if (!project) {
        return sendResponse(res, 404, 'error', 'Project not found', null);
      }

      // Ensure project.author is populated and not just ObjectId
      if (
        project.author &&
        typeof project.author === 'object' &&
        'personal_info' in project.author
      ) {
        const authorWithPersonalInfo = project.author;
        User.findOneAndUpdate(
          {
            'personal_info.username':
              authorWithPersonalInfo.personal_info.username,
          },
          {
            $inc: { 'account_info.total_reads': incrementVal },
          }
        ).catch(err => {
          return sendResponse(res, 500, 'error', err.message, null);
        });
      }

      if (project.draft && !draft) {
        return sendResponse(
          res,
          500,
          'error',
          "You can't access draft project",
          null
        );
      }

      return sendResponse(res, 200, 'success', 'Project fetched successfully', {
        project,
      });
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default getProject;
