/* PaperShield screens. */
(function () {
  'use strict';
  // append() ignores empty parts (null/false) instead of printing "null"
  const nativeAppend = Element.prototype.append;
  Element.prototype.append = function (...k) { return nativeAppend.apply(this, k.flat().filter(x => x != null && x !== false)); };
  const C = window.PSCore, R = window.PSRules, E = window.PSExplain, G = window.PSEngine, I = window.PSi18n, h = C.h;
  const t = (k, v) => I.t(k, v);
  const S = () => C.state.settings;
  const main = document.getElementById('main');
  const ICON = { none: '✓', action: '!', help: '?', scam: '⚠', cantRead: '✕', notSure: '?',
    overdue: '⏰', urgent: '⏳', soon: '📅', later: '📅', unclear: '❔', nodate: '—' };
  const TYPE_ICON = { bill: '🧾', insurance: '🛡', gov: '🏛', medical: '⚕', promo: '📣', other: '✉', scam: '⚠' };

  let current = null; // { a, canvases, sample, typeOverride, level }

  // ---------- appearance (ACC-02, ACC-05, ACC-06, ACC-15) ----------
  function applySettings() {
    const s = S(); const b = document.body;
    I.setLang(s.lang);
    b.dataset.profile = s.profile; b.dataset.theme = s.theme; document.documentElement.classList.toggle('invert', !!s.invert); document.documentElement.classList.toggle('dim', (s.brightness || 100) !== 100); b.classList.toggle('one-hand', !!s.oneHand);
    document.documentElement.style.setProperty('--bright', (s.brightness || 100) / 100);
    document.documentElement.style.setProperty('--scale', s.textScale || 1);
    document.title = t('appName');
  }

  function go(render, focusSel) {
    C.stop(); main.innerHTML = ''; window.scrollTo(0, 0);
    render(main);
    const f = main.querySelector(focusSel || 'h1, h2'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    window.PSUI.afterRender();
  }
  function bar(title, onBack) {
    return h('header', { class: 'bar' },
      onBack ? h('button', { class: 'btn ghost back', onclick: onBack, 'aria-label': t('back') }, '‹ ' + t('back')) : h('span'),
      h('h1', { class: 'bar-title' }, title));
  }
  function greeting() {
    const hr = new Date().getHours(); const g = hr < 12 ? t('goodMorning') : hr < 18 ? t('goodAfternoon') : t('goodEvening');
    return S().name ? g + ', ' + S().name : g;
  }

  // ---------- onboarding (PRV-06 no login, ACC-03/04/05, FAM-02) ----------
  function onboarding() {
    go(root => {
      let step = 0;
      const box = h('section', { class: 'onboard' }); root.appendChild(box);
      const dots = () => h('p', { class: 'ob-step' }, h('span', { class: 'ob-dots', 'aria-hidden': 'true' }, [0, 1, 2].map(i => h('span', { class: i === step ? 'on' : '' }))), t('obStep', { n: step + 1 }));
      const pic = n => h('img', { class: 'ob-pic', src: 'assets/onboard-' + n + '.svg', alt: '', width: 320, height: 200 });
      const draw = () => {
        box.innerHTML = '';
        if (step === 0) {
          box.append(dots(), window.PSUI.logo('6.5rem', true), h('h1', null, t('ob1Title')), pic(1),
            h('p', { class: 'lead' }, t('ob1Body')),
            h('p', { class: 'trust-line' }, h('span', { 'aria-hidden': 'true' }, '🔒 '), t('trustLine')),
            window.PSUI.sayBtn(() => [t('ob1Title'), t('ob1Body'), t('trustLine')]),
            h('label', { class: 'field' }, '🌐 ' + t('setLang'), langSelect(() => { applySettings(); draw(); })),
            h('label', { class: 'field' }, '🙂 ' + t('setName'), h('input', { type: 'text', autocomplete: 'given-name', value: S().name, oninput: e => { S().name = e.target.value.trim(); C.save(); } })),
            h('button', { class: 'btn primary big', onclick: () => { step = 1; draw(); } }, t('next') + ' →'));
        } else if (step === 1) {
          const rows = [['none', '✓'], ['action', '!'], ['help', '?'], ['scam', '⚠']];
          box.append(dots(), h('h1', null, t('ob2Title')), pic(2), h('p', { class: 'lead' }, t('ob2Body')),
            h('ul', { class: 'ob-outcomes' }, rows.map(([k, ic]) => h('li', { class: 'o-' + k }, h('span', { class: 'ob-lamp', 'aria-hidden': 'true' }, ic), t('ob2' + k)))),
            h('p', { class: 'ob-tools' }, t('ob2Tools')),
            window.PSUI.sayBtn(() => [t('ob2Title'), t('ob2Body'), ...rows.map(r => t('ob2' + r[0])), t('ob2Tools')]),
            yesNo(t('ask1'), v => { S().profile = v ? 'large' : 'standard'; C.save(); applySettings(); }),
            yesNo(t('ask2'), v => { if (!v) { S().alerts.flash = true; S().alerts.vibrate = true; if (S().profile === 'standard') S().profile = 'hearing'; } C.save(); applySettings(); }, 'speak'),
            window.PSUI.speedSlider(),
            h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { step = 0; draw(); } }, '← ' + t('back')),
              h('button', { class: 'btn primary', onclick: () => { step = 2; draw(); } }, t('next') + ' →')));
        } else {
          const startNow = () => { S().onboarded = true; C.save(); home(); };
          box.append(dots(), h('h1', null, t('ob3Title')), pic(3), h('p', { class: 'lead' }, t('ob3Body')),
            window.PSUI.sayBtn(() => [t('ob3Title'), t('ob3Body')]),
            trustedEditor(true),
            h('button', { class: 'btn primary big', onclick: startNow }, '✓ ' + t('start')),
            h('button', { class: 'btn ghost big', onclick: startNow }, t('skip')),
            h('button', { class: 'link', onclick: () => { step = 1; draw(); } }, '← ' + t('back')));
        }
        window.PSUI.afterRender();
        const f = box.querySelector('h1'); f.setAttribute('tabindex', '-1'); f.focus();
      };
      draw();
    });
  }
  function yesNo(q, cb, sample) {
    const out = h('div', { class: 'yesno' }, h('p', { class: 'q' }, q));
    if (sample === 'speak') out.appendChild(h('button', { class: 'btn ghost', onclick: () => C.speak([q]) }, '🔊 ' + t('play')));
    const yes = h('button', { class: 'btn', onclick: () => { cb(true); mark(yes); } }, t('yes'));
    const no = h('button', { class: 'btn', onclick: () => { cb(false); mark(no); } }, t('no'));
    function mark(b) { [yes, no].forEach(x => x.setAttribute('aria-pressed', x === b)); }
    out.appendChild(h('div', { class: 'row' }, yes, no)); return out;
  }
  function langSelect(onchange) {
    const s = h('select', { onchange: e => { S().lang = e.target.value; C.save(); onchange && onchange(); } },
      h('option', { value: 'en' }, 'English'), h('option', { value: 'es' }, 'Español'));
    s.value = S().lang; return s;
  }
  function profilePicker() { // ACC-02 presets with live preview ACC-05
    const wrap = h('fieldset', { class: 'profiles' }, h('legend', null, t('setProfile')));
    ['standard', 'large', 'contrast', 'hearing', 'lowvision', 'colorblind'].forEach(p => {
      wrap.appendChild(h('label', { class: 'radio' }, h('input', { type: 'radio', name: 'profile', value: p, checked: S().profile === p,
        onchange: () => { S().profile = p; if (p === 'lowvision') S().magnifier = true; if (p === 'hearing') S().alerts.flash = true; C.save(); applySettings(); } }), ' ' + t('prof_' + p)));
    });
    return wrap;
  }

  // ---------- home (RES-24, RES-25, RES-30, RES-31, RES-35, SCM-16) ----------
  function home() {
    go(root => {
      const st = C.monthStats();
      const due = C.state.reminders.filter(r => !r.handled).sort((a, b) => a.date.localeCompare(b.date));
      root.append(
        h('header', { class: 'home-head' },
          h('div', { class: 'brand' }, window.PSUI.logo('2.4rem', !sessionStorage.getItem('ps-logo')), h('span', null, t('appName'))),
          h('button', { class: 'btn ghost', onclick: settings, 'aria-label': t('settings') }, '⚙ ' + t('settings'))),
        h('h1', { class: 'greet' }, greeting()),
        h('section', { class: 'today', 'aria-labelledby': 'today-h' },
          h('h2', { id: 'today-h' }, t('today')),
          due.length ? h('ul', { class: 'today-list' }, due.slice(0, 4).map(todayItem)) : h('p', { class: 'muted' }, t('todayEmpty')),
          st.docs ? h('p', { class: 'encourage' }, t('encourage', { n: st.docs, h: st.help })) : null),
        savedSection(),
        h('button', { class: 'panic', onclick: panic }, h('span', { 'aria-hidden': 'true' }, '☎ '), t('phonePanic')),
        h('section', { class: 'demo-row', 'aria-label': t('tryDemo') }, h('h2', { class: 'small-h' }, t('tryDemo')),
          h('div', { class: 'chips' }, window.PSDemo.build().map(d => h('button', { class: 'chip', onclick: () => runDemo(d) }, t(d.titleKey))))),
        h('nav', { class: 'links' }, [['help', howItDecides], ['glossary', glossaryScreen], ['privacy', privacyScreen], ['accessibility', a11yScreen], ['about', aboutScreen]]
          .map(([k, fn]) => h('button', { class: 'link', onclick: fn }, t(k)))),
        h('div', { class: 'dock' },
          h('button', { class: 'camera-btn', onclick: () => camera(), 'aria-describedby': 'cam-sub' },
            h('span', { class: 'cam-lens', 'aria-hidden': 'true' }), h('span', { class: 'cam-label' }, t('scan')), h('span', { id: 'cam-sub', class: 'cam-sub' }, t('scanSub'))),
          h('div', { class: 'dock-row' },
            h('label', { class: 'btn ghost file' }, '⬆ ' + t('upload'), h('input', { type: 'file', accept: 'image/*,application/pdf', multiple: true, class: 'sr', onchange: e => fromFiles([...e.target.files]) }))))
      );
      try { sessionStorage.setItem('ps-logo', '1'); } catch (e) { /* private mode */ }
      // REM-02: overdue/near reminders get an alert on open
      if (due.some(r => R.dayDiff(new Date(), new Date(r.date)) <= 1)) C.alertUser('due');
    });
  }
  // Letters the person chose to "Save on my phone only"
  function savedSection() {
    const sec = h('section', { class: 'saved card', hidden: true, 'aria-labelledby': 'saved-h' });
    if (!window.PSStore) return sec;
    const del = async r => { if (await C.confirmBox(t('keepDelete') + '?', '🗑️ ' + t('savedDelete'))) { await window.PSStore.remove(r.id); C.toast(t('savedGone')); home(); } };
    window.PSStore.list().then(list => {
      if (!list.length) return;
      sec.hidden = false;
      sec.append(h('h2', { id: 'saved-h' }, '📁 ' + t('savedTitle')), h('p', { class: 'muted center' }, '🔒 ' + t('savedNeverSent')),
        h('ul', { class: 'saved-list' }, list.map(r => h('li', { class: 'saved-item o-' + r.outcome },
          h('span', { class: 'saved-dot', 'aria-hidden': 'true' }, ICON[r.outcome] || '✉'),
          h('div', null, h('strong', null, r.headline), h('p', { class: 'muted' }, t('savedOn', { date: I.fmtDate(new Date(r.id)) }))),
          h('div', { class: 'saved-btns' },
            h('button', { class: 'btn small', onclick: () => openSaved(r) }, '📄 ' + t('savedOpen')),
            h('button', { class: 'btn small ghost', onclick: () => del(r) }, '🗑️ ' + t('savedDelete')))))));
      window.PSUI.afterRender();
    }).catch(() => {});
    return sec;
  }
  function openSaved(r) {
    go(root => {
      root.append(bar(t('letterTitle'), home),
        h('div', { class: 'outcome o-' + r.outcome }, window.PSUI.signal(r.outcome), h('span', { class: 'o-word' }, h('span', { class: 'o-icon', 'aria-hidden': 'true' }, ICON[r.outcome]), t('out_' + r.outcome))),
        h('h2', { class: 'headline' }, r.headline),
        h('section', { class: 'summary card' }, h('h3', null, '🧾 ' + t('sumTitle')), h('dl', { class: 'sum-list' }, r.rows.map(x => [h('dt', null, h('span', { 'aria-hidden': 'true' }, x[0] + ' '), x[1]), h('dd', null, x[2])]).flat()),
          window.PSUI.sayBtn(() => [r.headline].concat(r.rows.map(x => x[1] + ': ' + x[2])), t('sumListen'))),
        h('p', { class: 'muted center' }, t('seeLetterHint')),
        h('div', { class: 'see-row' }, h('button', { class: 'btn', onclick: () => window.PSUI.openLens() }, '🔍 ' + t('magnifierBtn'))),
        h('div', { class: 'letter-pages' }, (r.images || []).map((src, i) => h('img', { class: 'letter-img', src, alt: t('letterTitle') + ' ' + (i + 1) }))),
        h('p', { class: 'privacy-note center' }, '🔒 ' + t('keepLine')),
        h('button', { class: 'btn big', onclick: async () => { if (await C.confirmBox(t('keepDelete') + '?', '🗑️ ' + t('savedDelete'))) { await window.PSStore.remove(r.id); C.toast(t('savedGone')); home(); } } }, '🗑️ ' + t('keepDelete')));
    });
  }
  function todayItem(r) {
    const d = new Date(r.date + 'T12:00:00'); const left = R.dayDiff(new Date(), d);
    const bandK = left < 0 ? 'overdue' : left <= 3 ? 'urgent' : 'soon';
    const label = left < 0 ? t('band_overdue') : left === 0 ? t('band_today') : left === 1 ? t('band_urgent1') : t('band_soon', { d: left });
    return h('li', { class: 'today-item band-' + bandK },
      h('span', { class: 'b-icon', 'aria-hidden': 'true' }, ICON[bandK]),
      h('div', null, h('strong', null, label), h('p', null, r.sentence)),
      h('button', { class: 'btn small', onclick: () => {
        r.handled = true; C.save(); home(); C.toast(t('handledDone'), () => { r.handled = false; C.save(); home(); });
      } }, t('handled')));
  }

  // ---------- SCM-16 panic ----------
  function panic() {
    go(root => {
      const first = C.state.trusted[0];
      root.append(bar(t('phonePanicTitle'), home), h('section', { class: 'panic-screen' },
        h('p', { class: 'huge' }, t('phonePanicTitle')), h('p', { class: 'lead' }, t('phonePanicBody')),
        h('button', { class: 'btn primary big', onclick: home }, t('hangUpDone')),
        first ? h('a', { class: 'btn big', href: 'tel:' + first.phone }, '☎ ' + t('callTrusted') + ' (' + first.name + ')') : h('p', { class: 'muted' }, t('tNone'))));
      C.speak([t('phonePanicTitle'), t('phonePanicBody')], { tone: 'serious', auto: true }); C.alertUser('scam');
    });
  }

  // ---------- camera (CAM-01..07) ----------
  let stream = null;
  function stopStream() { if (stream) { stream.getTracks().forEach(tr => tr.stop()); stream = null; } }
  async function camera(existing) {
    const pages = Array.isArray(existing) ? existing : []; const hashes = pages.map(p => G.ahash(p)); // a tap event is not a list of pages
    go(root => {
      const video = h('video', { playsinline: true, muted: true, autoplay: true, class: 'cam-video', 'aria-hidden': 'true' });
      const hint = h('p', { class: 'cam-hint', role: 'status', 'aria-live': 'polite' }, t('camHint'));
      const count = h('span', { class: 'pagecount' }, t('pages', { n: pages.length }));
      const finish = h('button', { class: 'btn primary', disabled: !pages.length, onclick: () => { stopStream(); process(pages); } }, t('finish'));
      root.append(bar(t('camTitle'), () => { stopStream(); G.wipe(pages); home(); }),
        h('div', { class: 'cam-wrap' }, video, h('div', { class: 'frame', 'aria-hidden': 'true' }), hint),
        h('div', { class: 'cam-controls' }, count,
          h('button', { class: 'shutter', 'aria-label': t('takePhoto'), onclick: () => shoot(true) }),
          finish));
      let prev = null, goodFrames = 0, busy = false, alive = true;
      const loop = () => {
        if (!alive || !stream || !video.videoWidth) { if (alive) requestAnimationFrame(loop); return; }
        const q = G.quality(video, prev); prev = q.gray;
        const msg = q.issue ? t(q.issue) : t('camGood'); if (hint.textContent !== msg) hint.textContent = msg;
        goodFrames = q.issue ? 0 : goodFrames + 1;
        if (goodFrames > 18 && !busy) shoot(false); // CAM-02 auto-capture after ~steady frames, CAM-03 shake tolerance
        setTimeout(() => requestAnimationFrame(loop), 120);
      };
      async function shoot() {
        if (busy) return; busy = true;
        const c = document.createElement('canvas'); c.width = video.videoWidth; c.height = video.videoHeight; c.getContext('2d').drawImage(video, 0, 0);
        alive = false; stopStream();
        crop(c, pages, hashes);
      }
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
        .then(s => { stream = s; video.srcObject = s; loop(); })
        .catch(() => { hint.textContent = t('cameraBlocked'); });
      if (!navigator.mediaDevices) hint.textContent = t('cameraBlocked');
    });
  }

  // CAM-04: crop + straighten with draggable corners
  function crop(canvas, pages, hashes, fromFile) {
    go(root => {
      const pts = G.suggestCorners(canvas);
      const view = h('canvas', { class: 'crop-canvas', role: 'img', 'aria-label': t('cropHint') });
      const maxW = Math.min(window.innerWidth - 32, 700); const sc = maxW / canvas.width;
      view.width = Math.round(canvas.width * sc); view.height = Math.round(canvas.height * sc);
      const ctx = view.getContext('2d');
      const draw = () => {
        ctx.drawImage(canvas, 0, 0, view.width, view.height);
        ctx.strokeStyle = '#1f6fff'; ctx.lineWidth = 3; ctx.beginPath();
        pts.forEach((p, i) => (i ? ctx.lineTo(p.x * sc, p.y * sc) : ctx.moveTo(p.x * sc, p.y * sc))); ctx.closePath(); ctx.stroke();
        pts.forEach(p => { ctx.fillStyle = '#1f6fff'; ctx.beginPath(); ctx.arc(p.x * sc, p.y * sc, 14, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x * sc, p.y * sc, 6, 0, 7); ctx.fill(); });
      };
      let drag = -1;
      const pos = e => { const r = view.getBoundingClientRect(); return { x: (e.clientX - r.left) / sc, y: (e.clientY - r.top) / sc }; };
      view.addEventListener('pointerdown', e => { const p = pos(e); let best = -1, bd = 60 / sc; pts.forEach((q, i) => { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = i; } }); drag = best; view.setPointerCapture(e.pointerId); });
      view.addEventListener('pointermove', e => { if (drag < 0) return; const p = pos(e); pts[drag].x = Math.max(0, Math.min(canvas.width, p.x)); pts[drag].y = Math.max(0, Math.min(canvas.height, p.y)); draw(); });
      view.addEventListener('pointerup', () => { drag = -1; });
      const accept = () => {
        const flat = G.warp(canvas, pts); G.wipe([canvas]);
        const hs = G.ahash(flat);
        if (hashes.some(x => G.sameHash(x, hs))) { C.toast(t('duplicate')); G.wipe([flat]); }
        else { pages.push(flat); hashes.push(hs); }
        if (fromFile) return fromFile(); // file flow continues
        pageChoice(pages);
      };
      root.append(bar(t('cropTitle'), () => { G.wipe([canvas]); pageChoice(pages); }), h('p', { class: 'lead' }, t('cropHint')), h('div', { class: 'crop-wrap' }, view),
        h('div', { class: 'row sticky-actions' }, h('button', { class: 'btn ghost', onclick: () => { const r = G.suggestCorners(canvas); r.forEach((p, i) => { pts[i] = p; }); draw(); } }, t('autoFix')),
          h('button', { class: 'btn primary', onclick: accept }, t('done'))));
      draw();
    });
  }
  function pageChoice(pages) { // CAM-05 multi-page
    if (!pages.length) return camera(pages);
    go(root => {
      root.append(bar(t('pages', { n: pages.length }), home),
        h('div', { class: 'thumbs' }, pages.map((p, i) => { const im = h('img', { alt: t('pages', { n: i + 1 }), src: p.toDataURL('image/jpeg', 0.5) }); return im; })),
        h('div', { class: 'stack' },
          h('button', { class: 'btn big', onclick: () => camera(pages) }, '＋ ' + t('addPage')),
          h('button', { class: 'btn primary big', onclick: () => process(pages) }, t('finish'))));
    });
  }

  async function fromFiles(files) { // CAM-08
    const pages = [], hashes = [];
    const queue = files.slice();
    for (const f of files) if (f.type === 'application/pdf') {
      go(r => r.append(progress([t('reading')])));
      try {
        const pdf = await G.readPdf(f);
        if (pdf.hasText) return finish({ text: pdf.text, lines: pdf.lines, meanConf: 99 }, pdf.canvases); // digital PDF: exact text
        pdf.canvases.forEach(c => pages.push(c));
      } catch (e) { return cantRead('fixShort'); }
      queue.splice(queue.indexOf(f), 1);
    }
    const next = async () => {
      const f = queue.shift(); if (!f) return pages.length ? process(pages) : home();
      try { const c = await G.fileToCanvas(f); crop(c, pages, hashes, next); } catch (e) { next(); }
    };
    next();
  }

  // ---------- processing (PRV-03 visible deletion) ----------
  function progress(items) {
    return h('section', { class: 'progress', role: 'status', 'aria-live': 'polite' }, h('div', { class: 'spinner', 'aria-hidden': 'true' }), h('h1', null, t('reading')),
      h('ol', { class: 'progress-steps' }, items.map(x => h('li', null, x))));
  }
  async function process(pages) {
    const steps = h('ol', { class: 'progress-steps' });
    const addStep = (k, done) => { const li = h('li', { class: done ? 'done' : '' }, (done ? '✓ ' : '… ') + k); steps.appendChild(li); C.announce(k); return li; };
    go(r => r.append(h('section', { class: 'progress', role: 'status' }, h('div', { class: 'spinner', 'aria-hidden': 'true' }), h('h1', null, t('reading')), steps)));
    try {
      const enhanced = pages.map(p => G.enhance(p));
      const qr = pages.flatMap(p => G.readQr(p));
      let st = null;
      const doc = await G.ocrPages(enhanced, (k, i, n) => { if (st) st.className = 'done'; st = addStep(t(k) + (n > 1 ? ' (' + i + '/' + n + ')' : '')); });
      if (st) { st.className = 'done'; st.textContent = '✓ ' + st.textContent.replace(/^… /, ''); }
      G.wipe(enhanced);
      doc.qr = qr;
      addStep(t('stepCheck'), true);
      finish(doc, pages);
    } catch (e) { console.error(e); cantRead('fixShort'); }
  }

  function finish(doc, canvases, sample) {
    const a = R.analyze(doc, { today: new Date(), userName: S().name });
    // CAM-06 "page 3 of 5"
    if (!sample && a.pageInfo && a.pageInfo.of > canvases.length && a.pageInfo.of <= 10) {
      return go(root => root.append(bar(t('appName'), home), h('section', { class: 'card' }, h('h1', null, t('pageOf', { p: a.pageInfo.page, n: a.pageInfo.of })),
        h('div', { class: 'stack' }, h('button', { class: 'btn primary big', onclick: () => camera(canvases) }, t('captureRest')),
          h('button', { class: 'btn big', onclick: () => { a.pageInfo = null; showResult(a, canvases, sample); } }, t('skip'))))));
    }
    showResult(a, canvases, sample);
  }

  function cantRead(fixKey, a) { // CAM-09 guided failure
    go(root => {
      root.append(bar(t('out_cantRead'), home), outcomeCard('cantRead', null),
        h('section', { class: 'card' }, h('h2', null, t('h_cantRead')),
          h('ul', { class: 'fix-list' }, [fixKey, 'fixDark', 'fixBlur', 'fixPart'].filter((v, i, s) => s.indexOf(v) === i).map(k => h('li', null, t(k))))),
        h('div', { class: 'stack' }, h('button', { class: 'btn primary big', onclick: () => camera() }, t('tryAgain'))), disclaimer());
      C.speak([t('out_cantRead'), t(fixKey)], { auto: true });
    });
    void a;
  }

  // ---------- demo (DEM-01) ----------
  function runDemo(d) {
    const r = window.PSDemo.render(d);
    finish({ text: d.text, lines: r.lines, meanConf: 95 }, [r.canvas], true);
  }

  // ---------- result screen ----------
  function outcomeCard(o, a) { // traffic-light signal + the answer in words (never colour alone)
    return h('div', { class: 'outcome o-' + o, role: 'alert' },
      window.PSUI.signal(o),
      h('span', { class: 'o-word' }, h('span', { class: 'o-icon', 'aria-hidden': 'true' }, ICON[o]), t('out_' + o)),
      a ? h('span', { class: 'o-band band-' + a.band }, h('span', { 'aria-hidden': 'true' }, ICON[a.band] + ' '), E.bandText(a)) : null);
  }
  function disclaimer() { return h('p', { class: 'disclaimer', role: 'note' }, t('disclaimer')); }
  function details(title, body, open) { const d = h('details', { class: 'q', open: open }, h('summary', null, title), body); return d; }

  function showResult(a, canvases, sample) {
    const again = !!(current && current.a === a);
    current = { a, canvases, sample, level: 0 };
    const o = a.decision.outcome;
    if (o === 'cantRead') { G.wipe(canvases); return cantRead('fixShort', a); }
    if (!sample && !again) C.count(o, a.signature);
    const shown = a.decision.notSure && o !== 'scam' ? 'notSure' : o;
    if (o === 'scam' && !again) C.alertUser('scam');
    else if (!again) window.PSUI.vibrate(shown);

    go(root => {
      const head = E.headline(a);
      const opening = t('open_' + o);
      const steps = E.steps(a), reasons = E.reasons(a);
      root.append(
        bar(t('appName'), closeResult),
        sample ? h('p', { class: 'sample-badge' }, t('sampleBadge')) : null,
        outcomeCard(shown, a),
        h('p', { class: 'opening' }, opening),
        h('h2', { class: 'headline' }, head), // RES-03 / RES-06 biggest thing
        o === 'scam' ? h('p', { class: 'scam-count' }, E.scamCountLine(a)) : null,
        a.decision.notSure ? h('p', { class: 'notsure' }, t('notSureBody')) : null,
        E.verifyLine(a) ? h('p', { class: 'verify' }, E.verifyLine(a)) : null,
        (o === 'help' || shown === 'notSure') ? h('button', { class: 'btn big help-send', onclick: () => shareFlow(a) }, h('span', { 'aria-hidden': 'true' }, '📤 '), t('share')) : null,
        summaryCard(a),
        h('div', { class: 'see-row' }, h('button', { class: 'btn big', onclick: () => letterView() }, h('span', { 'aria-hidden': 'true' }, '📄 '), t('seeLetter'))),
        playback(a),
        typeConfirm(a),
        a.deadline && a.band !== 'unclear' ? timeline(a) : null,
        h('p', { class: 'ignore' }, h('span', { 'aria-hidden': 'true' }, '❓ '), E.ignoreLine(a)),
        (o === 'scam' || o === 'help') ? dontCard() : null,
        h('section', { class: 'steps-card' }, h('h3', null, '👣 ' + t('steps')), h('ol', null, steps.map(s => h('li', null, s))), window.PSUI.sayBtn(() => [t('steps')].concat(steps))),
        fourQuestions(a),
        whyCard(a, reasons),
        o === 'scam' ? h('section', { class: 'teach' }, h('h3', null, '🎓 ' + t('teach')), h('p', null, E.teachLine(a)), window.PSUI.sayBtn(() => [E.teachLine(a)])) : null,
        notReadCard(a),
        belongsCard(a),
        groundedCard(a),
        understandCard(a),
        actions(a),
        keepCard(a),
        privacyNote(sample),
        disclaimer() // DEC-16
      );
      C.speak([t('out_' + shown), opening, head], { tone: o === 'scam' ? 'serious' : 'calm', auto: true });
    });
  }

  // "Letter summary": who, what, money, date, signature, what to do. Built on the phone from the rules output, no AI.
  function summaryRows(a) {
    const o = a.decision.outcome; const sd = a.sender || {};
    const nm = sd.name ? R.maskText(sd.name, a.sensitive) : '';
    const from = o === 'scam' && nm ? t('senderClaims', { x: nm }) : sd.sure ? nm : nm ? t('senderUnsure') + ' ' + t('senderMaybe', { x: nm }) : t('senderUnsure');
    return [
      ['🏢', t('sum_from'), from],
      ['📄', t('sum_type'), o === 'scam' ? t('out_scam') : t('type_' + a.docType)],
      ['💲', t('sum_money'), E.money(a)],
      ['📅', t('sum_date'), a.band === 'nodate' ? t('sumNoDate') : a.deadline && a.band !== 'unclear' ? t('sumDate', { band: E.bandText(a), date: I.fmtDate(a.deadline) }) : E.bandText(a)],
      ['✍️', t('sum_sign'), a.signature ? t('sumSignYes') : t('sumSignNo')],
      ['✅', t('sum_do'), E.headline(a)]
    ];
  }
  function summaryCard(a) {
    const rows = summaryRows(a);
    return h('section', { class: 'summary card', 'aria-labelledby': 'sum-h' }, h('h3', { id: 'sum-h' }, '🧾 ' + t('sumTitle')),
      h('dl', { class: 'sum-list' }, rows.map(x => [h('dt', null, h('span', { 'aria-hidden': 'true' }, x[0] + ' '), x[1]), h('dd', null, x[2])]).flat()),
      window.PSUI.sayBtn(() => rows.map(x => x[1] + ': ' + x[2]), t('sumListen')));
  }

  // "See the letter": the whole photo, big. The magnifier at the top works on it.
  function letterView() {
    const c = current; if (!c) return home();
    const cv = c.canvases || [];
    if (!cv.length || !cv[0].width || cv[0].width < 5) { C.toast(t('noPhoto')); return; }
    go(root => {
      root.append(bar(t('letterTitle'), () => showResult(c.a, c.canvases, c.sample)),
        h('p', { class: 'muted center' }, t('seeLetterHint')),
        h('div', { class: 'see-row' }, h('button', { class: 'btn', onclick: () => window.PSUI.openLens() }, '🔍 ' + t('magnifierBtn'))),
        h('div', { class: 'letter-pages' }, cv.map((src, i) => {
          const v = h('canvas', { class: 'letter-canvas', role: 'img', 'aria-label': t('letterTitle') + ' ' + (i + 1) + ': ' + R.maskText((c.a.lines || []).filter(l => (l.page || 0) === i).map(l => l.text).join(' '), c.a.sensitive).slice(0, 400) });
          v.width = src.width; v.height = src.height; v.getContext('2d').drawImage(src, 0, 0); return v;
        })),
        h('button', { class: 'btn primary big', onclick: () => showResult(c.a, c.canvases, c.sample) }, '← ' + t('back')));
    });
  }

  // After each result: delete (default) or keep on this phone only.
  function keepCard(a) {
    const box = h('section', { class: 'keep card', 'aria-labelledby': 'keep-h' });
    box.append(h('h3', { id: 'keep-h' }, '🗂️ ' + t('keepTitle')),
      h('div', { class: 'stack' },
        h('button', { class: 'btn primary big', onclick: () => closeResult() }, h('span', { 'aria-hidden': 'true' }, '🗑️ '), t('keepDelete')),
        h('button', { class: 'btn big', onclick: () => saveLetter() }, h('span', { 'aria-hidden': 'true' }, '📱 '), t('keepSave'))),
      h('p', { class: 'muted center' }, t('keepDefault')));
    async function saveLetter() {
      const c = current; if (!c || !window.PSStore) return;
      const shown = a.decision.notSure && a.decision.outcome !== 'scam' ? 'notSure' : a.decision.outcome;
      const images = (c.canvases || []).filter(x => x && x.width > 5).slice(0, 5).map(x => {
        const k = Math.min(1, 1400 / x.width); const d = document.createElement('canvas'); d.width = Math.round(x.width * k); d.height = Math.round(x.height * k);
        d.getContext('2d').drawImage(x, 0, 0, d.width, d.height); return d.toDataURL('image/jpeg', 0.75);
      });
      try {
        await window.PSStore.save({ id: Date.now(), outcome: shown === 'notSure' ? 'help' : shown, headline: E.headline(a), rows: summaryRows(a), images, sample: !!c.sample });
        c.saved = true;
        box.innerHTML = ''; box.append(h('h3', null, '✅ ' + t('keepSave')), h('p', { class: 'keep-ok' }, h('span', { 'aria-hidden': 'true' }, '🔒 '), t('keepLine')),
          h('button', { class: 'btn primary big', onclick: () => { current = null; home(); } }, '🏠 ' + t('done')));
        C.announce(t('keepLine')); C.speak([t('keepLine')]);
      } catch (e) { C.toast(t('noPhoto')); }
    }
    return box;
  }

  function closeResult() {
    if (current) {
      const wasReal = !current.sample && !current.saved; if (!current.saved) G.wipe(current.canvases); current = null;
      home(); if (wasReal) C.toast(t('deleted')); // PRV-03
    } else home();
  }

  function privacyNote(sample) {
    if (sample) return null;
    return h('p', { class: 'privacy-note' }, '🔒 ' + t('neverSent') + ' ' + t('notKept'));
  }

  function playback(a) { // RES-16, RES-17, RES-18
    const all = [t('out_' + a.decision.outcome), t('open_' + a.decision.outcome), E.headline(a), E.bandText(a), E.money(a), E.ignoreLine(a), ...E.steps(a), t('disclaimer')];
    const ask = h('div', { class: 'ask-rest', hidden: true });
    const tone = a.decision.outcome === 'scam' ? 'serious' : 'calm';
    const pp = h('button', { class: 'btn', onclick: () => { if (C.isPaused()) { C.resume(); pp.textContent = '⏸ ' + t('pause'); } else { C.pause(); pp.textContent = '▶ ' + t('play'); } } }, '⏸ ' + t('pause'));
    return h('section', { class: 'playback', 'aria-label': t('play') },
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn primary', onclick: () => C.speak(all, { chunks: true, tone, onAsk: cont => { ask.hidden = false; ask.innerHTML = '';
          ask.append(h('span', null, t('readRest')), h('button', { class: 'btn small', onclick: () => { ask.hidden = true; cont(); } }, t('yes')), h('button', { class: 'btn small ghost', onclick: () => { ask.hidden = true; } }, t('no'))); } }) }, '▶ ' + t('play')),
        pp,
        h('button', { class: 'btn', onclick: () => C.stop() }, '■ ' + t('stop'))),
      ask,
      window.PSUI.speedSlider(),
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn small ghost', onclick: () => C.speak([E.money(a)], { tone }) }, '💲 ' + t('rep_amount')),
        h('button', { class: 'btn small ghost', onclick: () => C.speak([E.bandText(a) + (a.deadline ? ', ' + I.fmtDate(a.deadline) : '')], { tone }) }, '📅 ' + t('rep_deadline')),
        h('button', { class: 'btn small ghost', onclick: () => C.speak([E.headline(a), ...E.steps(a)], { tone }) }, '✅ ' + t('rep_do'))));
  }

  function typeConfirm(a) { // DEC-17 / DEC-18
    const type = a.decision.outcome === 'scam' ? 'scam' : a.docType;
    if (type === 'scam') return h('p', { class: 'type-line' }, TYPE_ICON.scam + ' ' + t('out_scam'));
    const box = h('div', { class: 'type-confirm' });
    const draw = () => {
      box.innerHTML = '';
      box.append(h('p', null, h('span', { 'aria-hidden': 'true' }, TYPE_ICON[a.docType] + ' '), t('typeConfirm', { t: t('type_' + a.docType) })),
        h('div', { class: 'row' }, h('button', { class: 'btn small', onclick: () => { box.innerHTML = ''; box.append(h('p', null, '✓ ' + t('type_' + a.docType))); } }, t('yes')),
          h('button', { class: 'btn small ghost', onclick: () => {
            box.innerHTML = '';
            box.append(h('div', { class: 'chips' }, ['bill', 'insurance', 'gov', 'medical', 'promo', 'other'].map(k => h('button', { class: 'chip', onclick: () => { a.docType = k; box.innerHTML = ''; box.append(h('p', null, '✓ ' + t('type_' + k) + ' — ' + t('typeFixed'))); } }, TYPE_ICON[k] + ' ' + t('type_' + k)))));
          } }, t('no'))));
    };
    draw(); return box;
  }

  function timeline(a) { // RES-22
    const left = Math.max(0, a.daysLeft); const pct = a.band === 'overdue' ? 100 : Math.min(100, Math.max(6, 100 - left * 3));
    return h('section', { class: 'timeline band-' + a.band, 'aria-label': t('timeline') },
      h('div', { class: 'tl-line' }, h('span', { class: 'tl-fill', style: 'width:' + pct + '%' })),
      h('div', { class: 'tl-labels' }, h('span', null, t('tl_today')), h('span', null, E.bandText(a)), h('span', null, t('tl_due') + ' ' + I.fmtDate(a.deadline))));
  }

  function dontCard() { // RES-23, DEC-07
    const ks = ['dont1', 'dont2', 'dont3', 'dont4', 'dont5'];
    return h('section', { class: 'dont' }, h('h3', null, '🚫 ' + t('dontTitle')), h('ul', null, ks.map(k => h('li', null, '✕ ' + t(k)))), window.PSUI.sayBtn(() => [t('dontTitle')].concat(ks.map(k => t(k)))));
  }

  function fourQuestions(a) { // RES-01 / RES-02 fixed order
    const sd = a.sender || {}; const o = a.decision.outcome; const nm = sd.name ? R.maskText(sd.name, a.sensitive) : '';
    const sender = o === 'scam' && nm ? t('senderClaims', { x: nm }) : sd.sure ? nm : t('senderUnsure');
    const signBtn = a.signature ? h('button', { class: 'btn small', onclick: () => evidence('signature') }, t('a_signFound')) : h('p', null, t('a_noSign'));
    return h('section', { class: 'four' },
      details('🏢 ' + t('q_who'), h('div', null, h('p', null, sender), !sd.sure && nm ? h('p', { class: 'muted' }, t('senderMaybe', { x: nm })) : null,
        E.verifyLine(a) ? h('p', { class: 'muted' }, E.verifyLine(a)) : null,
        !sd.sure ? h('button', { class: 'btn small ghost', onclick: () => evidence('sender') }, '🔍 ' + t('senderShow')) : null), true),
      details('✅ ' + t('q_do'), h('p', null, E.headline(a)), true),
      details('💲 ' + t('q_much'), h('div', null, h('p', null, E.money(a)), a.mainAmount ? h('button', { class: 'btn small ghost', onclick: () => evidence('amount') }, '🔍 ' + t('showEvidence')) : null), true),
      details('✍️ ' + t('q_sign'), signBtn, true),
      h('div', { class: 'four-say' }, window.PSUI.sayBtn(() => [t('q_who'), sender, t('q_do'), E.headline(a), t('q_much'), E.money(a), t('q_sign'), a.signature ? t('a_signFound') : t('a_noSign')])));
  }

  function whyCard(a, reasons) { // EVD-03, EVD-04, EVD-05
    const chips = a.decision.checks.filter(c => c.found).map(c => h('button', { class: 'chip ev', onclick: () => evidence(c.id === 'money' ? 'amount' : c.id === 'deadline' ? 'deadline' : c.id === 'signature' ? 'signature' : 'risk') }, t('c_' + c.id)));
    return h('section', { class: 'why' }, h('h3', null, '🔎 ' + t('whyTitle')), h('ul', null, reasons.map(r => h('li', null, r))), window.PSUI.sayBtn(() => [t('whyTitle')].concat(reasons)),
      chips.length ? h('div', { class: 'chips' }, chips) : null,
      details(t('whyNot'), h('ul', { class: 'checks' }, a.decision.checks.map(c => h('li', { class: c.found ? 'found' : 'ok' }, (c.found ? '● ' : '○ ') + t('c_' + c.id) + ': ' + t(c.found ? 'found' : 'notFound')))), false),
      h('button', { class: 'btn', onclick: () => evidence() }, '🔍 ' + t('showEvidence')));
  }

  function notReadCard(a) { // RES-09, RES-10, RES-11
    const f = E.fields(a); const unsure = f.filter(x => x.conf === 'review' || x.conf === 'cantTell');
    return h('section', { class: 'notread' }, h('h3', null, '👀 ' + t('notRead')),
      unsure.length ? null : h('p', null, t('allRead')),
      h('dl', { class: 'conf' }, f.map(x => [h('dt', null, x.label), h('dd', { class: 'c-' + x.conf }, x.text)]).flat()));
  }

  function belongsCard(a) { // RES-04
    if (a.belongs === 'yes' || a.belongs === 'unknown') return null;
    return h('section', { class: 'belongs' }, h('h3', null, t('belongsQ')), h('p', null, a.belongs === 'no' ? t('belongsNo') : t('belongsPartial')));
  }

  function groundedCard(a) { // RES-28
    const ans = h('p', { class: 'answer', 'aria-live': 'polite' });
    const ask = k => { ans.textContent = E.grounded(a, k); C.speak([ans.textContent]); };
    const em = { important: '❗', money: '💲', scam: '🛑', do: '✅' };
    return h('section', { class: 'grounded' }, h('h3', null, '💬 ' + t('grounded')),
      h('div', { class: 'grid2' }, [['important', 'g_important'], ['money', 'g_money'], ['scam', 'g_scam'], ['do', 'g_do']].map(([k, l]) => h('button', { class: 'btn big', onclick: () => ask(k) }, h('span', { 'aria-hidden': 'true' }, em[k] + ' '), t(l)))), ans);
  }

  // "I don't understand": every press tries a different way.
  // 1 simpler words + emoji, 2 read slowly, 3 show the line on the letter, 4 ask someone + send button.
  function understandCard(a) {
    const out = h('div', { class: 'level-out', 'aria-live': 'polite' });
    const o = a.decision.outcome; const shown = a.decision.notSure && o !== 'scam' ? 'notSure' : o;
    const simple = () => [t('simple_' + shown)].concat(o === 'scam' ? [] : E.steps(a).slice(0, 2).map(x => t('simpleStep', { x })));
    const mainEv = () => a.evidence.find(e => e.kind === 'risk') || a.evidence.find(e => e.kind === 'deadline') || a.evidence.find(e => e.kind === 'amount') || a.evidence.find(e => e.kind === 'signature') || a.evidence.find(e => e.kind === 'sender');
    const label = n => h('p', { class: 'level-label' }, h('span', { class: 'level-n', 'aria-hidden': 'true' }, String(n)), t('lvl' + n));
    const btn = h('button', { class: 'btn big', onclick: () => {
      current.level = current.level >= 4 ? 1 : current.level + 1; const n = current.level;
      out.innerHTML = '';
      if (n === 1) {
        const lines = simple();
        out.append(label(1), h('ul', { class: 'simple' }, lines.map(x => h('li', null, x))));
        C.speak(lines);
      } else if (n === 2) {
        const lines = [E.headline(a)].concat(E.steps(a));
        out.append(label(2), h('p', { class: 'level-text' }, '🐢 ' + E.headline(a)), h('button', { class: 'btn small', onclick: () => C.speak(lines, { rate: 0.5 }) }, '🔁 ' + t('replay')));
        C.speak(lines, { rate: 0.5 });
      } else if (n === 3) {
        const ev = mainEv(); out.append(label(3));
        const cv = current.canvases && current.canvases[(ev && ev.page) || 0];
        if (ev && ev.bbox && cv && cv.width > 5) {
          const b = ev.bbox, padY = 14, padX = 10;
          const sx = Math.max(0, b.x0 - padX), sy = Math.max(0, b.y0 - padY), sw = Math.min(cv.width - sx, (b.x1 - b.x0) + padX * 2), sh = Math.min(cv.height - sy, (b.y1 - b.y0) + padY * 2);
          const crop = h('canvas', { class: 'line-crop', role: 'img', 'aria-label': R.maskText(ev.text, a.sensitive) }); crop.width = Math.round(sw); crop.height = Math.round(sh);
          const x = crop.getContext('2d'); x.drawImage(cv, sx, sy, sw, sh, 0, 0, crop.width, crop.height);
          x.lineWidth = 4; x.strokeStyle = '#1A5FD0'; x.strokeRect(2, 2, crop.width - 4, crop.height - 4);
          out.append(h('p', null, t('hereItSays')), crop, h('p', { class: 'level-text' }, '“' + R.maskText(ev.text, a.sensitive) + '”'),
            h('button', { class: 'btn small', onclick: () => evidence(null, true) }, '🔍 ' + t('showEvidence')));
          C.speak([t('hereItSays'), R.maskText(ev.text, a.sensitive)]);
        } else {
          out.append(h('p', { class: 'level-text' }, E.headline(a)), h('button', { class: 'btn small', onclick: () => evidence(null, true) }, '🔍 ' + t('showEvidence')));
          C.speak([E.headline(a)]);
        }
      } else {
        out.append(label(4), h('p', { class: 'level-text' }, '🤝 ' + t('open_help')),
          h('button', { class: 'btn big help-send', onclick: () => shareFlow(a) }, h('span', { 'aria-hidden': 'true' }, '📤 '), t('share')), trustedButtons(a),
          h('p', { class: 'muted' }, t('understandLast')));
        C.speak([t('open_help')]);
      }
      if (n < 4) out.append(h('p', { class: 'muted' }, t('understandNext')));
    } }, '🤔 ' + t('dontUnderstand'));
    return h('section', { class: 'understand' }, btn, out);
  }

  // ---------- actions ----------
  function actions(a) {
    const o = a.decision.outcome;
    return h('section', { class: 'actions' },
      h('button', { class: 'btn primary big' + (o === 'help' ? ' help-send' : ''), onclick: () => shareFlow(a) }, '📤 ' + t('share')),
      trustedButtons(a),
      a.deadline && a.band !== 'overdue' && a.band !== 'unclear' && o !== 'scam' ? reminderBox(a) : null,
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn', onclick: () => snooze(a) }, '⏱ ' + t('later')),
        h('button', { class: 'btn', onclick: () => printLarge(a) }, '🖨 ' + t('print')),
        (o === 'scam' || o === 'help') ? h('button', { class: 'btn', onclick: () => reportScreen(a) }, '🚩 ' + t('report')) : null,
        h('button', { class: 'btn', onclick: () => { C.toast(t('handledDone')); closeResult(); } }, '✓ ' + t('handled'))));
  }
  function trustedButtons(a) { // FAM-08, FAM-09
    const tr = C.state.trusted; if (!tr.length) return h('p', { class: 'muted' }, t('tNone'));
    return h('div', { class: 'trusted-row' }, tr.map(p => h('a', { class: 'btn', href: 'tel:' + p.phone.replace(/[^\d+]/g, '') }, '☎ ' + t('call') + ' ' + p.name)),
      h('button', { class: 'btn ghost', onclick: () => callScript(a) }, '📝 ' + t('callScript')));
  }
  function callScript(a) {
    const box = h('dialog', { class: 'dialog' }, h('h2', null, t('callScript')),
      h('ol', null, ['script1', 'script2', 'script3', 'script4'].map(k => h('li', null, t(k)))),
      h('p', { class: 'headline small' }, E.headline(a)), h('p', null, E.bandText(a)),
      h('button', { class: 'btn primary', onclick: () => { box.close(); box.remove(); } }, t('close')));
    document.body.appendChild(box); box.showModal();
  }
  function reminderBox(a) { // REM-02, REM-03
    const box = h('div', { class: 'reminder' }, h('p', null, t('remind')),
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn', onclick: () => {
          const date = a.deadline.toISOString().slice(0, 10);
          C.state.reminders.push({ id: Date.now(), date, sentence: E.headline(a), handled: false }); C.save();
          box.innerHTML = ''; box.append(h('p', null, '✓ ' + t('reminderSet', { date: I.fmtDate(a.deadline) })));
        } }, t('yes')),
        h('button', { class: 'btn ghost', onclick: () => ics(a) }, '📅 ' + t('addCalendar'))));
    return box;
  }
  function snooze(a) { // REM-04
    const d = new Date(); d.setDate(d.getDate() + 1);
    C.state.reminders.push({ id: Date.now(), date: d.toISOString().slice(0, 10), sentence: E.headline(a), handled: false }); C.save();
    C.toast(t('snoozed'));
  }
  function ics(a) {
    const d = a.deadline; const ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    const pre = new Date(d); pre.setDate(pre.getDate() - 2);
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PaperShield//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@papershield',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + ymd, 'SUMMARY:' + E.headline(a).replace(/[,;]/g, ' '),
      'BEGIN:VALARM', 'TRIGGER:-P2D', 'ACTION:DISPLAY', 'DESCRIPTION:PaperShield', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const blob = new Blob([body], { type: 'text/calendar' }); const url = URL.createObjectURL(blob);
    const link = h('a', { href: url, download: 'deadline.ics' }); document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function printLarge(a) { // ACC-19
    const p = document.getElementById('print'); p.innerHTML = '';
    p.append(h('h1', null, t('out_' + a.decision.outcome)), h('p', { class: 'p-head' }, E.headline(a)), h('p', null, E.bandText(a)), h('p', null, E.money(a)),
      h('ol', null, E.steps(a).map(s => h('li', null, s))), h('p', null, t('disclaimer')));
    window.print();
  }
  function reportScreen(a) { // SCM-15: official reporting routes (websites only)
    const routes = [['FTC — reportfraud.ftc.gov', 'https://reportfraud.ftc.gov'], ['U.S. Postal Inspection Service — uspis.gov', 'https://www.uspis.gov']];
    if (a.agency && a.agency.id === 'ssa') routes.push(['Social Security OIG — oig.ssa.gov', 'https://oig.ssa.gov']);
    if (a.agency && a.agency.id === 'irs') routes.push(['IRS — irs.gov', 'https://www.irs.gov']);
    const box = h('dialog', { class: 'dialog' }, h('h2', null, t('report')),
      h('ul', { class: 'stack' }, routes.map(([l, u]) => h('li', null, h('a', { class: 'btn', href: u, target: '_blank', rel: 'noopener noreferrer' }, l)))),
      h('button', { class: 'btn primary', onclick: () => { box.close(); box.remove(); } }, t('close')));
    document.body.appendChild(box); box.showModal();
  }

  // ---------- share (FAM-01, 03, 04, 05, 06, 10, 11, 12, PRV-08) ----------
  async function shareFlow(a) {
    const tr = C.state.trusted.filter(p => p.consent);
    const box = h('dialog', { class: 'dialog' }); document.body.appendChild(box);
    const close = () => { box.close(); box.remove(); };
    const step = (...kids) => { box.innerHTML = ''; box.append(...kids, h('button', { class: 'btn ghost', onclick: close }, t('cancel'))); };
    let who = tr[0] || null, what = 'summary', mask = true;
    const pickWho = () => step(h('h2', null, t('share')),
      h('div', { class: 'stack' }, tr.map(p => h('button', { class: 'btn big', onclick: () => { who = p; pickWhat(); } }, p.name + ' (' + p.relation + ')')),
        h('button', { class: 'btn', onclick: () => { who = null; pickWhat(); } }, t('viaShare'))));
    const pickWhat = () => {
      const lvl = who ? who.level : 'all';
      const opts = lvl === 'alert' ? ['summary'] : lvl === 'summary' ? ['summary'] : ['summary', 'image', 'both'];
      if (opts.length === 1) { what = lvl === 'alert' ? 'alert' : 'summary'; return pickMask(); }
      step(h('h2', null, t('sendWhat')), h('div', { class: 'stack' }, opts.map(k => h('button', { class: 'btn big', onclick: () => { what = k; pickMask(); } }, t('send_' + k)))));
    };
    const pickMask = () => {
      if (!a.sensitive.length) return confirm();
      step(h('h2', null, t('hideSensitive', { n: a.sensitive.length })), h('div', { class: 'stack' },
        h('button', { class: 'btn primary big', onclick: () => { mask = true; confirm(); } }, t('hideYes')),
        h('button', { class: 'btn big', onclick: () => { mask = false; confirm(); } }, t('hideNo'))));
    };
    const confirm = () => {
      const msg = E.summary(a, { name: who ? who.name : '', mask, level: what === 'alert' ? 'alert' : 'full' });
      step(h('h2', null, t('confirmSend', { name: who ? who.name : '…' })), h('p', null, t('sendTrustedReady')), h('pre', { class: 'preview' }, msg),
        h('div', { class: 'stack' },
          who ? h('a', { class: 'btn primary big', target: '_blank', rel: 'noopener noreferrer', href: 'https://wa.me/' + who.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent(msg), onclick: () => done() }, t('viaWhatsApp')) : null,
          who ? h('a', { class: 'btn big', href: 'sms:' + who.phone.replace(/[^\d+]/g, '') + '?&body=' + encodeURIComponent(msg), onclick: () => done() }, t('viaSms')) : null,
          !who ? h('p', null, t('sendNoPerson')) : null,
          !who ? h('a', { class: 'btn primary big', href: 'sms:?&body=' + encodeURIComponent(msg), onclick: () => done() }, '💬 ' + t('viaSms')) : null,
          !who ? h('a', { class: 'btn big', target: '_blank', rel: 'noopener noreferrer', href: 'https://wa.me/?text=' + encodeURIComponent(msg), onclick: () => done() }, '🟢 ' + t('viaWhatsApp')) : null,
          h('button', { class: 'btn big', onclick: () => nativeShare(msg) }, '📤 ' + t('viaShare')),
          h('p', { class: 'muted' }, t('replyHint'))));
    };
    const done = () => { C.toast(t('sent')); setTimeout(close, 400); };
    const nativeShare = async msg => {
      try {
        const data = { title: 'PaperShield', text: what === 'image' ? '' : msg };
        if ((what === 'image' || what === 'both') && current && current.canvases[0]) {
          const blob = await new Promise(r => current.canvases[0].toBlob(r, 'image/jpeg', 0.85));
          const file = new File([blob], 'letter.jpg', { type: 'image/jpeg' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
        }
        if (navigator.share) { await navigator.share(data); done(); }
        else { await navigator.clipboard.writeText(msg); C.toast(t('sent')); }
      } catch (e) { /* user cancelled */ }
    };
    box.showModal();
    if (!tr.length) { who = null; pickWhat(); } else if (tr.length === 1) pickWhat(); else pickWho();
  }

  // ---------- evidence screen (EVD-01, 02, 06, 07, 08, RES-33, RES-34) ----------
  function evidence(kind, autoFirst) {
    const a = current.a; const cv = current.canvases;
    let evs = a.evidence.filter(e => !kind || e.kind === kind); if (!evs.length) evs = a.evidence;
    if (!cv || !cv.length || !cv[0].width || cv[0].width < 5) { C.toast(t('deleted')); return; }
    const colors = { deadline: '#1A5FD0', amount: '#1C6E40', signature: '#6A3FA0', risk: '#B42318', sender: '#7A5A00' };
    let page = (evs[0] && evs[0].page) || 0;
    const view = h('canvas', { class: 'ev-canvas', role: 'img', 'aria-label': evs.map(e => e.text).join('. ') });
    const lens = h('canvas', { class: 'lens', width: 260, height: 120, hidden: true, 'aria-hidden': 'true' });
    const list = h('ul', { class: 'ev-list' });
    const draw = () => {
      const src = cv[page]; const maxW = Math.min(window.innerWidth - 24, 900); const sc = maxW / src.width;
      view.width = Math.round(src.width * sc); view.height = Math.round(src.height * sc); view._sc = sc;
      const x = view.getContext('2d'); x.drawImage(src, 0, 0, view.width, view.height);
      const mine = a.evidence.filter(e => (e.page || 0) === page && e.bbox);
      mine.forEach(e => { const b = e.bbox; x.lineWidth = 4; x.strokeStyle = colors[e.kind] || '#333'; x.strokeRect(b.x0 * sc, b.y0 * sc, (b.x1 - b.x0) * sc, (b.y1 - b.y0) * sc); });
    };
    go(root => {
      const pager = cv.length > 1 ? h('div', { class: 'row wrap' }, cv.map((_, i) => h('button', { class: 'btn small', 'aria-pressed': i === page, onclick: () => { page = i; draw(); } }, t('pages', { n: i + 1 })))) : null;
      evs = evs.filter((e, i) => evs.findIndex(x => x.line === e.line) === i);
      evs.forEach(e => list.appendChild(h('li', null, h('button', { class: 'ev-item k-' + e.kind, onclick: () => focusLine(e) },
        h('span', { class: 'ev-dot', style: 'background:' + (colors[e.kind] || '#333') }), R.maskText(e.text, a.sensitive)))));
      root.append(bar(t('showEvidence'), () => showBack()),
        h('p', { class: 'lead' }, h('strong', null, E.headline(a))),
        pager, h('div', { class: 'ev-wrap' }, view, lens), list);
      draw();
      // RES-33 / RES-34 magnifier that reads the line under the finger
      if (S().magnifier) {
        const lx = lens.getContext('2d'); let lastLine = -1;
        view.addEventListener('pointermove', ev => {
          if (ev.pointerType === 'mouse' && !ev.buttons) { lens.hidden = true; return; }
          const r = view.getBoundingClientRect(); const px = (ev.clientX - r.left) / view._sc, py = (ev.clientY - r.top) / view._sc;
          lens.hidden = false; lens.style.left = Math.max(0, ev.clientX - r.left - 130) + 'px'; lens.style.top = Math.max(0, ev.clientY - r.top - 160) + 'px';
          lx.fillStyle = '#fff'; lx.fillRect(0, 0, 260, 120); lx.drawImage(cv[page], px - 65, py - 30, 130, 60, 0, 0, 260, 120);
          if (S().readUnder) {
            const li = a.lines.findIndex(l => (l.page || 0) === page && l.bbox && py >= l.bbox.y0 && py <= l.bbox.y1);
            if (li >= 0 && li !== lastLine) { lastLine = li; C.speak([R.maskText(a.lines[li].text, a.sensitive)], { auto: true }); }
          }
        });
        view.addEventListener('pointerup', () => { lens.hidden = true; });
        view.addEventListener('pointerleave', () => { lens.hidden = true; });
      }
      if (evs[0]) focusLine(evs[0], !autoFirst);
    });
    function focusLine(e, silent) { // EVD-02 / EVD-08
      if ((e.page || 0) !== page) { page = e.page || 0; draw(); }
      if (e.bbox) { const y = e.bbox.y0 * view._sc; view.parentElement.scrollTo({ top: Math.max(0, y - 80), behavior: 'smooth' }); view.scrollIntoView({ block: 'nearest' }); }
      if (!silent) C.speak([t('hereItSays'), R.maskText(e.text, a.sensitive)]);
    }
    function showBack() { const c = current; showResult(c.a, c.canvases, c.sample); }
  }

  // ---------- settings (ACC-02, ACC-06, ACC-07, ACC-10, PRV-09, FAM-11, FAM-12) ----------
  function settings() {
    go(root => {
      const s = S();
      const sel = (key, opts, labelKey, obj) => { obj = obj || s; const el = h('select', { onchange: e => { obj[key] = e.target.value; C.save(); applySettings(); } }, opts.map(o => h('option', { value: o[0] }, o[1]))); el.value = obj[key]; return h('label', { class: 'field' }, t(labelKey), el); };
      const chk = (key, labelKey, obj) => { obj = obj || s; return h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !!obj[key], onchange: e => { obj[key] = e.target.checked; C.save(); applySettings(); } }), ' ' + t(labelKey)); };
      const voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(v => v.lang && v.lang.toLowerCase().startsWith(s.lang));
      root.append(bar(t('settings'), home),
        h('section', { class: 'card' },
          h('label', { class: 'field' }, t('setName'), h('input', { type: 'text', value: s.name, oninput: e => { s.name = e.target.value.trim(); C.save(); } })),
          h('label', { class: 'field' }, t('setLang'), langSelect(() => { applySettings(); settings(); }))),
        h('section', { class: 'card' }, profilePicker(),
          sel('theme', [['system', t('theme_system')], ['light', t('theme_light')], ['dark', t('theme_dark')]], 'theme'),
          chk('invert', 'invert'),
          h('label', { class: 'field' }, t('brightness'), h('input', { type: 'range', min: 70, max: 120, value: s.brightness, oninput: e => { s.brightness = +e.target.value; C.save(); applySettings(); } })),
          chk('oneHand', 'oneHand'), chk('magnifier', 'magnifier'), chk('readUnder', 'readUnder')),
        h('section', { class: 'card' },
          window.PSUI.speedSlider(),
          voices.length ? sel('voice', [['', '—']].concat(voices.map(v => [v.name, v.name])), 'setVoice') : null,
          chk('toneMatch', 'toneMatch'),
          h('button', { class: 'btn', onclick: () => C.speak([t('tagline')]) }, '🔊 ' + t('play')),
          h('fieldset', null, h('legend', null, t('setAlerts')), chk('sound', 'alert_sound', s.alerts), chk('vibrate', 'alert_vibrate', s.alerts), chk('flash', 'alert_flash', s.alerts),
            h('button', { class: 'btn small', onclick: () => C.alertUser('scam') }, '▶ ' + t('play')))),
        h('section', { class: 'card' }, h('h2', null, t('trustedTitle')), trustedEditor(false)),
        h('section', { class: 'card' }, h('h2', null, t('familyReport')), h('p', null, familyText()),
          h('button', { class: 'btn', onclick: () => { const m = familyText(); if (navigator.share) navigator.share({ text: m }).catch(() => {}); else navigator.clipboard.writeText(m).then(() => C.toast(t('sent'))); } }, '📤 ' + t('share'))),
        h('section', { class: 'card' }, h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: true, disabled: true }), ' ' + t('noImprove')), h('p', { class: 'muted' }, t('noImproveNote')),
          h('button', { class: 'link', onclick: privacyScreen }, t('privacy'))),
        h('section', { class: 'card danger' }, h('button', { class: 'btn danger', onclick: async () => { if (await C.confirmBox(t('resetConfirm'), t('resetAll'))) { C.reset(); if (window.PSStore) await window.PSStore.clear().catch(() => {}); applySettings(); onboarding(); } } }, t('resetAll'))));
    });
  }
  function familyText() { const st = C.monthStats(); return t('reportText', { n: st.docs, s: st.sign, c: st.scam }); }

  function trustedEditor(inOnboarding) { // FAM-02, FAM-11, FAM-12, FAM-16
    const box = h('div', { class: 'trusted-edit' });
    const draw = () => {
      box.innerHTML = '';
      C.state.trusted.forEach((p, i) => box.appendChild(h('div', { class: 'person' },
        h('p', null, h('strong', null, p.name), ' — ' + p.relation + ' — ' + p.phone + ' — ' + t('lvl_' + p.level)),
        h('button', { class: 'btn small ghost', onclick: () => { const removed = C.state.trusted.splice(i, 1)[0]; C.save(); draw(); C.toast(t('tRemove') + ': ' + removed.name, () => { C.state.trusted.splice(i, 0, removed); C.save(); draw(); }); } }, t('tRemove')))));
      if (C.state.trusted.length >= 3) return;
      const name = h('input', { type: 'text', autocomplete: 'off' }), phone = h('input', { type: 'tel', autocomplete: 'off', inputmode: 'tel' });
      const rel = h('input', { type: 'text', list: 'rels' }), consent = h('input', { type: 'checkbox' });
      const lvl = h('select', null, ['all', 'summary', 'alert'].map(k => h('option', { value: k }, t('lvl_' + k))));
      box.append(h('datalist', { id: 'rels' }, ['Daughter', 'Son', 'Friend', 'Caregiver', 'Hija', 'Hijo', 'Amigo/a', t('seniorCenter')].map(v => h('option', { value: v }))),
        h('label', { class: 'field' }, t('tName'), name), h('label', { class: 'field' }, t('tPhone'), phone), h('label', { class: 'field' }, t('tRelation'), rel),
        h('label', { class: 'field' }, t('tLevel'), lvl), h('label', { class: 'check' }, consent, ' ' + t('tConsent')),
        h('button', { class: 'btn', onclick: () => {
          if (!name.value.trim() || phone.value.replace(/\D/g, '').length < 7 || !consent.checked) { C.toast(t('tConsent')); return; }
          C.state.trusted.push({ name: name.value.trim(), phone: phone.value.trim(), relation: rel.value.trim() || '—', level: lvl.value, consent: true }); C.save(); draw();
        } }, '＋ ' + t('tAdd')));
    };
    draw(); void inOnboarding; return box;
  }

  // ---------- info screens ----------
  function howItDecides() { // DEC-05 published table, SCM-03 published lists, EVD-09
    go(root => {
      const rows = R.TABLE.map(r => h('tr', null, h('td', null, r.id), h('td', null, ruleText(r.when)), h('td', null, h('span', { class: 'pill o-' + r.outcome }, ICON[r.outcome] + ' ' + t('out_' + r.outcome)))));
      root.append(bar(t('help'), home),
        h('section', { class: 'card' }, h('p', { class: 'lead' }, I.getLang() === 'es' ? 'PaperShield lee las palabras en su teléfono. Luego reglas fijas deciden. La misma carta siempre da el mismo resultado.' : 'PaperShield reads the words on your phone. Then fixed rules decide. The same letter always gets the same result.'),
          h('img', { src: 'assets/architecture.svg', alt: 'Photo → text reader → facts → rule check → scam signs → result → evidence', class: 'diagram' })),
        h('section', { class: 'card' }, h('h2', null, I.getLang() === 'es' ? 'La tabla de decisión (en orden)' : 'The decision table (checked in order)'),
          h('div', { class: 'scroll-x' }, h('table', { class: 'rules' }, h('tbody', null, rows)))),
        h('section', { class: 'card' }, h('h2', null, I.getLang() === 'es' ? 'Palabras que revisamos' : 'Words we look for'),
          h('h3', null, t('c_payment')), h('p', null, R.LISTS.payment.join(', ')),
          h('h3', null, t('c_urgency')), h('p', null, R.LISTS.urgency.join(', ')),
          h('h3', null, I.getLang() === 'es' ? 'Frases de estafa' : 'Scam phrases'), h('p', null, R.LISTS.phrases.join(', ')),
          h('h3', null, t('c_ssn')), h('p', null, R.LISTS.ssn.join(', '))),
        disclaimer());
    });
  }
  function ruleText(k) {
    const en = { unreadable: 'Not enough readable words', strongSign: 'Any strong scam sign (unusual payment, SSN request, unofficial link)', twoOrMoreSigns: 'Two or more scam signs', oneSign: 'Exactly one scam sign',
      signature: 'A signature is required', overdueWithMoney: 'Money owed and the deadline has passed', deadlineUnclearWithMoney: 'Money owed and the date cannot be read for sure', oweMoney: 'Money owed', deadline: 'A deadline', moneyUnclear: 'An amount, but unclear who pays', nothing: 'None of the above' };
    const es = { unreadable: 'No hay suficientes palabras legibles', strongSign: 'Cualquier señal fuerte (pago inusual, pide Seguro Social, enlace no oficial)', twoOrMoreSigns: 'Dos o más señales de estafa', oneSign: 'Exactamente una señal',
      signature: 'Requiere firma', overdueWithMoney: 'Debe dinero y la fecha ya pasó', deadlineUnclearWithMoney: 'Debe dinero y la fecha no se lee bien', oweMoney: 'Debe dinero', deadline: 'Tiene fecha límite', moneyUnclear: 'Hay una cantidad pero no se sabe quién paga', nothing: 'Ninguna de las anteriores' };
    return (I.getLang() === 'es' ? es : en)[k];
  }
  function glossaryScreen() {
    go(root => { const g = I.glossary[I.getLang()] || I.glossary.en;
      root.append(bar(t('glossary'), home), h('dl', { class: 'gloss-list card' }, Object.keys(g).sort().map(k => [h('dt', null, k), h('dd', null, g[k])]).flat())); });
  }
  function privacyScreen() { // PRV-01, PRV-02, PRV-05, PRV-09
    go(root => root.append(bar(t('privacy'), home), h('section', { class: 'card' },
      h('p', { class: 'lead' }, t('neverSent')), h('h2', null, t('keptTitle')), h('ul', null, ['kept1', 'kept2', 'kept3', 'kept4', 'kept5'].map(k => h('li', null, t(k)))),
      h('p', null, t('notKept')), h('p', null, t('noAccount')), h('p', null, t('noImproveNote')),
      h('p', { class: 'muted' }, I.getLang() === 'es' ? 'La foto existe solo en la memoria mientras la pantalla de resultado está abierta. Al cerrarla, se borra.' : 'The photo exists only in memory while the result screen is open. When you close it, it is wiped.'),
      h('a', { class: 'btn', href: 'privacy.html' }, I.getLang() === 'es' ? 'Política de privacidad completa' : 'Full privacy policy'))));
  }
  function a11yScreen() { go(root => root.append(bar(t('accessibility'), home), h('section', { class: 'card' }, h('p', null, I.getLang() === 'es' ? 'Lea lo que realmente probamos:' : 'Read what we actually tested:'), h('a', { class: 'btn', href: 'accessibility.html' }, t('accessibility'))))); }
  function aboutScreen() { go(root => root.append(bar(t('about'), home), h('section', { class: 'card' }, h('p', { class: 'lead' }, t('tagline')), h('p', null, t('welcomeBody')), h('a', { class: 'btn', href: 'about.html' }, t('about'))))); }

  // ---------- boot ----------
  applySettings();
  window.PSUI.initTools();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
  if (S().onboarded) home(); else onboarding();
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  // Warm up the reader in the background after first paint (downloads once, then cached offline)
  setTimeout(() => { if (S().onboarded) G.getWorker().catch(() => {}); }, 2500);
})();
