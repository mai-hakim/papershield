/* PaperShield look-and-feel helpers: logo, always-on tools (magnifier, text size, listen),
   traffic-light signal, vibration. No data leaves the phone. */
(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const C = () => root.PSCore;
  const t = (k, v) => root.PSi18n.t(k, v);
  const reduced = () => root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- logo: a shield holding a letter, sealed with a check mark ----------
  // Animates once (shield draws, letter rises, check is signed). Off when "reduce motion" is on.
  let logoN = 0;
  function logo(size, animate) {
    const id = 'lg' + (++logoN);
    const wrap = document.createElement('span');
    wrap.className = 'logo' + (animate && !reduced() ? ' logo-anim' : '');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.width = size; wrap.style.height = size;
    wrap.innerHTML =
      '<svg viewBox="0 0 64 72" xmlns="' + NS + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0.4" y2="1">' +
      '<stop offset="0" class="lg-stop1"/><stop offset="1" class="lg-stop2"/></linearGradient></defs>' +
      '<path class="lg-shield" fill="url(#' + id + ')" d="M32 3 C40 7 49 9 58 10 V33 C58 51 46 62 32 69 C18 62 6 51 6 33 V10 C15 9 24 7 32 3 Z"/>' +
      '<path class="lg-rim" d="M32 8.5 C39 12 46 13.5 53 14.5 V33 C53 47.5 43.5 56.5 32 62.5 C20.5 56.5 11 47.5 11 33 V14.5 C18 13.5 25 12 32 8.5 Z"/>' +
      '<g class="lg-letter">' +
      '<path class="lg-page" d="M21 20 H38 L45 27 V49 Q45 51 43 51 H21 Q19 51 19 49 V22 Q19 20 21 20 Z"/>' +
      '<path class="lg-fold" d="M38 20 V25 Q38 27 40 27 H45 Z"/>' +
      '<path class="lg-lines" d="M24 32 H40 M24 37 H40 M24 42 H33"/>' +
      '</g>' +
      '<circle class="lg-badge" cx="44" cy="50" r="9"/>' +
      '<path class="lg-check" d="M39.8 50.2 L43 53.3 L48.6 47.2"/>' +
      '</svg>';
    return wrap;
  }

  // ---------- vibration per result (ACC-10) ----------
  const PATTERN = { none: [80], action: [160], help: [150, 100, 150], notSure: [150, 100, 150], scam: [300, 150, 300, 150, 300] };
  function vibrate(outcome) {
    const s = C().state.settings;
    if (!s.alerts || !s.alerts.vibrate || !navigator.vibrate) return;
    navigator.vibrate(PATTERN[outcome] || [80]);
  }

  // ---------- traffic-light signal: 4 lamps ----------
  // top to bottom of danger: scam (red), ask someone (purple), action (orange), no action (green)
  const LAMPS = [['scam', '⚠'], ['help', '?'], ['action', '!'], ['none', '✓']];
  function signal(outcome) {
    const lit = outcome === 'notSure' ? 'help' : outcome;
    const box = document.createElement('div');
    box.className = 'signal'; box.setAttribute('aria-hidden', 'true');
    LAMPS.forEach(([k, icon]) => {
      const l = document.createElement('span');
      l.className = 'lamp lamp-' + k + (k === lit ? ' on' : '') + (k === lit && k === 'scam' && !reduced() ? ' pulse' : '');
      l.textContent = k === lit ? icon : '';
      box.appendChild(l);
    });
    return box;
  }

  // ---------- always-on tools ----------
  const STEPS = [0.9, 1, 1.15, 1.3, 1.5];
  let lensOpen = false, lensEl = null, clone = null, cx = 0, cy = 0;
  const Z = 2.5;

  function setScale(dir) {
    const s = C().state.settings; const cur = s.textScale || 1;
    let i = STEPS.indexOf(cur); if (i < 0) i = 1;
    i = Math.max(0, Math.min(STEPS.length - 1, i + dir));
    s.textScale = STEPS[i]; C().save();
    document.documentElement.style.setProperty('--scale', s.textScale);
    C().announce(t('textSize', { n: Math.round(s.textScale * 100) }));
    refreshLens(); placeFab();
  }

  // Read whatever is on the screen, in order. Tap again to stop.
  function screenText() {
    const main = document.getElementById('main');
    const out = [];
    main.querySelectorAll('h1, h2, h3, p, li, summary, .o-word, .o-band, label').forEach(el => {
      if (el.closest('[hidden], [aria-hidden="true"]')) return;
      const d = el.closest('details'); if (d && !d.open && el.tagName !== 'SUMMARY' && !el.closest('summary')) return;
      if (el.closest('li') && el.tagName !== 'LI') return;
      const txt = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt && out[out.length - 1] !== txt) out.push(txt);
    });
    return out.slice(0, 30);
  }
  let pollTimer = null;
  function listen(btn) {
    const synth = root.speechSynthesis;
    if (synth && (synth.speaking || synth.pending)) { C().stop(); setListen(btn, false); return; }
    if (!C().speak(screenText())) { C().toast(t('noVoice')); return; }
    setListen(btn, true);
    clearInterval(pollTimer);
    pollTimer = setInterval(() => { if (!synth.speaking && !synth.pending) { setListen(btn, false); clearInterval(pollTimer); } }, 600);
  }
  function setListen(btn, on) {
    btn.classList.toggle('on', on);
    btn.querySelector('.fab-label').textContent = on ? t('stopListen') : t('listen');
    btn.setAttribute('aria-pressed', on);
  }

  // Magnifier: a round lens you drag with your finger. It shows the screen under it 2.5x bigger.
  function buildClone() {
    const main = document.getElementById('main'); if (!lensEl) return;
    if (clone) clone.remove();
    clone = main.cloneNode(true);
    clone.removeAttribute('id'); clone.classList.add('lens-clone'); clone.setAttribute('inert', '');
    clone.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
    const orig = main.querySelectorAll('canvas'), copies = clone.querySelectorAll('canvas');
    copies.forEach((c, i) => { try { c.getContext('2d').drawImage(orig[i], 0, 0); } catch (e) { /* empty canvas */ } });
    clone.style.width = main.getBoundingClientRect().width + 'px';
    lensEl.querySelector('.lens-view').appendChild(clone);
    positionClone();
  }
  function positionClone() {
    if (!clone) return;
    const main = document.getElementById('main'); const mr = main.getBoundingClientRect();
    const R = lensEl.offsetWidth / 2;
    clone.style.transform = 'translate(' + (R - (cx - mr.left) * Z) + 'px,' + (R - (cy - mr.top) * Z) + 'px) scale(' + Z + ')';
  }
  function moveLens(x, y) {
    const R = lensEl.offsetWidth / 2;
    cx = Math.max(R * 0.4, Math.min(root.innerWidth - R * 0.4, x));
    cy = Math.max(R * 0.6, Math.min(root.innerHeight - R * 0.4, y));
    lensEl.style.left = (cx - R) + 'px'; lensEl.style.top = (cy - R) + 'px';
    positionClone();
  }
  function openLens() {
    lensOpen = true; lensEl.hidden = false;
    document.getElementById('mag-btn').setAttribute('aria-pressed', 'true');
    moveLens(root.innerWidth / 2, root.innerHeight * 0.42);
    buildClone();
    C().announce(t('magHint'));
  }
  function closeLens() {
    lensOpen = false; lensEl.hidden = true; if (clone) { clone.remove(); clone = null; }
    document.getElementById('mag-btn').setAttribute('aria-pressed', 'false');
  }
  function refreshLens() { if (lensOpen) requestAnimationFrame(buildClone); }

  // The listen button sits above the bottom camera bar when that bar is showing.
  function placeFab() {
    const fab = document.getElementById('listen-fab'); if (!fab) return;
    const dock = document.querySelector('#main .dock');
    const fixed = dock && getComputedStyle(dock).position === 'fixed';
    fab.style.bottom = 'calc(' + ((fixed ? dock.offsetHeight : 0) + 14) + 'px + env(safe-area-inset-bottom, 0px))';
  }

  function initTools() {
    if (document.getElementById('tools-top')) return;
    const h = C().h;
    const top = h('div', { id: 'tools-top', role: 'toolbar', 'aria-label': t('tools') },
      h('button', { id: 'mag-btn', class: 'tool', 'aria-pressed': 'false', onclick: () => (lensOpen ? closeLens() : openLens()) },
        h('span', { class: 'tool-ic', 'aria-hidden': 'true' }, '🔍'), h('span', null, t('magnifierBtn'))),
      h('div', { class: 'tool-group' },
        h('button', { id: 'mute-btn', class: 'tool tool-a', 'aria-pressed': 'false', 'aria-label': t('mute'), onclick: toggleMute },
          h('span', { 'aria-hidden': 'true', class: 'tool-ic mute-ic' })),
        h('button', { class: 'tool tool-a', onclick: () => setScale(-1), 'aria-label': t('textSmaller') }, h('span', { 'aria-hidden': 'true', class: 'a-small' }, 'A')),
        h('button', { class: 'tool tool-a', onclick: () => setScale(1), 'aria-label': t('textBigger') }, h('span', { 'aria-hidden': 'true', class: 'a-big' }, 'A+'))));
    const fab = h('button', { id: 'listen-fab', class: 'fab', 'aria-pressed': 'false', onclick: () => listen(fab) },
      h('span', { class: 'fab-ic', 'aria-hidden': 'true' }, '🔊'), h('span', { class: 'fab-label' }, t('listen')));
    lensEl = h('div', { class: 'mag-lens', hidden: true, role: 'img', 'aria-label': t('magHint') },
      h('div', { class: 'lens-view' }),
      h('button', { class: 'lens-close', onclick: closeLens, 'aria-label': t('closeMagnifier') }, '✕'));
    let drag = null;
    lensEl.addEventListener('pointerdown', e => {
      if (e.target.closest('.lens-close')) return;
      drag = { dx: e.clientX - cx, dy: e.clientY - cy }; lensEl.setPointerCapture(e.pointerId); lensEl.classList.add('dragging');
    });
    lensEl.addEventListener('pointermove', e => { if (drag) moveLens(e.clientX - drag.dx, e.clientY - drag.dy); });
    const end = () => { drag = null; lensEl.classList.remove('dragging'); };
    lensEl.addEventListener('pointerup', end); lensEl.addEventListener('pointercancel', end);
    root.addEventListener('scroll', () => { if (lensOpen) requestAnimationFrame(positionClone); }, { passive: true });
    root.addEventListener('resize', () => { if (lensOpen) moveLens(cx, cy); placeFab(); });
    document.body.append(top, fab, lensEl); paintMute();
    document.body.classList.add('has-tools');
    document.documentElement.style.setProperty('--scale', C().state.settings.textScale || 1);
  }

  // Mute: stops everything the app says by itself. Buttons the person presses still read aloud.
  function toggleMute() {
    const s = C().state.settings; s.muted = !s.muted; C().save();
    if (s.muted) C().stop();
    paintMute(); C().announce(t(s.muted ? 'mutedNow' : 'unmutedNow')); C().toast(t(s.muted ? 'mutedNow' : 'unmutedNow'));
  }
  function paintMute() {
    const b = document.getElementById('mute-btn'); if (!b) return; const m = !!C().state.settings.muted;
    b.setAttribute('aria-pressed', String(m)); b.setAttribute('aria-label', t(m ? 'unmute' : 'mute')); b.title = t(m ? 'unmute' : 'mute');
    // speaker drawing; a slash through it when automatic reading is off
    b.querySelector('.mute-ic').innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/>' + (m ? '<path d="M16 9l5 6M21 9l-5 6"/>' : '<path d="M15.5 9.2a4 4 0 0 1 0 5.6M18.3 6.6a7.6 7.6 0 0 1 0 10.8"/>') + '</svg>';
  }

  // A small "read this part aloud" button for any card.
  function sayBtn(getParts, label) {
    const h = C().h;
    return h('button', { class: 'say', type: 'button', onclick: () => C().speak([].concat(typeof getParts === 'function' ? getParts() : getParts)) },
      h('span', { 'aria-hidden': 'true' }, '🔊 '), label || t('say'));
  }

  // Reading speed: a slider from turtle to rabbit, 5 steps. Moving it plays a short sample.
  function speedSlider() {
    const h = C().h; const s = C().state.settings;
    let timer = null;
    const out = h('output', { class: 'speed-out' }, t('speedStep', { n: (s.speedStep ?? 1) + 1 }));
    const input = h('input', { type: 'range', min: 0, max: 4, step: 1, value: s.speedStep ?? 1, 'aria-label': t('speedTitle'),
      'aria-valuetext': t('speedStep', { n: (s.speedStep ?? 1) + 1 }),
      oninput: e => {
        s.speedStep = +e.target.value; C().save();
        const txt = t('speedStep', { n: s.speedStep + 1 }); out.textContent = txt; e.target.setAttribute('aria-valuetext', txt);
        clearTimeout(timer); timer = setTimeout(() => C().speak([t('speedSample')]), 250);
      } });
    return h('div', { class: 'speed' },
      h('p', { class: 'speed-title' }, h('span', { 'aria-hidden': 'true' }, '🗣️ '), t('speedTitle')),
      h('div', { class: 'speed-row' },
        h('span', { class: 'speed-end', 'aria-hidden': 'true' }, '🐢'), input, h('span', { class: 'speed-end', 'aria-hidden': 'true' }, '🐇')),
      h('div', { class: 'speed-labels', 'aria-hidden': 'true' }, h('span', null, t('speedSlower')), out, h('span', null, t('speedFaster'))));
  }

  // Called after every screen change.
  function afterRender() {
    const fab = document.getElementById('listen-fab');
    if (fab) setListen(fab, false);
    placeFab(); refreshLens();
    const top = document.getElementById('tools-top');
    if (top) { // labels follow the language setting
      top.querySelector('#mag-btn span:last-child').textContent = t('magnifierBtn');
      top.setAttribute('aria-label', t('tools'));
      paintMute();
    }
  }

  root.PSUI = { logo, signal, vibrate, initTools, afterRender, placeFab, sayBtn, speedSlider, openLens, closeLens };
})(window);
