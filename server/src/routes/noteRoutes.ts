import { Router } from "express";
import { getNotes, addNote, updateNote } from "../controllers/noteController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isCollaborator, isMaintainer, isAdmin } from "../middlewares/roleAuth";



const router = Router();

/**
 * GET notes — COLLABORATOR / MAINTAINER / ADMIN
 */
router.get(
  "/projects/:id/notes",
  isAuthenticated,
  isCollaborator,   // 👈 NEW
  getNotes
);

/**
 * POST note — MAINTAINER / ADMIN
 */
router.post(
  "/projects/:id/notes",
  isAuthenticated,
  isMaintainer,     // 👈 NEW
  addNote
);

/**
 * PUT note — MAINTAINER / ADMIN
 */
router.put(
  "/projects/:projectId/notes/:noteId",
  isAuthenticated,
  isMaintainer,     // 👈 NEW
  updateNote
);

export default router;
