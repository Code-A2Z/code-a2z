import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. Define the TypeScript Interface for the Note Document
export interface INote extends Document {
    userId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    content: string;
    status: 'todo' | 'in-progress' | 'done'; // Added status for progress tracking
}

// 2. Define the Mongoose Schema
const NoteSchema: Schema = new Schema(
    {
        // Links the note to the User who created it (Privacy check)
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Assuming the User model is named 'User'
            required: true,
            index: true,
        },
        // Links the note to the Project it is related to
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project', // Assuming the Project model is named 'Project'
            required: true,
            index: true,
        },
        // The main content of the private note
        content: {
            type: String,
            required: true,
            trim: true,
        },
        // Status for tracking progress
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            default: 'todo',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// 3. Export the Mongoose Model
export const NoteModel: Model<INote> = mongoose.model<INote>('Note', NoteSchema);