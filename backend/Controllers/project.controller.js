import { nanoid } from 'nanoid';

import Project from "../Models/project.model.js";
import User from "../Models/user.model.js";

export const createProject = async (req, res) => {
    let authorId = req.user;

    let { title, des, banner, projectUrl, repository, tags, content, draft } = req.body;

    if (!title.length) {
        return res.status(403).json({ error: "You must provide a title" });
    }

    if (!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({ error: "You must provide project description under 200 characters" })
        }

        if (!banner.length) {
            return res.status(403).json({ error: "You must provide project banner to publish it" });
        }

        if (!repository.length) {
            return res.status(403).json({ error: "You must provide project repository to publish it" });
        }

        if (!content.blocks.length) {
            return res.status(403).json({ error: "There must be some project content to publish it" });
        }

        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ error: "Provide tags in order to publish the project, Maximum 10" });
        }
    }

    tags = tags.map(tag => tag.toLowerCase());

    let project_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();

    let project = new Project({
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
    })

    project.save()
        .then(project => {
            let incrementVal = draft ? 0 : 1;

            User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "projects": project._id } })
                .then(user => {
                    return res.status(200).json({ id: project.project_id });
                })
                .catch(err => {
                    return res.status(500).json({ error: "Failed to update total posts number" });
                })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const getProjects = async (req, res) => {

    let { page } = req.body;
    let maxLimit = 5;

    Project.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("project_id title des banner tags activity publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(projects => {
            return res.status(200).json({ projects });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const trendingProjects = async (req, res) => {

    Project.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("project_id title publishedAt -_id")
        .limit(5)
        .then(projects => {
            return res.status(200).json({ projects });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const searchProjects = async (req, res) => {

    let { tag, query, page } = req.body;

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
    }

    let maxLimit = 5;

    Project.find(findQuery)
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("project_id title des banner tags activity publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(projects => {
            return res.status(200).json({ projects });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const allLatestProjectsCount = async (req, res) => {

    Project.countDocuments({ draft: false })
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const searchProjectsCount = async (req, res) => {

    let { tag, query } = req.body;

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
    }

    Project.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}