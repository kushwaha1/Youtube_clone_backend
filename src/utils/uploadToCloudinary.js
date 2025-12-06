import cloudinary from "../config/cloudinary.js";

// Upload file buffer to Cloudinary
// folder → optional folder name (default: "avatars")
// Returns a Promise that resolves with the upload result
export const uploadToCloudinary = (fileBuffer, folder = "avatars") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" }, // Upload as image to specified folder
      (error, result) => {
        if (error) reject(error); // Reject promise if upload fails
        else resolve(result);     // Resolve promise with upload result
      }
    ).end(fileBuffer); // End the stream by sending the file buffer
  });
};