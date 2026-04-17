const sanitizeHtml = require('sanitize-html');

const HTML_SANITIZE_OPTIONS = {
  allowedTags: [
    'p',
    'br',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'strong',
    'em',
    'b',
    'i',
    'u',
    'a',
    'code',
    'pre',
    'hr'
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      rel: 'noopener noreferrer',
      target: '_blank'
    })
  }
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripToPlainText(value = '') {
  return sanitizeHtml(String(value), {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

function normalizeContent(raw = '') {
  const value = String(raw).trim();
  if (!value) return '';

  const hasHtml = /<[^>]+>/.test(value);
  if (hasHtml) {
    return sanitizeHtml(value, HTML_SANITIZE_OPTIONS).trim();
  }

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

function toTextAreaValue(value = '') {
  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<\/?p>/gi, '')
    .replace(/&nbsp;/g, ' ');
}

module.exports = {
  escapeHtml,
  normalizeContent,
  stripToPlainText,
  toTextAreaValue
};
