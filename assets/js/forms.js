(()=>{document.querySelectorAll('[data-lead-form]').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();const status=form.querySelector('.form-status'),btn=form.querySelector('button[type="submit"]');status.textContent='Отправляем...';btn.disabled=true;try{const fd=new FormData(form);fd.set('page',location.href);fd.set('language',document.documentElement.lang);fd.set('utm',location.search);const res=await fetch('/.netlify/functions/send-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(fd))});const data=await res.json();if(!res.ok||!data.ok)throw new Error(data.error||'send_failed');status.textContent=document.documentElement.lang==='uk'?'Дані отримано. Ми зв’яжемося після перевірки.':'Данные получены. Мы свяжемся после проверки.';form.reset()}catch(err){status.textContent=document.documentElement.lang==='uk'?'Не вдалося надіслати. Зателефонуйте або напишіть у Telegram.':'Не удалось отправить. Позвоните или напишите в Telegram.'}finally{btn.disabled=false}}))})();

// v98: form funnel events
(function(){
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('[data-lead-form]').forEach(function(form){
    var started=false;
    form.addEventListener('focusin',function(){
      if(!started){ started=true; window.dataLayer.push({event:'form_start',form_id:form.id||'lead_form'}); }
    });
    form.addEventListener('submit',function(){ window.dataLayer.push({event:'form_submit_attempt',form_id:form.id||'lead_form'}); });
  });
})();
