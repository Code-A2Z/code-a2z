import express from 'express';

import upload from '../../middlewares/multer.middleware.js';

import getUploadUrl from '../../controllers/media/get-upload-url.js';

const mediaRoutes = express.Router();

mediaRoutes.post('/get-upload-url', upload.single('image'), getUploadUrl);

export default mediaRoutes;
