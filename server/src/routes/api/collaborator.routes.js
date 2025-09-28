import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import invitationToCollaborate from '../../controllers/collaborator/invite-collab.js';
import acceptInvitation from '../../controllers/collaborator/accept-invite.js';
import rejectInvitation from '../../controllers/collaborator/reject-invite.js';

const collaboratorRoutes = express.Router();

collaboratorRoutes.post('/invite', authenticateUser, invitationToCollaborate);
collaboratorRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collaboratorRoutes.post('/reject/:token', authenticateUser, rejectInvitation);

export default collaboratorRoutes;
