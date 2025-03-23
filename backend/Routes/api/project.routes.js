import express from "express";

import {
    authenticateUser
} from "../../Middlewares/auth.middleware.js";

import {
    allLatestProjectsCount,
    createProject,
    getProject,
    getAllProjects,
    searchProjects,
    searchProjectsCount,
    trendingProjects,
    userWrittenProjects,
    userWrittenProjectsCount,
    deleteProject
} from "../../Controllers/project.controller.js";


const projectRoutes = express.Router();

projectRoutes.get("/all", getAllProjects);
projectRoutes.get("/trending", trendingProjects);
projectRoutes.get("/search", searchProjects);
projectRoutes.get("/stats/latest-count", allLatestProjectsCount);
projectRoutes.get("/stats/search-count", searchProjectsCount);
projectRoutes.get("/get", getProject);

// User protected routes
projectRoutes.post("/create", authenticateUser, createProject);
projectRoutes.delete("/delete", authenticateUser, deleteProject);

// User specific routes
projectRoutes.get("/user", authenticateUser, userWrittenProjects);
projectRoutes.get("/user/stats/count", authenticateUser, userWrittenProjectsCount);


export default projectRoutes;
