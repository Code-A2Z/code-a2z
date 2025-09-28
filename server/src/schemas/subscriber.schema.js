import { Schema } from 'mongoose';

const subscriberSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'joinedAt',
    },
  }
);

export default subscriberSchema;
