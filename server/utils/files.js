function getImageSource(filePath = '') {
  if (!filePath) return '';
  if (/^https?:\/\//i.test(filePath)) return filePath;
  return filePath.startsWith('/') ? filePath : `/${filePath.replace(/^\/+/, '')}`;
}

module.exports = {
  getImageSource
};
