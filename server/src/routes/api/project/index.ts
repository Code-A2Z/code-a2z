import express from "express";

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import createProject from "./controllers/create-project";
import getAllProjects from "./controllers/get-all-projects";
import trendingProjects from "./controllers/trending-projects";
import searchProjects from "./controllers/search-projects";
import allLatestProjectsCount from "./controllers/all-latest-projects-count";
import searchProjectsCount from "./controllers/search-projects-count";
import getProject from "./controllers/get-project";
import userWrittenProjects from "./controllers/user-written-projects";
import userWrittenProjectsCount from "./controllers/user-written-projects-count";
import deleteProject from "./controllers/delete-project";

const projectRoutes = express.Router();

projectRoutes.post("/create", authenticateUser, createProject);
projectRoutes.post("/getall", getAllProjects);
projectRoutes.get("/trending", trendingProjects);
projectRoutes.post("/search", searchProjects);
projectRoutes.post("/all-latest-count", allLatestProjectsCount);
projectRoutes.post("/search-count", searchProjectsCount);
projectRoutes.post("/get", getProject);
projectRoutes.post("/user-written", authenticateUser, userWrittenProjects);
projectRoutes.post("/user-written-count", authenticateUser, userWrittenProjectsCount);
projectRoutes.delete("/delete", authenticateUser, deleteProject);

export default projectRoutes;
