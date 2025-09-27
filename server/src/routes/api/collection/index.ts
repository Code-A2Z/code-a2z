import express from 'express';

// Import authentication middleware
import authenticateUser from '../../../middlewares/auth.middleware';

// Import controller functions
import createCollection from './controllers/create-collection';
import saveProjectInCollection from './controllers/save-project';
import removeProject from './controllers/remove-project';
import sortProject from './controllers/sort-project';
import deleteCollection from './controllers/delete-collection';

const collectionRoutes = express.Router();

collectionRoutes.post("/create-collection", authenticateUser, createCollection);
collectionRoutes.put("/save-project",  authenticateUser, saveProjectInCollection);
collectionRoutes.put("/remove-project", authenticateUser, removeProject);
collectionRoutes.post("/sort-project", authenticateUser, sortProject);
collectionRoutes.delete("/delete", authenticateUser, deleteCollection);

export default collectionRoutes;
