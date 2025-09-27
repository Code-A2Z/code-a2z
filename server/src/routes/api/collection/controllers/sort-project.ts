import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/typings";
import Collection from "../../../../models/collection.model";
import Project from "../../../../models/project.model";
import { sendResponse } from "../../../../utils/response";

const sortProject = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user_id = req.user;
    const { sortBy } = req.query as { sortBy?: string };

    // Get all project IDs from the user's collections
    const collections = await Collection.find({ user_id }).lean();
    const projectIds = collections.flatMap(c => c.project_id);

    if (!projectIds.length) {
      return sendResponse(res, "success", "No projects found in collections", [], 200);
    }

    let query = Project.find({ _id: { $in: projectIds } });

    switch (sortBy) {
      case "likes":
        query = query.sort({ "activity.total_likes": -1 });
        break;
      case "newest":
        query = query.sort({ createdAt: -1 });
        break;
      case "oldest":
        query = query.sort({ createdAt: 1 });
        break;
      default:
        query = query.sort({ createdAt: -1 }); // fallback: newest
    }

    const projects = await query
      .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
      .lean();

    return sendResponse(res, "success", "Projects fetched successfully", projects, 200);
  } catch (err: any) {
    console.error(err);
    return sendResponse(res, "error", err.message, null, 500);
  }
};

export default sortProject;
