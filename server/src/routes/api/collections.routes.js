import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import createNewCollection from '../../controllers/collection/create-collection.js';
import saveProject from '../../controllers/collection/save-project.js';
import sortProject from '../../controllers/collection/sort-project.js';
import removeProject from '../../controllers/collection/remove-project.js';
import deleteCollection from '../../controllers/collection/delete-collection.js';

const collectionRoutes = express.Router();

collectionRoutes.post(
  '/create-collection',
  authenticateUser,
  createNewCollection
);
collectionRoutes.post('/:id', authenticateUser, saveProject);
collectionRoutes.get('/sorted-project', authenticateUser, sortProject);
collectionRoutes.patch('/saved-projects', authenticateUser, removeProject);
collectionRoutes.delete('/', authenticateUser, deleteCollection);

export default collectionRoutes;
