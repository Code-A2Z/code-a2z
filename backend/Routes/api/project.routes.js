import express from "express";
import { allLatestProjectsCount, createProject, getProjects, searchProjects, searchProjectsCount, trendingProjects } from "../../Controllers/project.controller.js";
import { authenticateUser } from "../../Middlewares/auth.middleware.js";

const projectRoutes = express.Router();

projectRoutes.post("/create", authenticateUser, createProject);
projectRoutes.post("/get", getProjects);
projectRoutes.get("/trending", trendingProjects);
projectRoutes.post("/search", searchProjects);
projectRoutes.post("/all-latest-count", allLatestProjectsCount);
projectRoutes.post("/search-count", searchProjectsCount);

export default projectRoutes;
