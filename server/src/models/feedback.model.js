import mongoose from 'mongoose';
import { FEEDBACK_CATEGORY, FEEDBACK_STATUS } from '../constants/feedback.js';

const feedbackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    details: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(FEEDBACK_CATEGORY),
    },
    reproduce_steps: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    attachment_url: {
      type: String,
      default: '',
    },
    attachment_public_id: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(FEEDBACK_STATUS),
      default: FEEDBACK_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
feedbackSchema.index({ user_id: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
