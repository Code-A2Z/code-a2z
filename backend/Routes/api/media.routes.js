import express from "express";
import upload from "../../Middlewares/multer.middleware.js";
import { uploadImage } from "../../Controllers/media.controller.js";

const mediaRoutes = express.Router();

mediaRoutes.post("/image", upload.single('image'), uploadImage);

export default mediaRoutes;
