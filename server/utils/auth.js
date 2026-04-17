const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createAdminToken() {
  return jwt.sign({ role: 'admin' }, env.jwtSecret, {
    expiresIn: env.adminTokenTtl
  });
}

function verifyAdminToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

module.exports = {
  safeCompare,
  createAdminToken,
  verifyAdminToken
};
