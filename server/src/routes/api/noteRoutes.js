import { Router } from "express";
import { getNotes, addNote, updateNote } from "../../controllers/noteController.js";
import { isAuthenticated } from "../../middlewares/auth.js";
import { isCollaborator, isMaintainer } from "../../middlewares/roleAuth.js";

const router = Router();

router.get("/projects/:id/notes",
    isAuthenticated,
    isCollaborator,
    getNotes
);

router.post("/projects/:id/notes",
    isAuthenticated,
    isMaintainer,
    addNote
);

router.put("/projects/:projectId/notes/:noteId",
    isAuthenticated,
    isMaintainer,
    updateNote
);

export default router;
