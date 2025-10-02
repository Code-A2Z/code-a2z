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
      required: true,
    },
    project_id: {
      type: String,
      default: null,
      ref: COLLECTION_NAMES.PROJECTS,
    },
  },
  {
    timestamps: true,
  }
);

export default collectionSchema;
