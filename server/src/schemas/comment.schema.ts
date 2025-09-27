import { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'projects',
    },
    project_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'projects',
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    children: {
      type: [Schema.Types.ObjectId],
      ref: 'comments',
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
  },
  {
    timestamps: true
  }
);

export default commentSchema;
