import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { sendResponse } from '../utils/response.js';
import cloudinary from '../config/cloudinary.js';

export const getUploadUrl = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.file) {
      return sendResponse(res, "error", "No file uploaded", null, 400);
    }

    const media = req.file.path;
    const date = new Date();
    const uniqueFileName = `${nanoid()}-${date.getTime()}`;

    const result = await cloudinary.uploader.upload(media, {
      public_id: uniqueFileName,
      format: "jpeg",
      resource_type: "image",
    });

    return sendResponse(res, "success", "File uploaded successfully", { uploadURL: result.secure_url }, 200);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return sendResponse(res, "error", "File upload failed", null, 500);
  }
};
