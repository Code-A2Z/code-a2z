import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import allLatestProjectsCount from '../../controllers/project/all-latest-projects-count.js';
import createProject from '../../controllers/project/create-project.js';
import getProject from '../../controllers/project/get-project.js';
import getAllProjects from '../../controllers/project/get-all-projects.js';
import searchProjects from '../../controllers/project/search-projects.js';
import searchProjectsCount from '../../controllers/project/search-projects-count.js';
import trendingProjects from '../../controllers/project/trending-projects.js';
import userWrittenProjects from '../../controllers/project/user-written-projects.js';
import userWrittenProjectsCount from '../../controllers/project/user-written-projects-count.js';
import deleteProject from '../../controllers/project/delete-project.js';

const projectRoutes = express.Router();

projectRoutes.post('/create', authenticateUser, createProject);
projectRoutes.post('/getall', getAllProjects);
projectRoutes.get('/trending', trendingProjects);
projectRoutes.post('/search', searchProjects);
projectRoutes.post('/all-latest-count', allLatestProjectsCount);
projectRoutes.post('/search-count', searchProjectsCount);
projectRoutes.post('/get', getProject);
projectRoutes.post('/user-written', authenticateUser, userWrittenProjects);
projectRoutes.post(
  '/user-written-count',
  authenticateUser,
  userWrittenProjectsCount
);
projectRoutes.post('/delete', authenticateUser, deleteProject);

export default projectRoutes;
