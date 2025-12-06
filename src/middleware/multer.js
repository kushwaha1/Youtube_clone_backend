import multer from "multer";

// Multer middleware for handling image uploads
export const uploadImage = multer({
  // Store files in memory as buffer (not on disk)
  storage: multer.memoryStorage(),

  // Limit file size to 10 MB
  limits: { fileSize: 10 * 1024 * 1024 },

  // Accept only image files
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images allowed"), false); // Reject non-image files
    } else {
      cb(null, true); // Accept file
    }
  }
});