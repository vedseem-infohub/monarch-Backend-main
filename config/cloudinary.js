import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dirkawqb8",
    api_key: process.env.CLOUDINARY_API_KEY || "382522882222572",
    api_secret: process.env.CLOUDINARY_API_SECRET || "JxBmIIsrGMmMj_cih3-iNDsFCzg",
  });
  return cloudinary;
};

const uploadOnCloudinary = async (filePathOrBase64OrBuffer, mimeType = "image/jpeg", folder = "monarch") => {
  configureCloudinary();

  try {
    if (!filePathOrBase64OrBuffer) return null;

    let uploadTarget = filePathOrBase64OrBuffer;

    // If target is a Buffer (from memoryStorage multer)
    if (Buffer.isBuffer(filePathOrBase64OrBuffer)) {
      uploadTarget = `data:${mimeType};base64,${filePathOrBase64OrBuffer.toString("base64")}`;
    }

    const uploadResult = await cloudinary.uploader.upload(uploadTarget, {
      folder,
      resource_type: "auto",
    });

    // Clean up temporary local file if it exists
    if (typeof filePathOrBase64OrBuffer === "string" && fs.existsSync(filePathOrBase64OrBuffer)) {
      try {
        fs.unlinkSync(filePathOrBase64OrBuffer);
      } catch (err) {
        // ignore
      }
    }

    return uploadResult.secure_url;
  } catch (error) {
    if (typeof filePathOrBase64OrBuffer === "string" && fs.existsSync(filePathOrBase64OrBuffer)) {
      try {
        fs.unlinkSync(filePathOrBase64OrBuffer);
      } catch (err) {
        // ignore
      }
    }
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};

export default uploadOnCloudinary;
