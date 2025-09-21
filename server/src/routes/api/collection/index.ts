import express from 'express';

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import createCollection from './controllers/create-collection';
import saveProjectInCollection from './controllers/save-project';
import removeProject from './controllers/remove-project';

const collectionRoutes = express.Router();

collectionRoutes.post("/create-collection", authenticateUser, createCollection);
collectionRoutes.put("/save-project",  authenticateUser, saveProjectInCollection);
collectionRoutes.put("/remove-project", authenticateUser, removeProject);

export default collectionRoutes;
