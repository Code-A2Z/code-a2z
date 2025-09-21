import express from "express";
import authenticateUser from "../../middlewares/auth.middleware";
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
  deleteProject,
} from "../../controllers/project.controller";

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
projectRoutes.post("/delete", authenticateUser, deleteProject);

export default projectRoutes;
