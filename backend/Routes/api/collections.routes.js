import express from 'express';
import { createNewCollection, saveProject} from '../../Controllers/collection.controller.js';
import { authenticateUser } from '../../Middlewares/auth.middleware.js';
const collectionRoutes = express.Router();
collectionRoutes.post("/create-collection", authenticateUser, createNewCollection);
collectionRoutes.post("/:id",  authenticateUser, saveProject);


export default collectionRoutes;

