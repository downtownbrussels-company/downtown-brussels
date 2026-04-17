function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function isValidSlug(value = '') {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value));
}

module.exports = {
  slugify,
  isValidSlug
};
