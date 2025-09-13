import express from 'express';
import { createNewCollection, deleteProject, saveProject} from '../../Controllers/collection.controller.js';
import { authenticateUser } from '../../Middlewares/auth.middleware.js';
const collectionRoutes = express.Router();
collectionRoutes.post("/create-collection", authenticateUser, createNewCollection);
collectionRoutes.post("/:id",  authenticateUser, saveProject);
collectionRoutes.delete("/saved-projects", authenticateUser, deleteProject);


export default collectionRoutes;
