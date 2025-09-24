import express from 'express';
import { createNewCollection, deleteCollection, deleteProject, saveProject, sortProject} from '../../Controllers/collection.controller.js';
import { authenticateUser } from '../../Middlewares/auth.middleware.js';
const collectionRoutes = express.Router();
collectionRoutes.post("/create-collection", authenticateUser, createNewCollection);
collectionRoutes.post("/:id",  authenticateUser, saveProject);
collectionRoutes.get("/sorted-project", authenticateUser, sortProject);
collectionRoutes.delete("/saved-projects", authenticateUser, deleteProject);
collectionRoutes.delete("/", authenticateUser, deleteCollection);


export default collectionRoutes;