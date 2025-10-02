import { Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../constants/db.js';

const notificationSchema = Schema(
  {
    type: {
      type: String,
      enum: ['like', 'comment', 'reply'],
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.PROJECTS,
    },
    notification_for: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.USERS,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTION_NAMES.USERS,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COMMENTS,
    },
    reply: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COMMENTS,
    },
    replied_on_comment: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COMMENTS,
    },
  },
  {
    timestamps: true,
  }
);

export default notificationSchema;
