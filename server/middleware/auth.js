const { env } = require('../config/env');
const { verifyAdminToken } = require('../utils/auth');

function getAdminSession(req) {
  const token = req.cookies?.[env.adminCookieName];
  const session = token ? verifyAdminToken(token) : null;
  return session && session.role === 'admin' ? session : null;
}

function requireAdmin(req, res, next) {
  const session = getAdminSession(req);
  if (!session) {
    return res.redirect('/admin');
  }

  req.adminSession = session;
  return next();
}

module.exports = {
  getAdminSession,
  requireAdmin
};
