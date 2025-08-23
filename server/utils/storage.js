const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const {cloud} = require("../config/keys");

// configure cloudinary
cloudinary.config({
  cloud_name: cloud.cloudName,
  api_key: cloud.accessKeyId,
  api_secret: cloud.secretAccessKey,
});

exports.cloudinaryUpload = async (image) => {
  try {
    let imageUrl = "";
    let imageId = "";

    if (!cloud.accessKeyId) {
      console.warn("Missing Cloudinary keys");
    }

    if (image) {
      const result = await new Promise((resolve, reject) => {
        streamifier.createReadStream(image.buffer).pipe(
          cloudinary.uploader.upload_stream(
            { folder: "uploads", resource_type: "auto" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
        );
      });

      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

    return { imageUrl, imageId };
  } catch (error) {
    console.log("error cloudinary", error);
    return { imageUrl: "", imageId: "" };
  }
};
