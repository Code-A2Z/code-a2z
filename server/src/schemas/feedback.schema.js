import { Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../constants/db.js';

const FEEDBACK_SCHEMA = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USERS,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    details: {
      type: String,
      required: true,
      minlength: [10, 'Details must be at least 10 characters long'],
      maxlength: [2000, 'Details cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['articles', 'chats', 'code'],
    },
    reproduce_steps: {
      type: String,
      default: '',
    },
    attachment_url: {
      type: String,
      default: '',
    },
    attachment_public_id: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default FEEDBACK_SCHEMA;
