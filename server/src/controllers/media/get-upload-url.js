import { nanoid } from 'nanoid';

import { sendResponse } from '../../utils/response.js';
import cloudinary from '../../config/cloudinary.js';

const getUploadUrl = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, 'error', 'No file uploaded', null);
    }

    const media = req.file.path;
    const date = new Date();
    const uniqueFileName = `${nanoid()}-${date.getTime()}`;

    const result = await cloudinary.uploader.upload(media, {
      public_id: uniqueFileName,
      format: 'jpeg',
      resource_type: 'image',
    });

    return sendResponse(res, 200, 'success', 'File uploaded successfully', {
      uploadURL: result.secure_url,
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      error.message || 'File upload failed',
      null
    );
  }
};

export default getUploadUrl;
