import uploadOnCloudinary from "../config/cloudinary.js";

// POST /api/upload
export const uploadSingleImage = async (req, res) => {
  try {
    let secureUrl = null;

    if (req.file) {
      secureUrl = await uploadOnCloudinary(
        req.file.buffer || req.file.path,
        req.file.mimetype,
        "monarch"
      );
    } else if (req.body?.image) {
      secureUrl = await uploadOnCloudinary(req.body.image, "image/jpeg", "monarch");
    }

    if (!secureUrl) {
      return res.status(400).json({
        success: false,
        message: "No image file or image data provided",
      });
    }

    return res.status(200).json({
      success: true,
      url: secureUrl,
      message: "Image uploaded to Cloudinary successfully",
    });
  } catch (error) {
    console.error("uploadSingleImage error:", error);
    return res.status(500).json({
      success: false,
      message: "Cloudinary upload failed: " + error.message,
    });
  }
};

// POST /api/upload/multiple
export const uploadMultipleImages = async (req, res) => {
  try {
    const urls = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadOnCloudinary(
          file.buffer || file.path,
          file.mimetype,
          "monarch"
        );
        if (url) urls.push(url);
      }
    } else if (Array.isArray(req.body?.images)) {
      for (const img of req.body.images) {
        const url = await uploadOnCloudinary(img, "image/jpeg", "monarch");
        if (url) urls.push(url);
      }
    }

    if (urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided for upload",
      });
    }

    return res.status(200).json({
      success: true,
      urls,
      count: urls.length,
      message: `${urls.length} image(s) uploaded to Cloudinary successfully`,
    });
  } catch (error) {
    console.error("uploadMultipleImages error:", error);
    return res.status(500).json({
      success: false,
      message: "Multiple Cloudinary upload failed: " + error.message,
    });
  }
};

