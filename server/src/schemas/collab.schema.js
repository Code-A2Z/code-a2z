import { Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../constants/db.js';

const collabSchema = Schema(
  {
    user_id: {
      // The collaborator sending the invite
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USERS,
      required: true,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.PROJECTS,
      required: true,
    },
    author_id: {
      // The author of the project who accept/reject the invite
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USERS,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default collabSchema;
