import express from "express";

import { authenticateUser } from "../../Middlewares/auth.middleware.js";

import {invitationToCollaborate,getListOfCollaborators } from "../../Controllers/collaboration.controller.js";
const collaborationRoutes = express.Router();

collaborationRoutes.post("/invite", authenticateUser, invitationToCollaborate);
collaborationRoutes.get("/collaborators/:project_id", authenticateUser, getListOfCollaborators);


export default collaborationRoutes;