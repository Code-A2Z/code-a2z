import { Schema } from "mongoose";

const collectionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    collection_name: {
      type: String,
      required: true,
    },
    project_id: {
      type: [Schema.Types.ObjectId],
      default: null,
      ref: 'projects',
    },
  },
  {
    timestamps: true
  }
);

export default collectionSchema;
