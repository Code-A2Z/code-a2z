import express from 'express';
import authenticateUser from '../../middlewares/auth.middleware';
import {
  createCollection,
  saveProjectInCollection,
} from '../../controllers/collection.controller';

const collectionRoutes = express.Router();

collectionRoutes.post("/create-collection", authenticateUser, createCollection);
collectionRoutes.post("/:id",  authenticateUser, saveProjectInCollection);

export default collectionRoutes;
