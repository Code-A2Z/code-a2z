import Note from "../models/NoteModel.js";


// GET notes
export const getNotes = async (req, res) => {
  try {
    const projectId = req.params.id;
    const notes = await Note.find({ project: projectId });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

// ADD note
export const addNote = async (req, res) => {
  try {
    const projectId = req.params.id;

    const newNote = await Note.create({
      project: projectId,
      user: req.user._id,
      content: req.body.content,
    });

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message,
    });
  }
};

// UPDATE note
export const updateNote = async (req, res) => {
  try {
    const { projectId, noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, project: projectId },
      { content: req.body.content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
};
