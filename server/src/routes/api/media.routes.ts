import express from "express";
import upload from "../../middlewares/multer.middleware";
import {
  getUploadUrl,
} from "../../controllers/media.controller";

const mediaRoutes = express.Router();

mediaRoutes.post("/get-upload-url", upload.single('image'), getUploadUrl);

export default mediaRoutes;
