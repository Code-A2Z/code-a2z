import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import invitationToCollaborate from '../../controllers/collaboration/invite-collab.js';
import acceptInvitation from '../../controllers/collaboration/accept-invite.js';
import rejectInvitation from '../../controllers/collaboration/reject-invite.js';
import getListOfCollaborators from '../../controllers/collaboration/list-collab.js';

const collaborationRoutes = express.Router();

collaborationRoutes.post('/invite', authenticateUser, invitationToCollaborate);
collaborationRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collaborationRoutes.post('/reject/:token', authenticateUser, rejectInvitation);
collaborationRoutes.get(
  '/:project_id',
  authenticateUser,
  getListOfCollaborators
);

export default collaborationRoutes;
