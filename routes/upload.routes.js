import express from "express";
import { memoryUpload } from "../middlewares/multer.js";
import {
  uploadSingleImage,
  uploadMultipleImages,
} from "../controllers/upload.controllers.js";

const router = express.Router();

// Allow field names 'file', 'image', or any field name for single upload
const singleUploadMiddleware = (req, res, next) => {
  memoryUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        req.file = req.files.file[0];
      } else if (req.files.image && req.files.image[0]) {
        req.file = req.files.image[0];
      }
    }
    next();
  });
};

// Allow field names 'files' or 'images' for multiple uploads
const multipleUploadMiddleware = (req, res, next) => {
  memoryUpload.fields([
    { name: "files", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.files) {
      const combined = [
        ...(req.files.files || []),
        ...(req.files.images || []),
      ];
      if (combined.length > 0) {
        req.files = combined;
      }
    }
    next();
  });
};

router.post("/", singleUploadMiddleware, uploadSingleImage);
router.post("/single", singleUploadMiddleware, uploadSingleImage);
router.post("/multiple", multipleUploadMiddleware, uploadMultipleImages);

export default router;

