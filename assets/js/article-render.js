(() => {
  const mount = document.querySelector('[data-article-render]');
  if (!mount) return;

  const lang = mount.getAttribute('data-blog-lang') || document.documentElement.lang || 'ru';
  const source = mount.getAttribute('data-blog-source');
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const ui = {
    uk: { notFound: 'Статтю не знайдено', back: 'Повернутися до блогу', read: 'Читати далі', material: 'Матеріали METROPLEX' },
    ru: { notFound: 'Статья не найдена', back: 'Вернуться в блог', read: 'Читать дальше', material: 'Материалы METROPLEX' }
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const markdownToHtml = (md = '') => {
    const lines = String(md).replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let listOpen = false;
    const closeList = () => { if (listOpen) { html += '</ul>'; listOpen = false; } };
    lines.forEach(raw => {
      const line = raw.trim();
      if (!line) { closeList(); return; }
      if (line.startsWith('### ')) { closeList(); html += `<h3>${escapeHtml(line.slice(4))}</h3>`; return; }
      if (line.startsWith('## ')) { closeList(); html += `<h2>${escapeHtml(line.slice(3))}</h2>`; return; }
      if (line.startsWith('- ')) {
        if (!listOpen) { html += '<ul>'; listOpen = true; }
        html += `<li>${escapeHtml(line.slice(2))}</li>`;
        return;
      }
      closeList();
      html += `<p>${escapeHtml(line)}</p>`;
    });
    closeList();
    return html;
  };

  const articleUrl = (item) => item.url && item.url.trim() ? item.url : `article.html?slug=${encodeURIComponent(item.slug || '')}`;

  const renderArticle = (article, allArticles) => {
    document.title = `${article.title} | METROPLEX`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && article.excerpt) metaDescription.setAttribute('content', article.excerpt);
    const related = allArticles
      .filter(item => item.published !== false && item.slug !== article.slug)
      .slice(0, 3);
    mount.innerHTML = `
      <section class="article-hero dynamic-article-hero">
        <div class="container">
          <div class="breadcrumbs"><a href="index.html">${ui[lang]?.material || ui.ru.material}</a> / ${escapeHtml(article.category || '')}</div>
          <div class="article-meta">
            ${article.category ? `<span>${escapeHtml(article.category)}</span>` : ''}
            ${article.date ? `<span>${escapeHtml(article.date)}</span>` : ''}
            ${article.read_time ? `<span>${escapeHtml(article.read_time)}</span>` : ''}
          </div>
          <h1>${escapeHtml(article.title || '')}</h1>
          <p>${escapeHtml(article.excerpt || '')}</p>
          ${article.image ? `<div class="article-cover"><img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.image_alt || article.title || '')}" decoding="async"></div>` : ''}
        </div>
      </section>
      <section class="section section-light article-wrap">
        <div class="container article-layout">
          <article class="article-body dynamic-article-body">
            ${markdownToHtml(article.content || article.excerpt || '')}
          </article>
          <aside class="article-aside">
            <div class="mini-card">
              <h3>METROPLEX</h3>
              <p>${lang === 'uk' ? 'Покрівельні роботи для приватних і комерційних об’єктів у Харкові та області.' : 'Кровельные работы для частных и коммерческих объектов в Харькове и области.'}</p>
              <a class="btn btn-primary" href="../index.html#contact">${lang === 'uk' ? 'Описати об’єкт' : 'Описать объект'}</a>
            </div>
            <div class="mini-card related-card">
              <h3>${lang === 'uk' ? 'Інші матеріали' : 'Другие материалы'}</h3>
              ${related.map(item => `<a href="${escapeHtml(articleUrl(item))}">${escapeHtml(item.title || '')}</a>`).join('')}
            </div>
          </aside>
        </div>
      </section>`;
  };

  const renderNotFound = () => {
    mount.innerHTML = `<section class="article-hero"><div class="container"><h1>${ui[lang]?.notFound || ui.ru.notFound}</h1><p><a class="btn btn-primary" href="index.html">${ui[lang]?.back || ui.ru.back}</a></p></div></section>`;
  };

  if (!slug || !source) { renderNotFound(); return; }
  fetch(source, { cache: 'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('Cannot load article data')))
    .then(data => {
      const articles = (data.articles || []).filter(item => item && item.published !== false);
      const article = articles.find(item => item.slug === slug);
      article ? renderArticle(article, articles) : renderNotFound();
    })
    .catch(renderNotFound);
})();
