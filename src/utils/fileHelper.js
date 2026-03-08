const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../config/env");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(filePath, folder = "") {
  if (!filePath) throw new Error("filePath is required for cloudinary upload");

  const options = {};
  if (folder) options.folder = folder;

  const result = await cloudinary.uploader.upload(filePath, options);

  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("failed to delete temp file", err);
  }

  return result;
}

async function deleteFromCloudinary(publicIdOrUrl) {
  if (!publicIdOrUrl) return;
  let publicId = publicIdOrUrl;
  try {
    const url = new URL(publicIdOrUrl);
    const parts = url.pathname.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex >= 0) {
      let idParts = parts.slice(uploadIndex + 1);
      if (idParts[0] && /^v\d+$/.test(idParts[0])) {
        idParts.shift();
      }
      publicId = idParts.join("/");
      publicId = publicId.replace(path.extname(publicId), "");
    }
  } catch {}


  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    console.warn("failed to delete cloudinary asset", err);
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};