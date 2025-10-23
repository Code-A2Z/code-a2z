import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import createCollection from '../../controllers/collection/create-collection.js';
import saveProject from '../../controllers/collection/save-project.js';
import sortProject from '../../controllers/collection/sort-project.js';
import removeProject from '../../controllers/collection/remove-project.js';
import deleteCollection from '../../controllers/collection/delete-collection.js';

const collectionRoutes = express.Router();

collectionRoutes.post('/', authenticateUser, createCollection);
collectionRoutes.post('/save-project', authenticateUser, saveProject);
collectionRoutes.get('/sort-projects', authenticateUser, sortProject);
collectionRoutes.patch('/remove-project', authenticateUser, removeProject);
collectionRoutes.delete('/:collection_id', authenticateUser, deleteCollection);

export default collectionRoutes;
