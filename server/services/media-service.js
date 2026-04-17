const { v2: cloudinary } = require('cloudinary');
const { env } = require('../config/env');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true
});

async function uploadImage(file) {
  if (!file?.buffer) {
    throw new Error('No image buffer was provided.');
  }

  const base64 = file.buffer.toString('base64');
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: env.cloudinary.folder,
    resource_type: 'image'
  });

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
}

async function deleteImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

module.exports = {
  deleteImage,
  uploadImage
};
