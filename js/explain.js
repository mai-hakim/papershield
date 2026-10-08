/* Builds every sentence on the result screen from the rules output. Pure function: same input, same words. */
(function (root) {
  'use strict';
  const I = () => root.PSi18n;

  function outcomeOf(a) {
    const d = a.decision;
    if (d.outcome === 'cantRead') return 'cantRead';
    return d.outcome; // none | action | help | scam
  }

  function money(a) {
    const t = I().t;
    if (!a.mainAmount) return t('money_none');
    return t('money_' + a.money, { amt: a.mainAmount.raw });
  }

  function bandText(a) {
    const t = I().t; const d = a.daysLeft;
    switch (a.band) {
      case 'overdue': return t('band_overdue');
      case 'unclear': return t('band_unclear');
      case 'nodate': return t('band_nodate');
      default: return d === 0 ? t('band_today') : d === 1 ? t('band_urgent1') : t('band_' + a.band, { d });
    }
  }

  function headline(a) {
    const t = I().t, date = a.deadline ? I().fmtDate(a.deadline) : null, amt = a.mainAmount && a.mainAmount.raw;
    const o = outcomeOf(a);
    if (o === 'cantRead') return t('h_cantRead');
    if (o === 'scam') return t('h_scam');
    if (a.band === 'overdue') return t('h_overdue', { date });
    if (o === 'help' && a.signature) return date && a.band !== 'unclear' ? t('h_signBy', { date }) : t('h_sign');
    if (o === 'help') return t('h_help');
    if (o === 'action') {
      if (a.money === 'owe') return date && a.band !== 'unclear' ? t('h_payBy', { amt, date }) : t('h_pay', { amt });
      if (date) return t('h_respondBy', { date });
    }
    if (a.money === 'receive') return t('h_receive', { amt });
    return t('h_none');
  }

  function ignoreLine(a) {
    const t = I().t, o = outcomeOf(a);
    if (o === 'scam') return t('ig_scam');
    if (a.signature) return t('ig_sign');
    if (a.money === 'owe') return t('ig_pay');
    if (a.band !== 'nodate') return t('ig_deadline');
    if (o === 'none') return t('ig_none');
    return t('ig_unknown');
  }

  function steps(a) {
    const t = I().t, date = a.deadline ? I().fmtDate(a.deadline) : '…', o = outcomeOf(a);
    if (o === 'scam') return [t('step_scam1'), t('step_scam2'), t('step_scam3')];
    if (a.signature) return [t('step_signFind'), t('step_signHelp'), t('step_signSend', { date })];
    if (a.money === 'owe') return [t('step_payCheck'), t('step_payMail'), t('step_payBefore', { date })];
    if (o === 'help') return [t('step_signHelp'), t('step_keep')];
    return [t('step_keep')];
  }

  // EVD-03: two or three reasons, plain words
  function reasons(a) {
    const t = I().t, out = [];
    a.signals.forEach(s => {
      if (s.id === 'payment') out.push(t('r_payment', { x: s.raw }));
      else if (s.id === 'ssn') out.push(t('r_ssn'));
      else if (s.id === 'urgency') out.push(t('r_urgency', { x: s.raw }));
      else if (s.id === 'phrase') out.push(t('r_phrase', { x: s.raw }));
      else if (s.id === 'caps') out.push(t('r_caps'));
      else if (s.id === 'link') out.push(t('r_link', { x: s.raw }));
      else if (s.id === 'squeeze') out.push(t('r_squeeze'));
      else if (s.id === 'weekend') out.push(t('r_weekend'));
      else if (s.id === 'contradiction') out.push(t('r_contradiction', { x: s.raw }));
    });
    if (outcomeOf(a) !== 'scam') {
      if (a.signature) out.push(t('r_signature'));
      if (a.money === 'owe') out.push(t('r_owe', { x: a.mainAmount.raw }));
      if (a.money === 'receive') out.push(t('r_receive', { x: a.mainAmount.raw }));
      if (a.money === 'unclear') out.push(t('r_moneyUnclear'));
      if (a.band === 'overdue') out.push(t('r_overdue'));
      else if (a.band === 'unclear') out.push(t('r_unclearDate'));
      else if (a.band !== 'nodate') out.push(t('r_deadline', { x: I().fmtDate(a.deadline) }));
      if (a.noAction) out.push(t('r_noAction'));
      if (!out.length) out.push(t('r_nothing'));
    }
    return out.slice(0, 3);
  }

  // SCM-07 / SCM-09
  function verifyLine(a) {
    const t = I().t;
    if (a.agency) return t('cantVerify', { who: a.agency.names[0].replace(/\b\w/g, c => c.toUpperCase()), site: a.agency.site });
    if (outcomeOf(a) === 'scam' || outcomeOf(a) === 'help') return t('cantVerifyGeneric');
    return null;
  }

  function scamCountLine(a) {
    const n = a.signals.length; if (!n) return null;
    return n === 1 ? I().t('scamCount1') : I().t('scamCount', { n });
  }

  // SCM-17
  function teachLine(a) {
    if (outcomeOf(a) !== 'scam') return null;
    const k = a.signals.slice(0, 3).map(s => s.raw).filter(Boolean).map(x => '“' + x + '”').join(', ');
    return I().t('learn', { x: k });
  }

  // RES-14 / RES-15: 4 fixed levels, each a different method
  function levels(a) {
    const t = I().t;
    return [
      { id: 1, label: t('level1'), text: [headline(a), ...reasons(a)].join(' ') },
      { id: 2, label: t('level2'), text: headline(a) },
      { id: 3, label: t('level3'), text: steps(a)[0], showEvidence: true },
      { id: 4, label: t('level4'), text: t('open_help'), callTrusted: true }
    ];
  }

  // RES-28: document-grounded answers only
  function grounded(a, q) {
    const t = I().t, o = outcomeOf(a);
    if (q === 'important') return o === 'none' ? t('g_imp_no') : t('g_imp_yes', { x: headline(a) });
    if (q === 'money') return a.mainAmount ? t('g_money_yes', { x: money(a) }) : t('g_money_no');
    if (q === 'scam') return a.signals.length ? t('g_scam_yes', { n: a.signals.length }) : t('g_scam_no');
    return [headline(a), ...steps(a)].join(' ');
  }

  // RES-11 per-field confidence
  function fields(a) {
    const t = I().t;
    return ['deadline', 'amount', 'sender', 'type'].map(f => ({ id: f, label: t('f_' + f), conf: a.fieldConf[f], text: t('conf_' + a.fieldConf[f]) }));
  }

  // RES-19 easy read: one short line per key fact
  function easyRead(a) {
    const t = I().t; const r = [headline(a), bandText(a), money(a)];
    r.push(a.signature ? t('a_signFound') : t('a_noSign'));
    return r;
  }

  // FAM-05 structured summary for the recipient (masked numbers PRV-07/08)
  function summary(a, opts) {
    const t = I().t; opts = opts || {}; const name = opts.name || '';
    const lines = [t('msgIntro', { name }), '',
      t('msgType') + ': ' + t('type_' + a.docType),
      t('msgResult') + ': ' + t('out_' + (a.decision.notSure ? 'notSure' : outcomeOf(a))),
      t('msgAmount') + ': ' + money(a),
      t('msgDeadline') + ': ' + bandText(a) + (a.deadline ? ' (' + I().fmtDate(a.deadline) + ')' : ''),
      t('msgWhy') + ': ' + reasons(a).join(' ')];
    const ev = a.evidence.find(e => e.kind === 'risk') || a.evidence.find(e => e.kind === 'deadline') || a.evidence[0];
    if (ev && opts.level !== 'alert') lines.push(t('msgSaid') + ': “' + (opts.mask ? root.PSRules.maskText(ev.text, a.sensitive) : ev.text) + '”');
    lines.push('', t('disclaimer'), '— PaperShield');
    if (opts.level === 'alert') return [t('msgIntro', { name }), t('msgResult') + ': ' + t('out_' + outcomeOf(a)), '— PaperShield'].join('\n');
    return lines.join('\n');
  }

  root.PSExplain = { outcomeOf, money, bandText, headline, ignoreLine, steps, reasons, verifyLine, scamCountLine, teachLine, levels, grounded, fields, easyRead, summary };
})(typeof window !== 'undefined' ? window : globalThis);
