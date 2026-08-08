(function(){
  function close(box){
    box.classList.remove('is-open');
    document.body.classList.remove('work-photo-open');
    var img=box.querySelector('img');
    if(img) img.removeAttribute('src');
  }
  document.addEventListener('DOMContentLoaded',function(){
    var box=document.createElement('div');
    box.className='work-photo-lightbox';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    box.setAttribute('aria-label','Просмотр фотографии');
    box.innerHTML='<button type="button" aria-label="Закрыть">×</button><img alt="">';
    document.body.appendChild(box);
    box.querySelector('button').addEventListener('click',function(){close(box);});
    box.addEventListener('click',function(e){if(e.target===box) close(box);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape') close(box);});
    document.addEventListener('click',function(e){
      var media=e.target.closest && e.target.closest('.works-page-grid .work-card-media');
      if(!media) return;
      var img=media.querySelector('img');
      if(!img || !img.currentSrc && !img.src) return;
      e.preventDefault();
      e.stopPropagation();
      var full=box.querySelector('img');
      full.src=img.currentSrc || img.src;
      full.alt=img.alt || '';
      box.classList.add('is-open');
      document.body.classList.add('work-photo-open');
    },true);
  });
})();
