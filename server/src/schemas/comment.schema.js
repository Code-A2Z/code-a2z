import { Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../constants/db.js';

const commentSchema = Schema(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.PROJECTS,
    },
    project_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.PROJECTS,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    children: {
      type: [Schema.Types.ObjectId],
      ref: COLLECTION_NAMES.COMMENTS,
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.USERS,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COMMENTS,
    },
  },
  {
    timestamps: true,
  }
);

export default commentSchema;
