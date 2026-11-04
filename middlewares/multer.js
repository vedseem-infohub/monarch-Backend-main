import multer from "multer";
import fs from "fs";

// Ensure ./public exists for disk storage if needed
if (!fs.existsSync("./public")) {
  try {
    fs.mkdirSync("./public", { recursive: true });
  } catch (err) {
    // ignore
  }
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

export const diskUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

export default memoryUpload;
