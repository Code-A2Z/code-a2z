/**
 * POST /api/feedback/submit - Submit user feedback
 * @param {string} title - Short and descriptive title (5-200 chars)
 * @param {string} details - Detailed description (10-2000 chars)
 * @param {string} category - Feedback category ('articles', 'chats', 'code')
 * @param {string} reproduce_steps - Optional steps to reproduce issue
 * @param {file} attachment - Optional image file upload
 * @returns {Object} Created feedback object
 */

import Feedback from '../../models/feedback.model.js';
import { sendResponse } from '../../utils/response.js';
import cloudinary from '../../config/cloudinary.js';
import { nanoid } from 'nanoid';

const submitFeedback = async (req, res, next) => {
  try {
    const { title, details, category, reproduce_steps, attachment } = req.body;

    // Validation
    if (!title || title.length < 5 || title.length > 200) {
      return sendResponse(
        res,
        400,
        'Title must be between 5 and 200 characters'
      );
    }
    if (!details || details.length < 10 || details.length > 2000) {
      return sendResponse(
        res,
        400,
        'Details must be between 10 and 2000 characters'
      );
    }
    if (!['articles', 'chats', 'code'].includes(category)) {
      return sendResponse(res, 400, 'Invalid category');
    }

    let attachment_url = '';
    let attachment_public_id = '';

    if (attachment) {
      try {
        const date = new Date();
        const uniqueFileName = `feedback-${nanoid()}-${date.getTime()}`;

        // Upload Base64 image directly to Cloudinary
        const result = await cloudinary.uploader.upload(attachment, {
          public_id: uniqueFileName,
          folder: 'feedback_attachments',
          resource_type: 'image',
        });

        attachment_url = result.secure_url;
        attachment_public_id = result.public_id;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return sendResponse(res, 500, 'Failed to upload attachment');
      }
    }

    const feedback = await Feedback.create({
      user_id: req.user.id,
      title,
      details,
      category,
      reproduce_steps,
      attachment_url,
      attachment_public_id,
      status: 'pending',
    });

    return sendResponse(res, 201, 'Feedback submitted successfully', {
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

export default submitFeedback;
