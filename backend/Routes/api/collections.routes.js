import express from 'express';
import { createNewCollection, saveProject} from '../../Controllers/collection.controller.js';
import { authenticateUser } from '../../Middlewares/auth.middleware.js';
const collection = express.Router();
collection.post("/:id",  authenticateUser, saveProject);
collection.post("/create-collection", authenticateUser, createNewCollection);

export default collection;