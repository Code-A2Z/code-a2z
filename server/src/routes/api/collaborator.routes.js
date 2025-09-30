import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import invitationToCollaborate from '../../controllers/collaborator/invite-collab.js';
import acceptInvitation from '../../controllers/collaborator/accept-invite.js';
import rejectInvitation from '../../controllers/collaborator/reject-invite.js';
import getListOfCollaborators from '../../controllers/collaborator/list-collab.js';

const collaboratorRoutes = express.Router();

collaboratorRoutes.post('/invite', authenticateUser, invitationToCollaborate);
collaboratorRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collaboratorRoutes.post('/reject/:token', authenticateUser, rejectInvitation);
collaboratorRoutes.get('/collaborators/:project_id', authenticateUser, getListOfCollaborators)

export default collaboratorRoutes;
