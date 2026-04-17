const path = require('path');
const express = require('express');
const { env } = require('../config/env');
const { listPublishedPosts, getPublishedPostBySlug } = require('../services/blog-service');
const { renderBlogDetailPage, renderBlogListPage } = require('../views/blog');

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

router.get('/', (_req, res) => {
  res.sendFile(path.join(env.paths.publicDir, 'index.html'));
});

router.get('/blog', asyncHandler(async (_req, res) => {
  const posts = await listPublishedPosts();
  res.send(renderBlogListPage(posts));
}));

router.get('/blog/:slug', asyncHandler(async (req, res, next) => {
  const post = await getPublishedPostBySlug(req.params.slug);
  if (!post) {
    return next();
  }

  return res.send(renderBlogDetailPage(post));
}));

module.exports = router;
