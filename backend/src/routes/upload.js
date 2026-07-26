import { Router } from "express";
import { upload, deleteImage, uploadImageByUrl } from "../utils/cloudinary.js";
import { requireAuth } from "../utils/auth.js";

const r = Router();

// Upload single image (profile or product)
r.post("/image", requireAuth(), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageData = {
      publicId: req.file.filename, // multer-storage-cloudinary
      url: req.file.path,          // secure URL
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
      size: req.file.size
    };

    res.json({
      success: true,
      image: imageData,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ 
      message: "Failed to upload image",
      error: error.message 
    });
  }
});

// Upload multiple images (for products)
r.post("/images", requireAuth(), upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    const imagesData = req.files.map(file => ({
      publicId: file.filename,
      url: file.path,
      width: file.width,
      height: file.height,
      format: file.format,
      size: file.size
    }));

    res.json({
      success: true,
      images: imagesData,
      message: `${imagesData.length} images uploaded successfully`
    });
  } catch (error) {
    console.error("Images upload error:", error);
    res.status(500).json({ 
      message: "Failed to upload images",
      error: error.message 
    });
  }
});

// Upload images by remote URLs
r.post("/images/by-url", requireAuth(), async (req, res) => {
  try {
    const { urls } = req.body || {};
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: "No image URLs provided" });
    }
    if (urls.length > 10) {
      return res.status(400).json({ message: "Cannot upload more than 10 image URLs at once" });
    }
    const valid = urls.filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));
    if (valid.length === 0) {
      return res.status(400).json({ message: "Invalid image URLs" });
    }
    const uploads = await Promise.all(valid.map((u) => uploadImageByUrl(u)));
    res.json({ success: true, images: uploads, message: `${uploads.length} images uploaded by URL` });
  } catch (error) {
    console.error("Images by URL upload error:", error);
    res.status(500).json({ message: "Failed to upload images by URL", error: error.message });
  }
});

// Delete image
r.delete("/image/:publicId", requireAuth(), async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    const result = await deleteImage(publicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: "Image deleted successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found or already deleted"
      });
    }
  } catch (error) {
    console.error("Image deletion error:", error);
    res.status(500).json({ 
      message: "Failed to delete image",
      error: error.message 
    });
  }
});

export default r;
