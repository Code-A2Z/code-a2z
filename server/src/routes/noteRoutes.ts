import { Router } from 'express';
import {
    getProjectNotes,
    createNote,
    updateNote,
    deleteNote,
} from '../controllers/noteController';
// NOTE: Update the path if your authMiddleware is located elsewhere
import authMiddleware from '../middlewares/auth.middleware';
const router: Router = Router();

// All note routes require authentication to ensure privacy
router.use(authMiddleware); 

// GET /api/v1/notes/:projectId -> Fetch all notes for a specific project by the user
router.get('/:projectId', getProjectNotes);

// POST /api/v1/notes -> Create a new note
router.post('/', createNote);

// PUT /api/v1/notes/:noteId -> Update a specific note
router.put('/:noteId', updateNote);

// DELETE /api/v1/notes/:noteId -> Delete a specific note
router.delete('/:noteId', deleteNote);

export default router;