/**
 * POST /api/media/upload - Upload an image file
 * @returns {Object} Uploaded file URL
 */

import { nanoid } from 'nanoid';
import { sendResponse } from '../../utils/response.js';
import cloudinary from '../../config/cloudinary.js';

const uploadImage = async (req, res) => {
  if (!req.file) {
    return sendResponse(res, 400, 'No file uploaded');
  }
  const date = new Date();
  const uniqueFileName = `${nanoid()}-${date.getTime()}`;

  try {
    const media = req.file.path;
    const result = await cloudinary.uploader.upload(media, {
      public_id: uniqueFileName,
      format: 'jpeg',
      resource_type: 'image',
    });

    return sendResponse(res, 200, 'File uploaded successfully', {
      upload_url: result.secure_url,
    });
  } catch (error) {
    return sendResponse(res, 500, error.message || 'File upload failed');
  }
};

export default uploadImage;
