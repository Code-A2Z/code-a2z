import { Schema } from 'mongoose';

const collaboratorSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    project_id: {
      type: String,
      ref: 'projects',
      required: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true
  }
);

export default collaboratorSchema;
