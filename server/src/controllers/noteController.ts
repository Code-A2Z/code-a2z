import { Request, Response } from 'express';
import { NoteModel, INote } from '../models/NoteModel';
import mongoose from 'mongoose';

// --- Helper function to get authenticated user ID ---
// NOTE: This assumes an auth middleware attaches the user ID to the request object.
const getUserId = (req: Request): mongoose.Types.ObjectId | undefined => {
    // ADJUST THIS LINE if req.user.id is named differently in the project!
    return (req as any).user?.id ? new mongoose.Types.ObjectId((req as any).user.id) : undefined;
};

// --- 1. GET: Fetch all private notes for a specific project by the authenticated user ---
export const getProjectNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const { projectId } = req.params;

        const notes: INote[] = await NoteModel.find({
            projectId: projectId,
            userId: userId, // CRUCIAL: Only fetch notes belonging to this user
        }).sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server error while fetching notes.' });
    }
};

// --- 2. POST: Create a new private note ---
export const createNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const { projectId, content, status } = req.body;

        if (!projectId || !content) {
            res.status(400).json({ message: 'Project ID and content are required.' });
            return;
        }

        const newNote: INote = await NoteModel.create({
            userId: userId, // Automatically link to the current user
            projectId,
            content,
            status: status || 'todo',
        });

        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Server error while creating note.' });
    }
};

// --- 3. PUT: Update an existing private note ---
export const updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const { noteId } = req.params;
        const { content, status } = req.body;

        const updatedNote: INote | null = await NoteModel.findOneAndUpdate(
            { _id: noteId, userId: userId }, // CRUCIAL: Find by ID AND User ID for ownership check
            { content, status },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            res.status(404).json({ message: 'Note not found or you do not have permission to update it.' });
            return;
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Server error while updating note.' });
    }
};

// --- 4. DELETE: Delete a private note ---
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const { noteId } = req.params;

        const deletedNote: INote | null = await NoteModel.findOneAndDelete({
            _id: noteId,
            userId: userId, // CRUCIAL: Find by ID AND User ID for ownership check
        });

        if (!deletedNote) {
            res.status(404).json({ message: 'Note not found or you do not have permission to delete it.' });
            return;
        }

        res.status(200).json({ message: 'Note successfully deleted.' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server error while deleting note.' });
    }
};