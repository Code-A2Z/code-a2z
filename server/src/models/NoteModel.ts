import { Schema, model } from "mongoose";

const NoteSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const NOTE = model("Note", NoteSchema);

export default NOTE;
