/* Info pages (welcome, about, privacy, accessibility, test): same logo and the same
   always-on tools as the app — magnifier, A / A+, mute and Listen. */
(function () {
  'use strict';
  const C = window.PSCore, I = window.PSi18n;
  I.setLang('en'); // the info pages are written in English
  const s = C.state.settings;
  document.documentElement.style.setProperty('--scale', s.textScale || 1);
  document.body.dataset.theme = s.theme || 'system';
  document.body.dataset.profile = s.profile || 'standard';
  document.querySelectorAll('[data-logo]').forEach(el => {
    const first = !sessionStorage.getItem('ps-logo-static');
    el.replaceWith(window.PSUI.logo(el.dataset.logo || '2.6rem', first && el.hasAttribute('data-animate')));
  });
  try { sessionStorage.setItem('ps-logo-static', '1'); } catch (e) { /* private mode */ }
  window.PSUI.initTools();
  window.PSUI.afterRender();
})();
