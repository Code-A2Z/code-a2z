import cloudinary from '../config/cloudinary.js';
import { nanoid } from 'nanoid';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const media = req.file.path;
        const date = new Date();
        const uniqueFileName = `${nanoid()}-${date.getTime()}`;

        const result = await cloudinary.uploader.upload(media, {
            public_id: uniqueFileName,
            format: "jpeg",
            resource_type: "image",
        });

        return res.status(200).json({ uploadURL: result.secure_url });

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "File upload failed" });
    }
}