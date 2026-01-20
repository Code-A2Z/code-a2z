/**
 * POST /api/feedback/submit - Submit user feedback
 * @param {string} title - Short and descriptive title (5-200 chars)
 * @param {string} details - Detailed description (10-2000 chars)
 * @param {string} category - Feedback category ('articles', 'chats', 'code')
 * @param {string} reproduce_steps - Optional steps to reproduce issue
 * @param {file} attachment - Optional image file upload
 * @returns {Object} Created feedback object
 */

import FEEDBACK from '../../models/feedback.model.js';
import cloudinary from '../../config/cloudinary.js';
import { sendResponse } from '../../utils/response.js';
import sanitizeHtml from 'sanitize-html';
import { nanoid } from 'nanoid';

const submitFeedback = async (req, res) => {
    const { title, details, category, reproduce_steps } = req.body;
    const user_id = req.user.user_id;

    // 1. Validate required fields
    if (!title || title.length < 5 || title.length > 200) {
        return sendResponse(res, 400, 'Title must be between 5 and 200 characters');
    }

    if (!details || details.length < 10 || details.length > 2000) {
        return sendResponse(
            res,
            400,
            'Details must be between 10 and 2000 characters'
        );
    }

    if (!category || !['articles', 'chats', 'code'].includes(category)) {
        return sendResponse(res, 400, 'Invalid category selected');
    }

    // 2. Handle file upload (if present)
    let attachment_url = '';
    let attachment_public_id = '';

    if (req.file) {
        try {
            const date = new Date();
            const uniqueFileName = `feedback-${nanoid()}-${date.getTime()}`;

            const result = await cloudinary.uploader.upload(req.file.path, {
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

    // 3. Sanitize inputs
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDetails = sanitizeHtml(details);
    const sanitizedSteps = reproduce_steps ? sanitizeHtml(reproduce_steps) : '';

    try {
        // 4. Create and save feedback
        const feedback = new FEEDBACK({
            user_id,
            title: sanitizedTitle,
            details: sanitizedDetails,
            category,
            reproduce_steps: sanitizedSteps,
            attachment_url,
            attachment_public_id,
        });

        const savedFeedback = await feedback.save();

        return sendResponse(res, 201, 'Feedback submitted successfully', {
            feedback: savedFeedback,
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
};

export default submitFeedback;
