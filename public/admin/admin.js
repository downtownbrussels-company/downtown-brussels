document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.querySelector('[data-title-input]');
  const slugInput = document.querySelector('[data-slug-input]');
  const imageInput = document.querySelector('[data-image-input]');
  const imagePreview = document.querySelector('[data-image-preview]');
  const previewWrap = document.querySelector('[data-image-preview-wrap]');

  let slugTouched = false;

  const slugify = (value) => String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

  if (slugInput) {
    slugInput.addEventListener('input', () => {
      slugTouched = Boolean(slugInput.value.trim());
      slugInput.value = slugify(slugInput.value);
    });
  }

  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!slugTouched) {
        slugInput.value = slugify(titleInput.value);
      }
    });
  }

  document.querySelectorAll('[data-delete-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!window.confirm('Delete this blog post? This cannot be undone.')) {
        event.preventDefault();
      }
    });
  });

  if (imageInput && imagePreview && previewWrap) {
    imageInput.addEventListener('change', () => {
      const [file] = imageInput.files || [];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      imagePreview.src = objectUrl;
      imagePreview.hidden = false;
      previewWrap.classList.add('is-visible');
    });
  }
});
