const express = require('express');
const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');
const { requireAdmin, getAdminSession } = require('../middleware/auth');
const { upload } = require('../middleware/uploads');
const { createAdminToken, safeCompare } = require('../utils/auth');
const { uploadImage, deleteImage } = require('../services/media-service');
const {
  buildPostPayload,
  createPost,
  deletePost,
  getPostById,
  listAdminPosts,
  togglePostStatus,
  updatePost
} = require('../services/blog-service');
const {
  renderAdminLoginPage,
  renderDashboardPage,
  renderEditorPage
} = require('../views/admin');

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again later.'
});

function getAlertFromQuery(req) {
  return {
    message: typeof req.query.message === 'string' ? req.query.message : '',
    messageTone: typeof req.query.tone === 'string' ? req.query.tone : 'success'
  };
}

function redirectWithAlert(res, location, message, tone = 'success') {
  const search = new URLSearchParams({ message, tone });
  res.redirect(303, `${location}?${search.toString()}`);
}

router.get('/admin', (req, res) => {
  if (getAdminSession(req)) {
    return res.redirect('/admin/dashboard');
  }

  return res.send(renderAdminLoginPage({
    error: typeof req.query.error === 'string' ? req.query.error : ''
  }));
});

router.post('/admin/login', loginLimiter, (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (!safeCompare(username, env.adminUsername) || !safeCompare(password, env.adminPassword)) {
    const query = new URLSearchParams({ error: 'Invalid username or password.' });
    return res.redirect(`/admin?${query.toString()}`);
  }

  const token = createAdminToken();
  res.cookie(env.adminCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: env.adminTokenMaxAgeMs,
    path: '/'
  });

  return res.redirect('/admin/dashboard');
});

router.post('/admin/logout', (_req, res) => {
  res.clearCookie(env.adminCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  res.redirect('/admin');
});

router.get('/admin/dashboard', requireAdmin, asyncHandler(async (req, res) => {
  const posts = await listAdminPosts();
  res.send(renderDashboardPage(posts, getAlertFromQuery(req)));
}));

router.get('/admin/blogs', requireAdmin, asyncHandler(async (req, res) => {
  const search = new URLSearchParams();
  if (typeof req.query.message === 'string' && req.query.message) {
    search.set('message', req.query.message);
  }
  if (typeof req.query.tone === 'string' && req.query.tone) {
    search.set('tone', req.query.tone);
  }

  const suffix = search.toString();
  res.redirect(303, suffix ? `/admin/dashboard?${suffix}` : '/admin/dashboard');
}));

router.get('/admin/blogs/new', requireAdmin, (_req, res) => {
  res.send(renderEditorPage({
    heading: 'Create Blog Post',
    intro: 'Write a new post, upload a cover image, and choose whether to publish immediately or keep it as a draft.',
    formAction: '/admin/blogs',
    submitLabel: 'Create Post',
    post: { status: 'draft' }
  }));
});

router.post('/admin/blogs', requireAdmin, upload.single('cover_image_file'), asyncHandler(async (req, res) => {
  const uploadResult = req.file ? await uploadImage(req.file) : null;
  const { errors, values } = await buildPostPayload(req.body, uploadResult, null);

  if (Object.keys(errors).length) {
    if (uploadResult?.publicId) {
      await deleteImage(uploadResult.publicId);
    }

    return res.status(400).send(renderEditorPage({
      heading: 'Create Blog Post',
      intro: 'Write a new post, upload a cover image, and choose whether to publish immediately or keep it as a draft.',
      formAction: '/admin/blogs',
      submitLabel: 'Create Post',
      post: {
        ...req.body,
        cover_image: uploadResult?.url || req.body.cover_image_url || '',
        cover_image_public_id: uploadResult?.publicId || ''
      },
      errors,
      message: 'Please fix the highlighted fields and submit the form again.'
    }));
  }

  await createPost(values);
  return redirectWithAlert(res, '/admin/dashboard', 'Post created successfully.');
}));

router.get('/admin/blogs/:id/edit', requireAdmin, asyncHandler(async (req, res, next) => {
  const post = await getPostById(String(req.params.id));
  if (!post) return next();

  return res.send(renderEditorPage({
    heading: 'Edit Blog Post',
    intro: 'Update the article content, SEO metadata, status, and cover image without leaving the existing site structure.',
    formAction: `/admin/blogs/${post.id}`,
    submitLabel: 'Save Changes',
    post
  }));
}));

router.post('/admin/blogs/:id', requireAdmin, upload.single('cover_image_file'), asyncHandler(async (req, res, next) => {
  const existingPost = await getPostById(String(req.params.id));
  if (!existingPost) {
    return next();
  }

  const uploadResult = req.file ? await uploadImage(req.file) : null;
  const { errors, values } = await buildPostPayload(req.body, uploadResult, existingPost);
  if (Object.keys(errors).length) {
    if (uploadResult?.publicId) {
      await deleteImage(uploadResult.publicId);
    }

    return res.status(400).send(renderEditorPage({
      heading: 'Edit Blog Post',
      intro: 'Update the article content, SEO metadata, status, and cover image without leaving the existing site structure.',
      formAction: `/admin/blogs/${existingPost.id}`,
      submitLabel: 'Save Changes',
      post: {
        ...existingPost,
        ...req.body,
        cover_image: uploadResult?.url || req.body.cover_image_url || existingPost.cover_image,
        cover_image_public_id: uploadResult?.publicId || existingPost.cover_image_public_id || ''
      },
      errors,
      message: 'Please fix the highlighted fields and submit the form again.'
    }));
  }

  await updatePost(existingPost.id, values);
  if (existingPost.cover_image_public_id && existingPost.cover_image_public_id !== values.cover_image_public_id) {
    await deleteImage(existingPost.cover_image_public_id);
  }

  return redirectWithAlert(res, '/admin/dashboard', 'Post updated successfully.');
}));

router.post('/admin/blogs/:id/delete', requireAdmin, asyncHandler(async (req, res, next) => {
  const post = await getPostById(String(req.params.id));
  if (!post) return next();

  await deletePost(post.id);
  if (post.cover_image_public_id) {
    await deleteImage(post.cover_image_public_id);
  }
  return redirectWithAlert(res, '/admin/dashboard', 'Post deleted successfully.');
}));

router.post('/admin/blogs/:id/publish-toggle', requireAdmin, asyncHandler(async (req, res, next) => {
  const post = await togglePostStatus(String(req.params.id));
  if (!post) return next();

  const message = post.status === 'published'
    ? 'Post published successfully.'
    : 'Post moved back to draft.';

  return redirectWithAlert(res, '/admin/dashboard', message);
}));

module.exports = router;
