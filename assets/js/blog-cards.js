(() => {
  const grids = document.querySelectorAll('[data-blog-source]');
  if (!grids.length) return;

  const text = {
    uk: { read: 'Читати статтю', min: 'хв читання', empty: 'Матеріали скоро з’являться' },
    ru: { read: 'Читать статью', min: 'мин чтения', empty: 'Материалы скоро появятся' }
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const normalizeUrl = (item) => {
    if (item.url && String(item.url).trim()) return item.url;
    const slug = encodeURIComponent(item.slug || 'article');
    return `article.html?slug=${slug}`;
  };

  const normalizeImage = (src = '') => src || '../../assets/img/hero/hero-main.webp';

  const renderCard = (item, index, lang) => {
    const href = normalizeUrl(item);
    const image = normalizeImage(item.image);
    const category = item.category || (lang === 'uk' ? 'Матеріали' : 'Материалы');
    const readTime = item.read_time || '';
    const date = item.date || '';
    return `
      <article class="blog-card blog-card-cms" data-article-slug="${escapeHtml(item.slug || '')}">
        <a class="blog-card-image" href="${escapeHtml(href)}" aria-label="${escapeHtml(item.title || '')}">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(item.image_alt || item.title || '')}" loading="lazy" decoding="async" width="1200" height="750">
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="article-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="article-category">${escapeHtml(category)}</span>
            ${date ? `<time datetime="${escapeHtml(date)}">${escapeHtml(date)}</time>` : ''}
          </div>
          <h2><a href="${escapeHtml(href)}">${escapeHtml(item.title || '')}</a></h2>
          <p>${escapeHtml(item.excerpt || '')}</p>
          <div class="blog-card-footer">
            ${readTime ? `<span class="read-time">${escapeHtml(readTime)}</span>` : '<span></span>'}
            <a class="text-link" href="${escapeHtml(href)}">${text[lang]?.read || text.ru.read}</a>
          </div>
        </div>
      </article>`;
  };

  const sortArticles = (a, b) => {
    const ao = Number.isFinite(Number(a.order)) ? Number(a.order) : 9999;
    const bo = Number.isFinite(Number(b.order)) ? Number(b.order) : 9999;
    if (ao !== bo) return ao - bo;
    return String(b.date || '').localeCompare(String(a.date || ''));
  };

  grids.forEach(async (grid) => {
    const source = grid.getAttribute('data-blog-source');
    const lang = grid.getAttribute('data-blog-lang') || document.documentElement.lang || 'ru';
    if (!source) return;
    try {
      const response = await fetch(source, { cache: 'no-store' });
      if (!response.ok) throw new Error('Cannot load blog data');
      const data = await response.json();
      const articles = (data.articles || [])
        .filter(item => item && item.published !== false)
        .sort(sortArticles);
      if (!articles.length) {
        grid.innerHTML = `<div class="blog-empty">${text[lang]?.empty || text.ru.empty}</div>`;
        return;
      }
      grid.innerHTML = articles.map((item, index) => renderCard(item, index, lang)).join('');
    } catch (error) {
      // Static cards remain as fallback when opened as a local file or if JSON is unavailable.
      console.warn('Blog cards fallback:', error.message);
    }
  });
})();
