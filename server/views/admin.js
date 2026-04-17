const { escapeHtml } = require('../utils/content');
const { formatDateTime } = require('../utils/format');
const { getImageSource } = require('../utils/files');
const { renderLayout } = require('./layout');

function renderMessage(message, tone = 'info') {
  if (!message) return '';
  return `<div class="admin-alert admin-alert--${tone}">${escapeHtml(message)}</div>`;
}

function renderAdminShell({ title, intro, actions = '', content, message = '', messageTone = 'info' }) {
  return renderLayout({
    title,
    metaDescription: title,
    canonicalPath: '/admin',
    bodyClass: 'admin-page',
    extraStyles: ['/admin/admin.css'],
    extraScripts: ['/admin/admin.js'],
    content: `
      <main class="admin-shell">
        <aside class="admin-sidebar glass-card">
          <a class="admin-brand" href="/admin/dashboard">
            <img src="/images/logo.png" alt="DownTown Brussels logo">
            <div>
              <strong>DownTown CMS</strong>
              <span>Blog administration</span>
            </div>
          </a>
          <nav class="admin-nav">
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/blogs">All posts</a>
            <a href="/admin/blogs/new">Create post</a>
            <a href="/blog" target="_blank" rel="noopener noreferrer">View blog</a>
          </nav>
          <form method="post" action="/admin/logout">
            <button class="admin-ghost-button" type="submit">Logout</button>
          </form>
        </aside>
        <section class="admin-panel">
          <header class="admin-panel__header glass-card">
            <div>
              <span class="section-tag">Admin</span>
              <h1>${escapeHtml(title)}</h1>
              <p>${escapeHtml(intro)}</p>
            </div>
            <div class="admin-panel__actions">
              ${actions}
            </div>
          </header>
          ${renderMessage(message, messageTone)}
          ${content}
        </section>
      </main>
    `
  });
}

function renderAdminLoginPage({ error = '' } = {}) {
  return renderLayout({
    title: 'Admin Login | DownTown Brussels',
    metaDescription: 'Admin login for the DownTown Brussels blog dashboard.',
    canonicalPath: '/admin',
    bodyClass: 'admin-page admin-page--login',
    extraStyles: ['/admin/admin.css'],
    content: `
      <main class="admin-login">
        <section class="admin-login__card glass-card">
          <a class="admin-brand admin-brand--centered" href="/">
            <img src="/images/logo.png" alt="DownTown Brussels logo">
            <div>
              <strong>DownTown CMS</strong>
              <span>Secure admin login</span>
            </div>
          </a>
          <h1>Admin Login</h1>
          <p>Sign in to manage blog posts, uploads, drafts, and SEO metadata.</p>
          ${renderMessage(error, 'error')}
          <form class="admin-form" method="post" action="/admin/login" novalidate>
            <label>
              <span>Username</span>
              <input type="text" name="username" autocomplete="username" required>
            </label>
            <label>
              <span>Password</span>
              <input type="password" name="password" autocomplete="current-password" required>
            </label>
            <button class="btn btn-primary" type="submit">Sign In</button>
          </form>
        </section>
      </main>
    `
  });
}

function renderDashboardPage(posts, { message = '', messageTone = 'success' } = {}) {
  const rows = posts.length
    ? posts.map((post) => `
        <tr>
          <td>
            <strong>${escapeHtml(post.title)}</strong>
          </td>
          <td><code>${escapeHtml(post.slug)}</code></td>
          <td><span class="admin-status admin-status--${escapeHtml(post.status)}">${escapeHtml(post.status)}</span></td>
          <td>${escapeHtml(formatDateTime(post.created_at))}</td>
          <td>${escapeHtml(formatDateTime(post.updated_at))}</td>
          <td class="admin-actions">
            <a class="admin-inline-link" href="/admin/blogs/${post.id}/edit">Edit</a>
            <form method="post" action="/admin/blogs/${post.id}/publish-toggle">
              <button type="submit">${post.status === 'published' ? 'Unpublish' : 'Publish'}</button>
            </form>
            <form method="post" action="/admin/blogs/${post.id}/delete" data-delete-form>
              <button type="submit" class="admin-danger-link">Delete</button>
            </form>
          </td>
        </tr>
      `).join('')
    : `
      <tr>
        <td colspan="6" class="admin-table__empty">No posts yet. Create your first blog post.</td>
      </tr>
    `;

  return renderAdminShell({
    title: 'Blog Dashboard',
    intro: 'Manage drafts, publish articles, and keep blog metadata in one place.',
    message,
    messageTone,
    actions: `<a class="btn btn-primary" href="/admin/blogs/new">Create New Post</a>`,
    content: `
      <section class="admin-card glass-card">
        <div class="admin-card__head">
          <h2>All blog posts</h2>
          <p>${posts.length} total post${posts.length === 1 ? '' : 's'}</p>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `
  });
}

function renderEditorPage({
  heading,
  intro,
  formAction,
  submitLabel,
  post = {},
  errors = {},
  message = ''
}) {
  const hasImage = Boolean(post.cover_image);
  const coverImageSrc = hasImage ? getImageSource(post.cover_image) : '';

  return renderAdminShell({
    title: heading,
    intro,
    message,
    messageTone: 'error',
    actions: `<a class="admin-inline-link" href="/admin/dashboard">Back to list</a>`,
    content: `
      <section class="admin-card glass-card">
        <form class="admin-form admin-form--post" method="post" action="${formAction}" enctype="multipart/form-data" novalidate>
          <div class="admin-form__grid">
            <label class="admin-form__field admin-form__field--full">
              <span>Title</span>
              <input type="text" name="title" value="${escapeHtml(post.title || '')}" required data-title-input>
              ${errors.title ? `<small class="admin-field-error">${escapeHtml(errors.title)}</small>` : ''}
            </label>

            <label class="admin-form__field">
              <span>Slug</span>
              <input type="text" name="slug" value="${escapeHtml(post.slug || '')}" required data-slug-input>
              ${errors.slug ? `<small class="admin-field-error">${escapeHtml(errors.slug)}</small>` : ''}
            </label>

            <label class="admin-form__field">
              <span>Status</span>
              <select name="status">
                <option value="draft" ${(post.status || 'draft') === 'draft' ? 'selected' : ''}>Draft</option>
                <option value="published" ${post.status === 'published' ? 'selected' : ''}>Published</option>
              </select>
            </label>

            <label class="admin-form__field admin-form__field--full">
              <span>Content</span>
              <div class="admin-editor" data-rich-editor-root>
                <div class="admin-editor__toolbar" role="toolbar" aria-label="Content formatting tools">
                  <button type="button" data-editor-command="formatBlock" data-editor-value="P">Paragraph</button>
                  <button type="button" data-editor-command="formatBlock" data-editor-value="H2">H2</button>
                  <button type="button" data-editor-command="formatBlock" data-editor-value="H3">H3</button>
                  <button type="button" data-editor-command="formatBlock" data-editor-value="H4">H4</button>
                  <button type="button" data-editor-command="bold">Bold</button>
                  <button type="button" data-editor-command="italic">Italic</button>
                  <button type="button" data-editor-command="underline">Underline</button>
                  <button type="button" data-editor-command="insertUnorderedList">Bullet List</button>
                  <button type="button" data-editor-command="insertOrderedList">Numbered List</button>
                  <button type="button" data-editor-command="createLink">Link</button>
                  <button type="button" data-editor-command="removeFormat">Clear Format</button>
                </div>
                <div class="admin-editor__surface" contenteditable="true" data-rich-editor aria-label="Blog content editor"></div>
                <textarea name="content" data-content-input hidden>${escapeHtml(post.content || '')}</textarea>
              </div>
              <small class="admin-field-help">Use headings, links, and lists. Content is sanitized automatically when you save.</small>
              ${errors.content ? `<small class="admin-field-error">${escapeHtml(errors.content)}</small>` : ''}
            </label>

            <label class="admin-form__field">
              <span>Cover image path or URL</span>
              <input type="text" name="cover_image_url" value="${escapeHtml(post.cover_image || '')}" placeholder="/images/example.jpg or https://...">
            </label>

            <label class="admin-form__field">
              <span>Upload cover image</span>
              <input type="file" name="cover_image_file" accept=".jpg,.jpeg,.png,.webp,.gif" data-image-input>
              <small class="admin-field-help">Uploading a file overrides the path/URL above.</small>
              ${errors.cover_image ? `<small class="admin-field-error">${escapeHtml(errors.cover_image)}</small>` : ''}
            </label>

            <label class="admin-form__field admin-form__field--full">
              <span>Cover image alt text</span>
              <input type="text" name="cover_image_alt" value="${escapeHtml(post.cover_image_alt || '')}" required>
              ${errors.cover_image_alt ? `<small class="admin-field-error">${escapeHtml(errors.cover_image_alt)}</small>` : ''}
            </label>

            <label class="admin-form__field">
              <span>Meta title</span>
              <input type="text" name="meta_title" value="${escapeHtml(post.meta_title || '')}" required>
              ${errors.meta_title ? `<small class="admin-field-error">${escapeHtml(errors.meta_title)}</small>` : ''}
            </label>

            <label class="admin-form__field">
              <span>Meta description</span>
              <textarea name="meta_description" rows="4" required>${escapeHtml(post.meta_description || '')}</textarea>
              ${errors.meta_description ? `<small class="admin-field-error">${escapeHtml(errors.meta_description)}</small>` : ''}
            </label>
          </div>

          <div class="admin-image-preview ${hasImage ? 'is-visible' : ''}" data-image-preview-wrap>
            <p>Current preview</p>
            <img src="${escapeHtml(coverImageSrc)}" alt="Selected cover preview" data-image-preview ${hasImage ? '' : 'hidden'}>
          </div>

          <div class="admin-form__actions">
            <button class="btn btn-primary" type="submit">${escapeHtml(submitLabel)}</button>
            <a class="admin-inline-link" href="/admin/dashboard">Cancel</a>
          </div>
        </form>
      </section>
    `
  });
}

module.exports = {
  renderAdminLoginPage,
  renderDashboardPage,
  renderEditorPage
};
