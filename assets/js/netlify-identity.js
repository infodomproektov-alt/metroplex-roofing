(function () {
  'use strict';

  function redirectToAdmin() {
    if (window.location.pathname !== '/admin/' && window.location.pathname !== '/admin') {
      window.location.assign('/admin/');
    }
  }

  function initIdentity() {
    if (!window.netlifyIdentity) return;

    window.netlifyIdentity.on('init', function (user) {
      if (user && /(?:invite|confirmation|recovery)_token=/.test(window.location.hash)) {
        redirectToAdmin();
      }
    });

    window.netlifyIdentity.on('login', redirectToAdmin);
    window.netlifyIdentity.on('signup', redirectToAdmin);
    window.netlifyIdentity.on('logout', function () {
      if (window.location.pathname.indexOf('/admin') === 0) {
        window.location.assign('/');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIdentity, { once: true });
  } else {
    initIdentity();
  }
})();
