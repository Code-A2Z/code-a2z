import Project from '../../models/project.model.js';
import { sendResponse } from '../../utils/response.js';

const searchProjects = async (req, res) => {
  const { tag, query, author, page, limit, elminate_project } = req.body;
  let findQuery = { draft: false };

  if (tag) {
    findQuery.tags = tag;
    findQuery.project_id = { $ne: elminate_project };
  } else if (query) {
    findQuery.title = new RegExp(query, 'i');
  } else if (author) {
    findQuery.author = author;
  }

  const maxLimit = limit ? limit : 2;
  Project.find(findQuery)
    .populate(
      'author',
      'personal_info.profile_img personal_info.username personal_info.fullname -_id'
    )
    .sort({ publishedAt: -1 })
    .select('project_id title des banner tags activity publishedAt -_id')
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(projects => {
      return sendResponse(
        res,
        200,
        'success',
        'Projects fetched successfully',
        { projects }
      );
    })
    .catch(err => {
      return sendResponse(res, 500, 'error', err.message, null);
    });
};

export default searchProjects;
