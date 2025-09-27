import { Schema } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date || null,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: 'joinedAt'
    }
  }
);

export default subscriberSchema;
