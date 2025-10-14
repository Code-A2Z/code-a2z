import { Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../constants/db.js';

const collectionSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.USERS,
    },
    collection_name: {
      type: String,
      lowercase: true,
      required: true,
    },
    projects: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: COLLECTION_NAMES.PROJECTS,
    },
  },
  {
    timestamps: true,
  }
);

export default collectionSchema;
