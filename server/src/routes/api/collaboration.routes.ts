import express from "express";
import authenticateUser from "../../middlewares/auth.middleware";
import {
  invitationToCollaborate,
  acceptInvitation,
  rejectInvitation,
} from "../../controllers/collaborator.controller";

const collaborationRoutes = express.Router();

collaborationRoutes.post("/invite", authenticateUser, invitationToCollaborate);
collaborationRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collaborationRoutes.post('/reject/:token', authenticateUser, rejectInvitation);

export default collaborationRoutes;
