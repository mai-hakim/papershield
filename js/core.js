/* Storage (on this phone only — PRV-02, PRV-04), speech (RES-16..18, ACC-07, ACC-09), alerts (ACC-10). */
(function (root) {
  'use strict';
  const KEY = 'papershield.v1';
  const DEFAULTS = {
    settings: {
      name: '', lang: (navigator.language || 'en').slice(0, 2) === 'es' ? 'es' : 'en', profile: 'standard',
      speed: 'slow', speedStep: 1, muted: false, theme: 'system', invert: false, brightness: 100, toneMatch: true,
      alerts: { sound: true, vibrate: true, flash: false }, oneHand: true, magnifier: true, readUnder: true,
      age: '', onboarded: false, voice: ''
    },
    trusted: [], reminders: [], stats: {}
  };
  let state = load();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s) {
        // old speed names -> the 5-step slider (turtle .. rabbit)
        if (s.settings && s.settings.speedStep == null && s.settings.speed) s.settings.speedStep = { vslow: 0, slow: 1, normal: 3, fast: 4 }[s.settings.speed] ?? 1;
        return deepMerge(JSON.parse(JSON.stringify(DEFAULTS)), s);
      }
    } catch (e) { /* storage blocked */ }
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
  function deepMerge(a, b) { Object.keys(b || {}).forEach(k => { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k]) a[k] = deepMerge(a[k], b[k]); else a[k] = b[k]; }); return a; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } state = JSON.parse(JSON.stringify(DEFAULTS)); }

  function monthKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function count(outcome, signature) { // only counts, never content (PRV-04)
    const k = monthKey(); const s = state.stats[k] || { docs: 0, help: 0, sign: 0, scam: 0 };
    s.docs++; if (outcome === 'help' || outcome === 'scam') s.help++; if (signature) s.sign++; if (outcome === 'scam') s.scam++;
    state.stats[k] = s; save();
  }
  function monthStats() { return state.stats[monthKey()] || { docs: 0, help: 0, sign: 0, scam: 0 }; }

  // ---------- speech ----------
  const synth = root.speechSynthesis;
  // 5 steps, turtle to rabbit. Default is step 1 (0.62): slower than the old default (0.75).
  const STEPS = [0.5, 0.62, 0.75, 0.9, 1.1];
  const rateNow = () => STEPS[Math.max(0, Math.min(4, state.settings.speedStep ?? 1))];
  let queue = [], idx = 0, chunkMode = false, onAsk = null, toneNow = 'calm', paused = false;
  function pickVoice() {
    if (!synth) return null; const lang = root.PSi18n.getLang() === 'es' ? 'es' : 'en';
    const vs = synth.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith(lang));
    return vs.find(v => v.name === state.settings.voice) || vs.find(v => /natural|enhanced|premium/i.test(v.name)) || vs[0] || null;
  }
  function utter(text, tone) {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if (v) u.voice = v; u.lang = root.PSi18n.getLang() === 'es' ? 'es-US' : 'en-US';
    let rate = rateNow(), pitch = 1;
    if (state.settings.toneMatch) { if (tone === 'serious') { pitch = 0.85; rate *= 0.95; } else if (tone === 'calm') pitch = 1.05; }
    if (rateOnce) rate = rateOnce;
    u.rate = rate; u.pitch = pitch; return u;
  }
  // opts.auto: spoken without a tap (result opens, alerts). The mute icon stops these, never a tap.
  // opts.rate: one-off speed (e.g. "read slowly").
  let rateOnce = null;
  function speak(parts, opts) {
    if (!synth) return false; opts = opts || {};
    if (!opts.auto && synth.getVoices && synth.getVoices().length === 0 && speak.noVoices) return false; // known: this device has no voice
    if (opts.auto && state.settings.muted) return false;
    rateOnce = opts.rate || null;
    stop(); queue = [].concat(parts).filter(Boolean); idx = 0; chunkMode = !!opts.chunks; onAsk = opts.onAsk || null; toneNow = opts.tone || 'calm';
    playNext(); return true;
  }
  function playNext() {
    if (idx >= queue.length) { root.PSCore.onSpeechEnd && root.PSCore.onSpeechEnd(); return; }
    const u = utter(queue[idx], toneNow);
    u.onend = () => {
      idx++;
      // RES-18: after 3 sentences, pause and ask before reading the rest
      if (chunkMode && idx === 3 && idx < queue.length && onAsk) { onAsk(() => setTimeout(playNext, 300)); return; }
      setTimeout(playNext, chunkMode ? 650 : 250);
    };
    synth.speak(u);
  }
  function pause() { if (synth && synth.speaking) { synth.pause(); paused = true; } }
  function resume() { if (synth && paused) { synth.resume(); paused = false; } }
  if (synth && synth.getVoices) { const chk = () => { speak.noVoices = synth.getVoices().length === 0; }; chk(); if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', chk); setTimeout(chk, 1500); }
  function stop() { if (synth) synth.cancel(); queue = []; paused = false; }
  function isPaused() { return paused; }

  // ---------- alerts (ACC-10) ----------
  let audio = null;
  function alertUser(kind) {
    const a = state.settings.alerts;
    if (a.vibrate && navigator.vibrate) navigator.vibrate(kind === 'scam' ? [300, 150, 300, 150, 300] : [200]);
    if (a.sound) {
      try {
        audio = audio || new (root.AudioContext || root.webkitAudioContext)();
        const o = audio.createOscillator(), g = audio.createGain(); o.connect(g); g.connect(audio.destination);
        o.frequency.value = kind === 'scam' ? 440 : 660; g.gain.setValueAtTime(0.0001, audio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.3, audio.currentTime + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.6);
        o.start(); o.stop(audio.currentTime + 0.65);
      } catch (e) { /* no audio */ }
    }
    if (a.flash) {
      const f = document.createElement('div'); f.className = 'flash ' + kind; document.body.appendChild(f);
      setTimeout(() => f.remove(), 900);
    }
  }

  // ---------- DOM helpers ----------
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === 'class') el.className = v; else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v; else if (k === 'style') el.style.cssText = v; else el.setAttribute(k, v === true ? '' : v);
    });
    kids.flat().forEach(k => { if (k == null || k === false) return; el.appendChild(typeof k === 'string' || typeof k === 'number' ? document.createTextNode(String(k)) : k); });
    return el;
  }
  function announce(msg) { const r = document.getElementById('live'); if (r) { r.textContent = ''; setTimeout(() => { r.textContent = msg; }, 50); } }
  let toastTimer = null;
  function toast(msg, undoFn) { // ACC-21 undo window
    const t = document.getElementById('toast'); t.innerHTML = ''; t.appendChild(h('span', null, msg));
    if (undoFn) t.appendChild(h('button', { class: 'btn small', onclick: () => { undoFn(); t.hidden = true; } }, root.PSi18n.t('undo')));
    t.hidden = false; announce(msg); clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, undoFn ? 7000 : 4000);
  }
  function confirmBox(msg, okLabel) { // ACC-21 confirmation on destructive taps
    return new Promise(res => {
      const t = root.PSi18n.t; const d = h('dialog', { class: 'dialog', 'aria-labelledby': 'dlg-msg' },
        h('p', { id: 'dlg-msg', class: 'dlg-msg' }, msg),
        h('div', { class: 'row' },
          h('button', { class: 'btn ghost', onclick: () => { d.close(); d.remove(); res(false); } }, t('cancel')),
          h('button', { class: 'btn primary', onclick: () => { d.close(); d.remove(); res(true); } }, okLabel || t('continue'))));
      document.body.appendChild(d); d.showModal();
    });
  }

  root.PSCore = {
    get state() { return state; }, save, reset, count, monthStats,
    speak, pause, resume, stop, isPaused, SPEED_STEPS: STEPS, speechOK: !!synth, alertUser, h, announce, toast, confirmBox, onSpeechEnd: null
  };
})(window);
