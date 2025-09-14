import { nanoid } from 'nanoid';
import { Request, Response } from 'express';

import Project from '../models/project.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import Comment from '../models/comment.model';
import { AuthenticatedRequest } from '../middlewares/typings';
import { sendResponse } from '../utils/response';

export const createProject = async (
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

export const getAllProjects = async (
  req: Request,
  res: Response,
) => {
  const { page } = req.body;
  const maxLimit = 5;

  Project.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("project_id title des banner tags activity publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(projects => {
      return sendResponse(res, "success", "Projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const trendingProjects = async (
  req: Request,
  res: Response,
) => {
  Project.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
    .select("project_id title publishedAt -_id")
    .limit(5)
    .then(projects => {
      return sendResponse(res, "success", "Trending projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const searchProjects = async (
  req: Request,
  res: Response,
) => {
  const { tag, query, author, page, limit, elminate_project } = req.body;
  let findQuery: Record<string, any> = { draft: false };

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
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("project_id title des banner tags activity publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then(projects => {
      return sendResponse(res, "success", "Projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const allLatestProjectsCount = async (
  req: Request,
  res: Response,
) => {
  Project.countDocuments({ draft: false })
    .then(count => {
      return sendResponse(res, "success", "Total projects count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const searchProjectsCount = async (
  req: Request,
  res: Response,
) => {
  const { tag, author, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, 'i') };
  } else if (author) {
    findQuery = { draft: false, author: author };
  }

  Project.countDocuments(findQuery)
    .then(count => {
      return sendResponse(res, "success", "Search projects count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const getProject = async (
  req: Request,
  res: Response,
) => {
  const { project_id, draft, mode } = req.body;
  const incrementVal = mode !== 'edit' ? 1 : 0;

  Project.findOneAndUpdate({ project_id }, { $inc: { "activity.total_reads": incrementVal } }, { new: true })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt project_id tags projectUrl repository")
    .then(project => {
      if (!project) {
        return sendResponse(res, "error", "Project not found", null, 404);
      }

      // Ensure project.author is populated and not just ObjectId
      if (project.author && typeof project.author === 'object' && 'personal_info' in project.author) {
        const authorWithPersonalInfo = project.author as { personal_info: { username: string } };
        User.findOneAndUpdate({ "personal_info.username": authorWithPersonalInfo.personal_info.username }, {
          $inc: { 'account_info.total_reads': incrementVal }
        })
          .catch(err => {
            return sendResponse(res, "error", err.message, null, 500);
          });
      }

      if (project.draft && !draft) {
        return sendResponse(res, "error", "You can't access draft project", null, 500);
      }

      return sendResponse(res, "success", "Project fetched successfully", { project }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const userWrittenProjects = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { page, draft, query, deletedDocCount } = req.body;

  const maxLimit = 5;
  let skipDocs = (page - 1) * maxLimit;

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Project.find({ author: user_id, draft, title: new RegExp(query, 'i') })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select("title banner publishedAt project_id activity des draft -_id")
    .then(projects => {
      return sendResponse(res, "success", "User projects fetched successfully", { projects }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const userWrittenProjectsCount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { draft, query } = req.body;

  Project.countDocuments({ author: user_id, draft, title: new RegExp(query, 'i') })
    .then(count => {
      return sendResponse(res, "success", "User projects count fetched successfully", { totalDocs: count }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { project_id } = req.body;

  Project.findOneAndDelete({ project_id })
    .then(project => {
      if (!project) {
        return sendResponse(res, "error", "Project not found", null, 404);
      }

      Notification.deleteMany({ project: project._id })
        .then(data => console.log("Notification deleted"))
        .catch(err => console.log(`Notification deletion error: ${err}`));

      Comment.deleteMany({ project: project._id })
        .then(data => console.log("Comments deleted"))
        .catch(err => console.log(`Comment deletion error: ${err}`));

      User.findOneAndUpdate({ _id: user_id }, { $pull: { projects: project._id }, $inc: { "account_info.total_posts": -1 } })
        .then(user => {
          return sendResponse(res, "success", "Project deleted successfully", null, 200);
        })
        .catch(err => {
          return sendResponse(res, "error", err.message, null, 500);
        });
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};
