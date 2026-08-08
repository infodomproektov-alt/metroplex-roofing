(()=>{const h=document.querySelector('.header');addEventListener('scroll',()=>h?.classList.toggle('scrolled',scrollY>18));const b=document.querySelector('.burger'),m=document.querySelector('.mobile-nav');b?.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',String(o));document.body.style.overflow=o?'hidden':''});m?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');document.body.style.overflow=''}));})();

(function(){
  function assetsPrefix(){
    var path = window.location.pathname || '';
    if (path.indexOf('/ru/') !== -1 || path.indexOf('/uk/') !== -1) return '../';
    return '';
  }
  function isUk(){
    return (document.documentElement.lang || '').toLowerCase().indexOf('uk') === 0 || (window.location.pathname || '').indexOf('/uk/') !== -1;
  }
  function normalizePhoneHref(phoneTel){
    if(!phoneTel) return '';
    return 'tel:' + String(phoneTel).replace(/[^+0-9]/g,'');
  }
  function applySiteSettings(settings){
    if(!settings) return;
    var langUk = isUk();
    var phoneText = settings.phone_display || '';
    var phoneHref = normalizePhoneHref(settings.phone_tel || phoneText);
    var address = langUk ? settings.address_uk : settings.address_ru;
    var officeTitle = langUk ? settings.office_title_uk : settings.office_title_ru;
    var workingHours = langUk ? settings.working_hours_uk : settings.working_hours_ru;

    if(phoneHref){
      document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
        a.setAttribute('href', phoneHref);
        if(phoneText && !a.classList.contains('mobile-contact-btn')) a.textContent = phoneText;
      });
    }
    if(settings.telegram_url){
      document.querySelectorAll('a[href*="t.me"], a.mobile-contact-btn--telegram').forEach(function(a){
        a.setAttribute('href', settings.telegram_url);
        a.setAttribute('target','_blank');
        a.setAttribute('rel','noopener');
        if(settings.telegram_label && a.classList.contains('mobile-contact-btn')) a.textContent = settings.telegram_label;
      });
    }
    if(address){
      document.querySelectorAll('.footer-contacts .footer-links span').forEach(function(el){ el.textContent = address; });
      document.querySelectorAll('[data-contact-address]').forEach(function(el){ el.textContent = address; });
    }
    if(officeTitle){
      document.querySelectorAll('[data-contact-office-title]').forEach(function(el){ el.textContent = officeTitle; });
    }
    if(phoneText){
      document.querySelectorAll('[data-contact-phone-text]').forEach(function(el){ el.textContent = phoneText; });
    }
    if(workingHours){
      document.querySelectorAll('[data-contact-hours]').forEach(function(el){ el.textContent = workingHours; });
    }
    if(settings.email){
      document.querySelectorAll('[data-contact-email]').forEach(function(el){
        el.textContent = settings.email;
        if(el.tagName && el.tagName.toLowerCase() === 'a') el.href = 'mailto:' + settings.email;
      });
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    fetch(assetsPrefix() + 'assets/data/site-settings.json', {cache:'no-store'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(applySiteSettings)
      .catch(function(){});
  });
})();


// v98: analytics-ready interaction events. Works when GTM/GA is connected later.
(function(){
  window.dataLayer = window.dataLayer || [];
  function pushEvent(name, params){ window.dataLayer.push(Object.assign({event:name}, params||{})); }
  document.addEventListener('click', function(e){
    var a=e.target.closest('a'); if(!a) return;
    var href=a.getAttribute('href')||'';
    if(href.indexOf('tel:')===0) pushEvent('click_phone',{link_url:href});
    if(href.indexOf('tg:')===0 || href.indexOf('t.me')!==-1) pushEvent('click_telegram',{link_url:href});
    if(a.closest('.service-feature')) pushEvent('view_service_click',{link_url:href,link_text:(a.textContent||'').trim()});
    if(a.closest('.home-real-works') || href.indexOf('works.html')!==-1) pushEvent('view_portfolio_click',{link_url:href});
  },{passive:true});
})();
