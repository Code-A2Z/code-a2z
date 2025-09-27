import { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "reply"],
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'projects',
    },
    notification_for: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
    reply: {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
    replied_on_comment: {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
  },
  {
    timestamps: true
  }
);

export default notificationSchema;
