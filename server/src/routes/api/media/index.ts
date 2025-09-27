import express from "express";

import upload from "./middlewares/multer";
import getUploadUrl from "./controllers/get-upload-url";

const mediaRoutes = express.Router();

mediaRoutes.post("/get-upload-url", upload.single('image'), getUploadUrl);

export default mediaRoutes;
