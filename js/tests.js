/* Pilot test harness: TST-03 targets, TST-04/05 headline numbers, TST-06 field accuracy, TST-07 correct "can't read", TST-11 error gallery. */
(function () {
  'use strict';
  const G = window.PSEngine, R = window.PSRules, h = window.PSCore.h; window.PSi18n.setLang('en');
  const TARGETS = { classification: 0.9, scamsCaught: 1.0, falsePositivesMax: 2, cantReadCorrect: 1.0 };
  const $ = id => document.getElementById(id);
  $('template').onclick = () => {
    const blob = new Blob(['file,outcome,amount,deadline,unreadable\nletter01.jpg,action,45.50,2026-10-14,no\n'], { type: 'text/csv' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'answer-sheet.csv' }); document.body.appendChild(a); a.click(); a.remove();
  };
  function parseCsv(text) {
    const rows = text.trim().split(/\r?\n/).map(l => l.split(',').map(x => x.trim()));
    const head = rows.shift().map(x => x.toLowerCase()); return rows.map(r => Object.fromEntries(head.map((k, i) => [k, r[i] || ''])));
  }
  async function readOne(f) {
    if (f.type === 'application/pdf') {
      const pdf = await G.readPdf(f);
      if (pdf.hasText) return { doc: { text: pdf.text, lines: pdf.lines, meanConf: 99 }, canvases: pdf.canvases };
      const doc = await G.ocrPages(pdf.canvases.map(c => G.enhance(c))); return { doc, canvases: pdf.canvases };
    }
    const c = await G.fileToCanvas(f); const doc = await G.ocrPages([G.enhance(c)]); doc.qr = G.readQr(c); return { doc, canvases: [c] };
  }
  $('run').onclick = async () => {
    const csvF = $('csv').files[0], files = [...$('docs').files];
    if (!csvF || !files.length) { $('status').textContent = 'Choose the answer sheet and the documents first.'; return; }
    const truth = parseCsv(await csvF.text()); const byName = Object.fromEntries(truth.map(r => [r.file, r]));
    const today = $('today').value ? new Date($('today').value + 'T12:00:00') : new Date();
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i]; $('status').textContent = 'Reading ' + (i + 1) + ' of ' + files.length + ': ' + f.name;
      const exp = byName[f.name]; if (!exp) { results.push({ file: f.name, error: 'not in answer sheet' }); continue; }
      try {
        const { doc, canvases } = await readOne(f);
        const a = R.analyze(doc, { today });
        const thumb = canvases[0].toDataURL('image/jpeg', 0.4); G.wipe(canvases);
        const got = a.decision.outcome;
        const amtGot = a.mainAmount ? a.mainAmount.value.toFixed(2) : '';
        const dGot = a.deadline && a.band !== 'unclear' ? a.deadline.toISOString().slice(0, 10) : '';
        results.push({ file: f.name, exp, got, notSure: a.decision.notSure, rule: a.decision.rule, amtGot, dGot, signals: a.signals.map(s => s.id).join(' '), thumb,
          okClass: exp.unreadable === 'yes' ? got === 'cantRead' : got === exp.outcome,
          okAmt: (exp.amount || '') === amtGot || (exp.amount && amtGot && Math.abs(+exp.amount - +amtGot) < 0.005),
          okDate: (exp.deadline || '') === dGot });
      } catch (e) { results.push({ file: f.name, error: String(e) }); }
    }
    $('status').textContent = 'Done.'; report(results);
  };
  function pct(n, d) { return d ? Math.round((n / d) * 100) + '%' : '—'; }
  function report(rs) {
    const ok = rs.filter(r => !r.error), readable = ok.filter(r => r.exp.unreadable !== 'yes');
    const scams = readable.filter(r => r.exp.outcome === 'scam'), legit = readable.filter(r => r.exp.outcome !== 'scam');
    const missed = scams.filter(r => r.got !== 'scam'), falsePos = legit.filter(r => r.got === 'scam');
    const unread = ok.filter(r => r.exp.unreadable === 'yes'), unreadOk = unread.filter(r => r.got === 'cantRead');
    const cls = ok.filter(r => r.okClass).length;
    const amtRows = readable.filter(r => r.exp.amount), dateRows = readable.filter(r => r.exp.deadline);
    const line = (label, value, pass) => h('tr', null, h('td', null, label), h('td', null, value), h('td', null, pass == null ? '' : pass ? '✓ meets target' : '✕ below target'));
    const out = $('out'); out.innerHTML = '';
    out.append(h('h2', null, 'Results — an initial pilot on ' + ok.length + ' documents'),
      h('p', null, 'This is an initial pilot, not proof. Small samples can change a lot with a few more documents. (TST-12)'),
      h('table', null, h('tbody', null,
        line('Missed scams (scams called safe) — headline', missed.length + ' of ' + scams.length, missed.length === 0),
        line('False alarms (real letters called scams) — headline', falsePos.length + ' of ' + legit.length, falsePos.length <= TARGETS.falsePositivesMax),
        line('Correct result', cls + ' of ' + ok.length + ' (' + pct(cls, ok.length) + ')', ok.length ? cls / ok.length >= TARGETS.classification : null),
        line('Amount read correctly', amtRows.filter(r => r.okAmt).length + ' of ' + amtRows.length, null),
        line('Deadline read correctly', dateRows.filter(r => r.okDate).length + ' of ' + dateRows.length, null),
        line('Correctly said “I can’t read this”', unreadOk.length + ' of ' + unread.length, unread.length ? unreadOk.length === unread.length : null),
        line('Errors while reading', String(rs.filter(r => r.error).length), null))),
      h('h2', null, 'Every document'),
      h('div', { class: 'scroll-x' }, h('table', null, h('tbody', null,
        h('tr', null, ['File', 'Expected', 'Got', 'Rule', 'Amount (exp/got)', 'Deadline (exp/got)', 'Signals'].map(x => h('th', null, x))),
        rs.map(r => r.error ? h('tr', null, h('td', null, r.file), h('td', { colspan: 6 }, '✕ ' + r.error)) :
          h('tr', null, h('td', null, r.file), h('td', null, r.exp.unreadable === 'yes' ? 'cantRead' : r.exp.outcome), h('td', null, (r.okClass ? '✓ ' : '✕ ') + r.got + (r.notSure ? ' (not sure)' : '')),
            h('td', null, r.rule), h('td', null, (r.okAmt ? '✓ ' : '✕ ') + (r.exp.amount || '—') + ' / ' + (r.amtGot || '—')), h('td', null, (r.okDate ? '✓ ' : '✕ ') + (r.exp.deadline || '—') + ' / ' + (r.dGot || '—')), h('td', null, r.signals)))))),
      h('h2', null, 'Error gallery (TST-11)'), h('p', null, 'Every document the app got wrong. Use these slides to show where it struggled and what you changed.'),
      h('div', { class: 'thumbs' }, ok.filter(r => !r.okClass || !r.okAmt || !r.okDate).map(r => h('figure', null, h('img', { src: r.thumb, alt: r.file }), h('figcaption', null, r.file + ': expected ' + r.exp.outcome + ', got ' + r.got)))),
      h('button', { class: 'btn', onclick: () => download(rs) }, 'Download results (CSV)'));
  }
  function download(rs) {
    const rows = [['file', 'expected', 'got', 'not_sure', 'rule', 'amount_expected', 'amount_got', 'deadline_expected', 'deadline_got', 'signals', 'correct']]
      .concat(rs.filter(r => !r.error).map(r => [r.file, r.exp.outcome, r.got, r.notSure, r.rule, r.exp.amount, r.amtGot, r.exp.deadline, r.dGot, r.signals, r.okClass]));
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'pilot-results.csv' }); document.body.appendChild(a); a.click(); a.remove();
  }
})();
