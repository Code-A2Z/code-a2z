import express from 'express';

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import createCollection from './controllers/create-collection';
import saveProjectInCollection from './controllers/save-project-in-collection';

const collectionRoutes = express.Router();

collectionRoutes.post("/create-collection", authenticateUser, createCollection);
collectionRoutes.post("/:id",  authenticateUser, saveProjectInCollection);

export default collectionRoutes;
