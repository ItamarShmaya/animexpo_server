import cloudinary from "cloudinary";
import streamifier from "streamifier";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./env_var.js";

const defualtAvatarPublicId = "defualtAvatar_lmkkak";

const cloudinaryConfig = (req, res, next) => {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  next();
};

const uploadImage = (folderName, username, buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
      { folder: folderName, public_id: `${username}_avatar` },
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

const deleteImage = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(image, function (result) {
      if (result.error) {
        reject(result);
      }
      resolve(result);
    });
  });
};
export { cloudinaryConfig, uploadImage, deleteImage, defualtAvatarPublicId };
