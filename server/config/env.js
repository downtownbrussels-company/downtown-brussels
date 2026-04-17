const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

function getNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDurationToMs(value, fallback) {
  const match = String(value || '').trim().match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) return fallback;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
}

const env = {
  port: getNumber(process.env.PORT, 3000),
  siteUrl: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, ''),
  jwtSecret: process.env.JWT_SECRET || '',
  adminUsername: process.env.ADMIN_USERNAME || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminCookieName: process.env.ADMIN_COOKIE_NAME || 'downtown_admin',
  adminTokenTtl: process.env.ADMIN_TOKEN_TTL || '8h',
  adminTokenMaxAgeMs: parseDurationToMs(process.env.ADMIN_TOKEN_TTL || '8h', 8 * 60 * 60 * 1000),
  uploadMaxFileSizeBytes: getNumber(process.env.UPLOAD_MAX_FILE_SIZE_MB, 4) * 1024 * 1024,
  mongoUri: process.env.MONGODB_URI || '',
  mongoDbName: process.env.MONGODB_DB_NAME || 'downtown',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'downtown-blog'
  },
  reservation: {
    web3formsKey: process.env.RESERVATION_WEB3FORMS_KEY || '',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    restaurantEmail: process.env.RESTAURANT_EMAIL || 'downtownbrussels@gmail.com'
  },
  paths: {
    root: process.cwd(),
    publicDir: path.join(process.cwd(), 'public'),
    uploadsDir: path.join(process.cwd(), 'uploads'),
    blogUploadsDir: path.join(process.cwd(), 'uploads', 'blog')
  }
};

function validateEnv() {
  const missing = [];

  if (!env.jwtSecret) missing.push('JWT_SECRET');
  if (!env.adminUsername) missing.push('ADMIN_USERNAME');
  if (!env.adminPassword) missing.push('ADMIN_PASSWORD');
  if (!env.mongoUri) missing.push('MONGODB_URI');
  if (!env.cloudinary.cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!env.cloudinary.apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!env.cloudinary.apiSecret) missing.push('CLOUDINARY_API_SECRET');

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = {
  env,
  validateEnv
};
