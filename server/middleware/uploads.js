const multer = require('multer');
const { env } = require('../config/env');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.uploadMaxFileSizeBytes
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'));
    }

    return callback(null, true);
  }
});

module.exports = {
  upload
};
