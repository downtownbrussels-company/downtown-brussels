const { ObjectId } = require('mongodb');
const { getBlogCollection } = require('../database/db');
const { normalizeContent, stripToPlainText } = require('../utils/content');
const { getImageSource } = require('../utils/files');
const { isValidSlug, slugify } = require('../utils/slug');

function normalizeId(document) {
  if (!document) return null;

  return {
    ...document,
    id: String(document._id),
    _id: undefined
  };
}

function normalizeCoverImagePath(rawValue = '') {
  const trimmed = stripToPlainText(rawValue);
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalized = getImageSource(trimmed);
  return /^\/[a-zA-Z0-9/_\-.]+$/.test(normalized) ? normalized : '';
}

async function findSlugOwner(slug) {
  const collection = await getBlogCollection();
  return collection.findOne(
    { slug },
    { projection: { _id: 1, slug: 1 } }
  );
}

async function buildPostPayload(body, uploadResult, existingPost) {
  const errors = {};
  const title = stripToPlainText(body.title).slice(0, 160);
  const slugInput = stripToPlainText(body.slug || title);
  const slug = slugify(slugInput);
  const content = normalizeContent(body.content);
  const contentText = stripToPlainText(content).slice(0, 320);
  const metaTitle = stripToPlainText(body.meta_title || title).slice(0, 160);
  const metaDescription = stripToPlainText(body.meta_description || contentText || title).slice(0, 320);
  const coverImageAlt = stripToPlainText(body.cover_image_alt).slice(0, 220);
  const assignedCoverImage = normalizeCoverImagePath(body.cover_image_url);
  const coverImage = uploadResult?.url || assignedCoverImage || existingPost?.cover_image || '';
  const coverImagePublicId = uploadResult?.publicId
    || (assignedCoverImage ? '' : (existingPost?.cover_image_public_id || ''));
  const status = body.status === 'published' ? 'published' : 'draft';

  if (!title) errors.title = 'Title is required.';
  if (!slug) {
    errors.slug = 'Slug is required.';
  } else if (!isValidSlug(slug)) {
    errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.';
  }
  if (!coverImage) errors.cover_image = 'A cover image upload or URL/path is required.';
  if (!coverImageAlt) errors.cover_image_alt = 'Cover image alt text is required.';
  if (!content) errors.content = 'Content is required.';
  if (!metaTitle) errors.meta_title = 'Meta title is required.';
  if (!metaDescription) errors.meta_description = 'Meta description is required.';
  if (body.cover_image_url && !assignedCoverImage && !uploadResult) {
    errors.cover_image = 'Cover image path must be an absolute URL or a local path such as /images/example.jpg.';
  }

  const slugOwner = slug ? await findSlugOwner(slug) : null;
  if (slugOwner && String(slugOwner._id) !== String(existingPost?._id || existingPost?.id || '')) {
    errors.slug = 'This slug is already in use.';
  }

  const now = new Date().toISOString();
  const publishedAt = status === 'published'
    ? (existingPost?.published_at || now)
    : null;

  return {
    errors,
    values: {
      title,
      slug,
      cover_image: coverImage,
      cover_image_public_id: coverImagePublicId,
      cover_image_alt: coverImageAlt,
      content,
      meta_title: metaTitle,
      meta_description: metaDescription,
      status,
      created_at: existingPost?.created_at || now,
      updated_at: now,
      published_at: publishedAt
    }
  };
}

async function listPublishedPosts() {
  const collection = await getBlogCollection();
  const posts = await collection
    .find({ status: 'published' })
    .sort({ published_at: -1, created_at: -1, _id: -1 })
    .toArray();

  return posts.map(normalizeId);
}

async function listAdminPosts() {
  const collection = await getBlogCollection();
  const posts = await collection
    .find({})
    .sort({ updated_at: -1, _id: -1 })
    .toArray();

  return posts.map(normalizeId);
}

async function getPublishedPostBySlug(slug) {
  const collection = await getBlogCollection();
  const post = await collection.findOne({ slug, status: 'published' });
  return normalizeId(post);
}

async function getPostById(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getBlogCollection();
  const post = await collection.findOne({ _id: new ObjectId(id) });
  return normalizeId(post);
}

async function createPost(payload) {
  const collection = await getBlogCollection();
  const result = await collection.insertOne(payload);
  return getPostById(result.insertedId.toString());
}

async function updatePost(id, payload) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getBlogCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: payload }
  );

  return getPostById(id);
}

async function deletePost(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getBlogCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
}

async function togglePostStatus(id) {
  const post = await getPostById(id);
  if (!post) return null;

  const nextStatus = post.status === 'published' ? 'draft' : 'published';
  const updatedAt = new Date().toISOString();
  const publishedAt = nextStatus === 'published'
    ? (post.published_at || updatedAt)
    : null;

  const collection = await getBlogCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: nextStatus,
        updated_at: updatedAt,
        published_at: publishedAt
      }
    }
  );

  return getPostById(id);
}

module.exports = {
  buildPostPayload,
  createPost,
  deletePost,
  getPostById,
  getPublishedPostBySlug,
  listAdminPosts,
  listPublishedPosts,
  togglePostStatus,
  updatePost
};
