const path = require('path');
const express = require('express');
const { env } = require('../config/env');
const { listPublishedPosts, getPublishedPostBySlug } = require('../services/blog-service');
const { renderBlogDetailPage, renderBlogListPage } = require('../views/blog');

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function resolveBaseUrl(req) {
  const configuredBaseUrl = (env.siteUrl || '').replace(/\/+$/, '');
  const isLocalConfigured = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredBaseUrl);

  if (configuredBaseUrl && !isLocalConfigured) {
    return configuredBaseUrl;
  }

  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const protocol = forwardedProto || req.protocol || 'https';
  const host = req.get('x-forwarded-host') || req.get('host') || '';

  return host ? `${protocol}://${host}`.replace(/\/+$/, '') : configuredBaseUrl;
}

function buildAbsoluteUrl(req, pathname = '/') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${resolveBaseUrl(req)}${normalized}`;
}

function toIsoDate(value) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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

router.get('/sitemap.xml', asyncHandler(async (req, res) => {
  const posts = await listPublishedPosts();
  const latestPostDate = posts.length
    ? posts[0].updated_at || posts[0].published_at || posts[0].created_at
    : null;

  const staticEntries = [
    {
      loc: buildAbsoluteUrl(req, '/'),
      lastmod: toIsoDate(latestPostDate || Date.now()),
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: buildAbsoluteUrl(req, '/blog'),
      lastmod: toIsoDate(latestPostDate || Date.now()),
      changefreq: 'daily',
      priority: '0.9'
    }
  ];

  const postEntries = posts.map((post) => ({
    loc: buildAbsoluteUrl(req, `/blog/${encodeURIComponent(post.slug)}`),
    lastmod: toIsoDate(post.updated_at || post.published_at || post.created_at),
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const allEntries = [...staticEntries, ...postEntries];
  const urlset = allEntries.map((entry) => `
  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}
</urlset>`;

  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
}));

router.get('/robots.txt', (req, res) => {
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    `Sitemap: ${buildAbsoluteUrl(req, '/sitemap.xml')}`
  ].join('\n');

  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

module.exports = router;
