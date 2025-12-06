import multer from "multer";

// -------------------- VIDEO STORAGE --------------------
// Store uploaded videos on disk inside 'uploads/videos'
// Filename format: <timestamp>-<originalname>
const videoStorage = multer.diskStorage({
  destination: "uploads/videos",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// -------------------- IMAGE STORAGE --------------------
// Store uploaded images (like thumbnails) in memory
const imageStorage = multer.memoryStorage();

// -------------------- CUSTOM STORAGE --------------------
// Handles both video and thumbnail uploads using respective storage
class CustomStorage {
  // Handle file upload
  _handleFile(req, file, cb) {
    if (file.fieldname === "video") {
      videoStorage._handleFile(req, file, cb); // Save video on disk
    } else if (file.fieldname === "thumbnail") {
      imageStorage._handleFile(req, file, cb); // Save thumbnail in memory
    } else {
      cb(new Error("Unexpected field"));
    }
  }

  // Remove file (cleanup)
  _removeFile(req, file, cb) {
    if (file.fieldname === "video") {
      videoStorage._removeFile(req, file, cb);
    } else if (file.fieldname === "thumbnail") {
      imageStorage._removeFile(req, file, cb);
    } else {
      cb(null);
    }
  }
}

// -------------------- UPLOAD VIDEO & THUMBNAIL --------------------
// Middleware to handle video and thumbnail uploads
export const uploadVideoFiles = multer({
  storage: new CustomStorage(), // Use custom storage for different fields
  limits: { fileSize: 500 * 1024 * 1024 }, // Max 500 MB per file
  fileFilter(req, file, cb) {
    // Validate file type: video for 'video', image for 'thumbnail'
    if (
      (file.fieldname === "video" && file.mimetype.startsWith("video/")) ||
      (file.fieldname === "thumbnail" && file.mimetype.startsWith("image/"))
    ) {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Invalid file type"), false); // Reject invalid files
    }
  }
})
.fields([
  { name: "video", maxCount: 1 },      // Only 1 video file allowed
  { name: "thumbnail", maxCount: 1 }   // Only 1 thumbnail allowed
]);