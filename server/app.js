const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const reservationRoutes = require('./routes/reservation');
const { env } = require('./config/env');
const { renderNotFoundPage } = require('./views/blog');

const app = express();

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(publicRoutes);
app.use(reservationRoutes);
app.use(adminRoutes);

app.use(express.static(env.paths.publicDir, { index: false }));

app.use((req, res) => {
  res.status(404).send(renderNotFoundPage(req.originalUrl));
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.message && error.message.includes('Only JPG, PNG, WEBP, and GIF images are allowed')) {
    return res.status(400).send(error.message);
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).send('Uploaded image is too large.');
  }

  return res.status(500).send('Internal Server Error');
});

module.exports = app;
