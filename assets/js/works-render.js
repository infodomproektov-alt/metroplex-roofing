
(function(){
  function isUk(){
    return (document.documentElement.lang || '').toLowerCase().indexOf('uk') === 0 || (window.location.pathname || '').indexOf('/uk/') !== -1;
  }
  function escapeHtml(s){
    return String(s || '').replace(/[&<>\"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
  }
  function normalizeImage(src){
    if(!src) return '../assets/img/services/metallocherepitsa.webp';
    if(src.indexOf('/') === 0) return src;
    return src;
  }
  function card(item){
    var img = normalizeImage(item.image);
    var tag = item.tag ? '<span class="work-tag">' + escapeHtml(item.tag) + '</span>' : '';
    var meta = '';
    if(item.location || item.area || item.material){
      meta += '<div class="work-meta">';
      if(item.location) meta += '<span>' + escapeHtml(item.location) + '</span>';
      if(item.area) meta += '<span>' + escapeHtml(item.area) + '</span>';
      if(item.material) meta += '<span>' + escapeHtml(item.material) + '</span>';
      meta += '</div>';
    }
    var scope = '';
    if(Array.isArray(item.scope) && item.scope.length){
      scope = '<span class="work-scope-label">' + (isUk() ? 'Виконано на об’єкті' : 'Выполнено на объекте') + '</span><ul class="work-scope">' + item.scope.slice(0,4).map(function(x){ return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul>';
    }
    var more = item.url ? '<span class="work-more">' + (isUk() ? 'Переглянути рішення' : 'Посмотреть решение') + '</span>' : '';
    var media = '<div class="work-card-media"><img src="' + escapeHtml(img) + '" alt="' + escapeHtml(item.image_alt || item.title) + '" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'../assets/img/services/profnastil.webp\'"/></div>';
    var body = media + '<div class="work-card-body">' + tag + '<h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.excerpt) + '</p>' + meta + scope + more + '</div>';
    if(item.url){
      return '<article class="work-card"><a class="work-card-link" href="' + escapeHtml(item.url) + '">' + body + '</a></article>';
    }
    return '<article class="work-card">' + body + '</article>';
  }
  document.addEventListener('DOMContentLoaded', function(){
    var grid = document.querySelector('[data-works-grid]');
    if(!grid) return;
    var file = isUk() ? '../assets/data/works-uk.json' : '../assets/data/works-ru.json';
    fetch(file, {cache:'no-store'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if(!data || !Array.isArray(data.works)) return;
        var seenImages = Object.create(null);
        var items = data.works.filter(function(x){
            if(!x || x.published === false) return false;
            var imageKey = normalizeImage(x.image || '').split('?')[0].toLowerCase();
            if(imageKey && seenImages[imageKey]) return false;
            if(imageKey) seenImages[imageKey] = true;
            return true;
          })
          .sort(function(a,b){ return (a.order || 999) - (b.order || 999); });
        if(!items.length) return;
        grid.innerHTML = items.map(card).join('');
      }).catch(function(){});
  });
})();
