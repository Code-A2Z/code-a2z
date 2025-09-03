import express from "express";

import { authenticateUser } from "../../Middlewares/auth.middleware.js";


import {invitationToCollaborate, acceptInvitation, rejectInvitation} from "../../Controllers/collaboration.controller.js";
const collaborationRoutes = express.Router();

collaborationRoutes.post("/invite", authenticateUser, invitationToCollaborate);
collaborationRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collaborationRoutes.post('/reject/:token', authenticateUser, rejectInvitation);




export default collaborationRoutes;