const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer and upload buffer to Cloudinary manually
const storage = multer.memoryStorage();
const parser = multer({ storage });

const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const passthrough = cloudinary.uploader.upload_stream({ folder: 'agrolink_products', public_id: filename }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    passthrough.end(buffer);
  });
};

module.exports = { parser, cloudinary, uploadBufferToCloudinary };
