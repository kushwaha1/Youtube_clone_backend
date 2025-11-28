import cloudinary from "../config/cloudinary.js";


const uploadToCloudinary = (fileBuffer, folder = "avatars") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

export default uploadToCloudinary;