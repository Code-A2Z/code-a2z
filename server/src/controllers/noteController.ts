import { Request, Response } from "express";
import NOTE from "../models/NoteModel.js";

/**
 * GET all notes for a project
 */
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await NOTE.find({ projectId: req.params.id })
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, notes });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST: Add a new note
 */
export const addNote = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    const note = await NOTE.create({
      projectId: req.params.id,
      authorId: (req as any).user._id, // TypeScript fix
      content,
    });

    return res.status(201).json({ success: true, note });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT: Update a note
 */
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    const note = await NOTE.findByIdAndUpdate(
      req.params.noteId,
      { content },
      { new: true }
    );

    return res.status(200).json({ success: true, note });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
