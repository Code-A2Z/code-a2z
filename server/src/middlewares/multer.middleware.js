import multer from 'multer';

const multerStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now());
  },
});

const multerUpload = multer({ storage: multerStorage });

export default multerUpload;
