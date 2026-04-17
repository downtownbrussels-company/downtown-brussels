const { escapeHtml } = require('../utils/content');
const { formatDateOnly } = require('../utils/format');
const { getImageSource } = require('../utils/files');
const { renderLayout } = require('./layout');

function renderBlogHeader({ backHref = '/', backLabel = 'Back to Home' }) {
  return `
    <header class="blog-topbar">
      <div class="blog-topbar__line"></div>
      <div class="blog-topbar__inner">
        <a class="blog-brand" href="/">
          <img src="/images/logo.png" alt="DownTown Brussels logo">
          <span>DownTown Brussels</span>
        </a>
        <a class="blog-back-link" href="${backHref}">${escapeHtml(backLabel)}</a>
      </div>
    </header>
  `;
}

function renderBlogListPage(posts) {
  const cards = posts.length
    ? posts.map((post) => `
        <article class="blog-card glass-card">
          <a class="blog-card__media" href="/blog/${encodeURIComponent(post.slug)}">
            <img src="${escapeHtml(getImageSource(post.cover_image))}" alt="${escapeHtml(post.cover_image_alt)}" loading="lazy">
          </a>
          <div class="blog-card__body">
            <div class="blog-card__meta">
              <span>${escapeHtml(formatDateOnly(post.published_at || post.created_at))}</span>
            </div>
            <h2 class="blog-card__title">
              <a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
            </h2>
            <a class="blog-card__link" href="/blog/${encodeURIComponent(post.slug)}">Read article</a>
          </div>
        </article>
      `).join('')
    : `
      <div class="blog-empty glass-card">
        <h2>No published posts yet</h2>
        <p>The blog is set up and ready. Publish your first article from the admin panel.</p>
      </div>
    `;

  return renderLayout({
    title: 'Blog | DownTown Brussels',
    metaDescription: 'Read the latest DownTown Brussels blog posts, beer picks, and event updates.',
    canonicalPath: '/blog',
    bodyClass: 'blog-page',
    extraStyles: ['/blog/blog.css'],
    content: `
      ${renderBlogHeader({
        backHref: '/',
        backLabel: 'Back to Home'
      })}
      <main class="blog-shell">
        <section class="blog-listing">
          <div class="blog-listing__header">
            <h2>Blog Posts</h2>
          </div>
          <div class="blog-grid">
            ${cards}
          </div>
        </section>
      </main>
    `
  });
}

function renderBlogDetailPage(post) {
  return renderLayout({
    title: post.meta_title,
    metaDescription: post.meta_description,
    canonicalPath: `/blog/${post.slug}`,
    bodyClass: 'blog-page blog-page--detail',
    extraStyles: ['/blog/blog.css'],
    ogImage: getImageSource(post.cover_image),
    content: `
      ${renderBlogHeader({
        backHref: '/blog',
        backLabel: 'Back to Blog'
      })}
      <main class="blog-shell">
        <article class="blog-post glass-card">
          <div class="blog-post__hero">
            <img src="${escapeHtml(getImageSource(post.cover_image))}" alt="${escapeHtml(post.cover_image_alt)}">
          </div>
          <div class="blog-post__body">
            <div class="blog-post__meta">
              <span>${escapeHtml(formatDateOnly(post.published_at || post.created_at))}</span>
            </div>
            <h1 class="blog-post__title">${escapeHtml(post.title)}</h1>
            <div class="blog-post__content">
              ${post.content}
            </div>
          </div>
        </article>
      </main>
    `
  });
}

function renderNotFoundPage() {
  return renderLayout({
    title: 'Page Not Found | DownTown Brussels',
    metaDescription: 'The page you requested could not be found.',
    canonicalPath: '/404',
    bodyClass: 'blog-page',
    extraStyles: ['/blog/blog.css'],
    content: `
      ${renderBlogHeader({
        backHref: '/',
        backLabel: 'Back to Home'
      })}
      <main class="blog-shell">
        <section class="blog-empty glass-card">
          <h2>Not found</h2>
          <p>The page you requested could not be found.</p>
          <a class="blog-card__link" href="/blog">Visit the blog</a>
        </section>
      </main>
    `
  });
}

module.exports = {
  renderBlogDetailPage,
  renderBlogListPage,
  renderNotFoundPage
};
