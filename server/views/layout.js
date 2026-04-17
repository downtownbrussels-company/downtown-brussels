const { env } = require('../config/env');
const { escapeHtml } = require('../utils/content');

function buildAbsoluteUrl(pathname = '/') {
  return `${env.siteUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function renderLayout({
  title,
  metaDescription,
  canonicalPath = '/',
  bodyClass = '',
  content = '',
  extraStyles = [],
  extraScripts = [],
  ogImage = ''
}) {
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const pageTitle = escapeHtml(title || 'DownTown Brussels');
  const pageDescription = escapeHtml(metaDescription || 'DownTown Brussels');
  const socialImage = ogImage ? escapeHtml(ogImage.startsWith('http') ? ogImage : buildAbsoluteUrl(ogImage)) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  ${socialImage ? `<meta property="og:image" content="${socialImage}">` : ''}
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/style.css">
  ${extraStyles.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n  ')}
</head>
<body class="${escapeHtml(bodyClass)}">
${content}
${extraScripts.map((src) => `<script src="${src}"></script>`).join('\n')}
</body>
</html>`;
}

module.exports = {
  buildAbsoluteUrl,
  renderLayout
};
