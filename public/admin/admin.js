document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.querySelector('[data-title-input]');
  const slugInput = document.querySelector('[data-slug-input]');
  const imageInput = document.querySelector('[data-image-input]');
  const imagePreview = document.querySelector('[data-image-preview]');
  const previewWrap = document.querySelector('[data-image-preview-wrap]');
  const editorRoot = document.querySelector('[data-rich-editor-root]');
  const editorSurface = document.querySelector('[data-rich-editor]');
  const contentInput = document.querySelector('[data-content-input]');
  const postForm = document.querySelector('.admin-form--post');

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

  const normalizeEditorHtml = (rawHtml) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = String(rawHtml || '');

    wrapper.querySelectorAll('script, style').forEach((node) => node.remove());

    return wrapper.innerHTML.trim();
  };

  if (editorRoot && editorSurface && contentInput) {
    editorSurface.innerHTML = normalizeEditorHtml(contentInput.value);

    const runEditorCommand = (command, value = null) => {
      editorSurface.focus();

      if (command === 'createLink') {
        const link = window.prompt('Enter URL (https://...)');
        if (!link) return;
        document.execCommand('createLink', false, link.trim());
        return;
      }

      document.execCommand(command, false, value);
    };

    editorRoot.querySelectorAll('[data-editor-command]').forEach((button) => {
      button.addEventListener('click', () => {
        const command = button.getAttribute('data-editor-command');
        const value = button.getAttribute('data-editor-value');
        runEditorCommand(command, value);
      });
    });
  }

  if (postForm && editorSurface && contentInput) {
    postForm.addEventListener('submit', () => {
      contentInput.value = normalizeEditorHtml(editorSurface.innerHTML);
    });
  }
});
