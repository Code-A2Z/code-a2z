import express from "express";

// Import authentication middleware
import authenticateUser from "../../../middlewares/auth.middleware";

// Import controller functions
import invitationToCollaborate from "./controllers/invite-collab";
import acceptInvitation from "./controllers/accept-invite";
import rejectInvitation from "./controllers/reject-invite";

const collaboratorRoutes = express.Router();

collaboratorRoutes.post("/invite", authenticateUser, invitationToCollaborate);
collaboratorRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collaboratorRoutes.post('/reject/:token', authenticateUser, rejectInvitation);

export default collaboratorRoutes;
