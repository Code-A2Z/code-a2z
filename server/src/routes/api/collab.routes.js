import express from 'express';

import authenticateUser from '../../middlewares/auth.middleware.js';

import invitationToCollaborate from '../../controllers/collab/invite-collab.js';
import acceptInvitation from '../../controllers/collab/accept-invite.js';
import rejectInvitation from '../../controllers/collab/reject-invite.js';
import getListOfCollaborators from '../../controllers/collab/list-collab.js';

const collabRoutes = express.Router();

collabRoutes.post('/invite', authenticateUser, invitationToCollaborate);
collabRoutes.post('/accept/:token', authenticateUser, acceptInvitation);
collabRoutes.post('/reject/:token', authenticateUser, rejectInvitation);
collabRoutes.get('/:project_id', authenticateUser, getListOfCollaborators);

export default collabRoutes;
