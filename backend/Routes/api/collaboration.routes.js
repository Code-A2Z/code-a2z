import express from "express";

import { authenticateUser } from "../../Middlewares/auth.middleware.js";

import {invitationToCollaborate} from "../../Controllers/collaboration.controller.js";
const collaborationRoutes = express.Router();

collaborationRoutes.post("/invite", authenticateUser, invitationToCollaborate);


export default collaborationRoutes;