/* PaperShield rules engine.
 * DEC-06: OCR only extracts text. Everything below is fixed, readable rules.
 * Same input always gives the same output. No AI, no network.
 */
(function (root) {
  'use strict';

  // ---------- Published word lists (SCM-03, SCM-04, SCM-05) ----------
  const LISTS = {
    // SCM-04: strongest signal on its own
    payment: [
      'gift card', 'gift cards', 'itunes card', 'google play card', 'steam card', 'prepaid card',
      'wire transfer', 'wire the', 'western union', 'moneygram', 'bitcoin', 'crypto', 'cryptocurrency',
      'zelle', 'cash app', 'cashapp', 'venmo', 'bitcoin atm',
      'tarjeta de regalo', 'tarjetas de regalo', 'transferencia bancaria', 'criptomoneda'
    ],
    // SCM-05: urgency and threats
    urgency: [
      'act now', 'immediately', 'immediate action', 'within 24 hours', 'within 48 hours', 'today only',
      'final notice', 'final warning', 'last warning', 'urgent', 'you will be arrested', 'arrest warrant',
      'warrant for your arrest', 'police will', 'legal action will', 'lawsuit will be filed',
      'account will be suspended', 'suspended', 'frozen', 'do not ignore',
      'inmediatamente', 'aviso final', 'ultimo aviso', 'último aviso', 'urgente', 'será arrestado', 'orden de arresto'
    ],
    // SCM-03: other published scam phrases
    phrases: [
      'verify your account', 'confirm your identity', 'confirm your account', 'you have won', 'you won',
      'claim your prize', 'prize', 'lottery', 'sweepstakes', 'unclaimed funds', 'inheritance',
      'processing fee', 'release fee', 'keep this confidential', 'do not tell', 'call this number now',
      'ha ganado', 'premio', 'lotería', 'verifique su cuenta'
    ],
    ssn: [
      'social security number', 'ssn', 'social security no', 'número de seguro social', 'numero de seguro social'
    ],
    ssnAsk: ['provide', 'verify', 'confirm', 'send', 'enter', 'call', 'proporcione', 'verifique', 'confirme', 'envíe']
  };

  // Domains we treat as official (SCM-07 / SCM-12). Websites only: phone numbers are
  // not hard-coded because they must be verified from the agency's own site.
  const AGENCIES = [
    { id: 'irs', names: ['internal revenue service', 'irs', 'department of the treasury'], site: 'irs.gov' },
    { id: 'ssa', names: ['social security administration', 'social security'], site: 'ssa.gov' },
    { id: 'medicare', names: ['medicare', 'centers for medicare'], site: 'medicare.gov' },
    { id: 'usps', names: ['united states postal service', 'usps', 'postal service'], site: 'usps.com' },
    { id: 'ftc', names: ['federal trade commission'], site: 'ftc.gov' },
    { id: 'dmv', names: ['department of motor vehicles', 'dmv'], site: 'dmv.ca.gov' }
  ];
  const SHORTENERS = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'rb.gy', 'cutt.ly'];

  // DEC-17 document types
  const TYPES = [
    { id: 'gov', words: ['internal revenue', 'irs', 'social security', 'department of', 'county of', 'city of', 'state of', 'notice of', 'medicare', 'dmv', 'court', 'jury'] },
    { id: 'insurance', words: ['insurance', 'policy number', 'premium', 'deductible', 'coverage', 'claim number', 'explanation of benefits', 'seguro'] },
    { id: 'bill', words: ['amount due', 'balance due', 'account number', 'billing', 'statement', 'invoice', 'pay by', 'utility', 'factura', 'saldo'] },
    { id: 'medical', words: ['patient', 'appointment', 'clinic', 'hospital', 'doctor', 'prescription', 'paciente', 'cita'] },
    { id: 'promo', words: ['offer', 'sale', 'discount', 'pre-approved', 'preapproved', 'limited time', 'free gift', 'subscribe', 'oferta', 'descuento'] }
  ];

  const MONTHS = {
    january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4, may: 5, june: 6, jun: 6,
    july: 7, jul: 7, august: 8, aug: 8, september: 9, sep: 9, sept: 9, october: 10, oct: 10,
    november: 11, nov: 11, december: 12, dec: 12,
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8,
    septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12
  };
  const DUE_WORDS = ['due', 'pay by', 'payment by', 'by', 'before', 'deadline', 'no later than', 'respond by',
    'must be received', 'expires', 'expiration', 'last day', 'vence', 'fecha límite', 'fecha limite', 'antes del', 'antes de', 'a más tardar'];
  const OWE_WORDS = ['amount due', 'balance due', 'total due', 'you owe', 'past due', 'minimum payment', 'pay', 'payment', 'balance', 'fee', 'owed', 'cargo', 'saldo', 'pagar', 'monto'];
  const OWE_LABELS = ['amount due', 'balance due', 'total due', 'you owe', 'past due', 'minimum payment', 'amount owed', 'saldo a pagar', 'monto a pagar', 'total a pagar', 'cantidad adeudada'];
  const NO_ACTION = ['you do not need to do anything', "you don't need to do anything", 'no action is needed', 'no action needed', 'no action is required', 'for your records', 'no necesita hacer nada', 'no tiene que hacer nada'];
  const GET_WORDS = ['refund', 'credit', 'you will receive', 'check enclosed', 'payable to you', 'reimbursement', 'rebate', 'reembolso', 'crédito', 'recibirá'];
  const SIGN_WORDS = ['sign here', 'signature', 'sign and return', 'please sign', 'signed', 'firma', 'firme aquí', 'firme'];

  // ---------- helpers ----------
  const norm = s => (s || '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ');
  function has(text, w) {
    const re = new RegExp('(^|[^a-z0-9áéíóúñ])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9áéíóúñ])', 'i');
    return re.test(text);
  }
  function lineOf(lines, idx) { // idx = char index in joined text
    let pos = 0;
    for (let i = 0; i < lines.length; i++) {
      const end = pos + lines[i].text.length;
      if (idx <= end) return i;
      pos = end + 1;
    }
    return lines.length - 1;
  }
  function dayDiff(a, b) { // whole days b - a
    const A = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const B = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((B - A) / 86400000);
  }
  function validDate(y, m, d) {
    if (y < 100) y += 2000;
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1990 || y > 2100) return null;
    const dt = new Date(y, m - 1, d);
    return dt.getMonth() === m - 1 ? dt : null;
  }

  // ---------- extraction ----------
  function findDates(text) {
    const out = [];
    const t = text;
    let m;
    const reMonthFirst = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi;
    while ((m = reMonthFirst.exec(t))) {
      const d = validDate(+m[3], MONTHS[m[1].toLowerCase().replace('.', '')], +m[2]);
      out.push({ index: m.index, raw: m[0], date: d, clear: !!d });
    }
    const reDayFirst = /\b(\d{1,2})\s+(?:de\s+)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:de\s+|del\s+)?(\d{4})\b/gi;
    while ((m = reDayFirst.exec(t))) {
      const d = validDate(+m[3], MONTHS[m[2].toLowerCase()], +m[1]);
      out.push({ index: m.index, raw: m[0], date: d, clear: !!d });
    }
    const reNum = /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/g;
    while ((m = reNum.exec(t))) {
      const a = +m[1], b = +m[2], y = +m[3];
      // US format first (MM/DD). If ambiguous (both <= 12 and different), mark as not clear (DEC-13).
      const us = validDate(y, a, b);
      const eu = validDate(y, b, a);
      const ambiguous = !!(us && eu && a !== b);
      out.push({ index: m.index, raw: m[0], date: us || eu, clear: !!(us || eu) && !ambiguous, ambiguous });
    }
    // Something that looks like a date but failed to parse (OCR damage) -> unclear date
    const reBroken = /\b(due by|due on|due date|pay by|vence el|deadline)[: ]{1,3}([0-9oO]{1,2}[\/\-.][0-9oO]{1,2}[\/\-.]?[0-9oO]{0,1}\b|[a-z]{3,9}\s+[0-9oOlI]{1,2}[^\d,\n$]{1,3}[0-9oO]{0,3})\b/gi;
    while ((m = reBroken.exec(t))) {
      if (/\$/.test(m[0])) continue;
      const covered = out.some(o => Math.abs(o.index - m.index) < 25);
      if (!covered) out.push({ index: m.index, raw: m[0], date: null, clear: false, broken: true });
    }
    return out.sort((x, y) => x.index - y.index);
  }

  function contextAround(text, index, len, before = 45, after = 10) {
    return norm(text.slice(Math.max(0, index - before), index + len + after));
  }

  function findAmounts(text) {
    const out = [];
    const re = /(?:\$|usd\s?)\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{2}))?/gi;
    let m;
    while ((m = re.exec(text))) {
      const value = parseFloat(m[1].replace(/,/g, '') + '.' + (m[2] || '00'));
      const ls = text.lastIndexOf('\n', m.index) + 1, le = text.indexOf('\n', m.index);
      const line = norm(text.slice(ls, le < 0 ? text.length : le));
      const ctx = contextAround(text, m.index, m[0].length, 60, 25);
      let kind = 'unclear', labelled = false;
      if (GET_WORDS.some(w => has(line, w))) kind = 'receive';
      else if (OWE_LABELS.some(w => has(line, w))) { kind = 'owe'; labelled = true; }
      else if (GET_WORDS.some(w => has(ctx, w))) kind = 'receive';
      else if (OWE_WORDS.some(w => has(line, w))) kind = 'owe';
      out.push({ index: m.index, raw: m[0].replace(/\s+/g, '').trim(), value, kind, labelled });
    }
    return out;
  }

  function findPageCount(text) {
    const m = /\bpage\s+(\d{1,2})\s+(?:of|\/)\s+(\d{1,2})\b|\bp[aá]gina\s+(\d{1,2})\s+de\s+(\d{1,2})\b/i.exec(text);
    if (!m) return null;
    return { page: +(m[1] || m[3]), of: +(m[2] || m[4]) };
  }

  function findUrls(text) {
    const re = /\b((?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|gov|org|net|info|biz|us|co|io|ly|xyz|online|site)(?:\/[^\s]*)?)/gi;
    const out = []; let m;
    while ((m = re.exec(text))) {
      const host = m[1].replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].toLowerCase();
      out.push({ index: m.index, raw: m[1], host });
    }
    return out;
  }

  function findPhones(text) {
    const re = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b/g;
    const out = []; let m;
    while ((m = re.exec(text))) out.push({ index: m.index, raw: m[0] });
    return out;
  }

  function findSensitive(text) { // PRV-07 / PRV-08
    const out = []; let m;
    const ssn = /\b(\d{3})[- ](\d{2})[- ](\d{4})\b/g;
    while ((m = ssn.exec(text))) out.push({ kind: 'ssn', raw: m[0], masked: '***-**-' + m[3], index: m.index });
    const acct = /\b(?:account|acct|policy|member|id)\s*(?:no\.?|number|#)?\s*[:#]?\s*([A-Z0-9-]{6,20})\b/gi;
    while ((m = acct.exec(text))) {
      const v = m[1]; if (!/\d{4}/.test(v)) continue;
      out.push({ kind: 'account', raw: v, masked: '••••' + v.replace(/-/g, '').slice(-4), index: m.index + m[0].indexOf(v) });
    }
    const card = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
    while ((m = card.exec(text))) out.push({ kind: 'card', raw: m[0], masked: '•••• ' + m[0].replace(/\D/g, '').slice(-4), index: m.index });
    return out;
  }

  function maskText(text, sensitive) {
    let t = text;
    sensitive.slice().sort((a, b) => b.raw.length - a.raw.length).forEach(s => { t = t.split(s.raw).join(s.masked); });
    return t;
  }

  function isWorkingDay(d) { const w = d.getDay(); return w !== 0 && w !== 6; }
  function workingDaysBetween(a, b) {
    let n = 0; const d = new Date(a);
    while (dayDiff(d, b) > 0) { d.setDate(d.getDate() + 1); if (isWorkingDay(d)) n++; }
    return n;
  }

  /**
   * extract(doc, opts)
   * doc: { text, lines:[{text, bbox, page, conf}], meanConf }
   * opts: { today: Date, received: Date|null, userName, userStreet }
   */
  function extract(doc, opts) {
    opts = opts || {};
    const today = opts.today || new Date();
    const text = doc.text || '';
    const t = norm(text);
    const lines = doc.lines || text.split('\n').map(s => ({ text: s }));
    const evidence = [];
    const addEv = (kind, index, label) => {
      const li = lineOf(lines, index);
      if (evidence.some(e => e.line === li && e.kind === kind)) return; // one mark per line
      evidence.push({ kind, line: li, text: (lines[li] && lines[li].text || '').trim(), bbox: lines[li] && lines[li].bbox, page: lines[li] && lines[li].page, label });
    };

    // --- readability (CAM-09 / CAM-10) ---
    const words = t.split(/\s+/).filter(w => /[a-záéíóúñ]{2,}/.test(w));
    const confOk = doc.meanConf == null || doc.meanConf >= 45;

    // --- dates ---
    const dates = findDates(text).map(d => {
      const ctx = contextAround(text, d.index, d.raw.length, 40, 4);
      d.isDue = DUE_WORDS.some(w => has(ctx, w));
      return d;
    });
    const dueDates = dates.filter(d => d.isDue);
    let deadline = null, deadlineState = 'none';
    const firstDue = dueDates.find(d => d.clear) || dueDates[0];
    if (firstDue) {
      if (firstDue.clear && firstDue.date) {
        deadline = firstDue.date;
        const left = dayDiff(today, deadline);
        deadlineState = left < 0 ? 'overdue' : left <= 3 ? 'urgent' : left <= 14 ? 'soon' : 'later';
        addEv('deadline', firstDue.index, firstDue.raw);
      } else {
        deadlineState = 'unclear'; // DEC-13
        if (firstDue.date) deadline = firstDue.date;
        addEv('deadline', firstDue.index, firstDue.raw);
      }
    }
    const daysLeft = deadline ? dayDiff(today, deadline) : null;
    const letterDate = dates.find(d => !d.isDue && d.date) || null;

    // --- amounts ---
    const amounts = findAmounts(text);
    const owe = amounts.filter(a => a.kind === 'owe');
    const receive = amounts.filter(a => a.kind === 'receive');
    let money = 'none'; // RES-05: owe / receive / unclear / none
    let mainAmount = null;
    const noAction = NO_ACTION.some(w => has(t, w));
    const labelledOwe = owe.filter(a => a.labelled);
    if (owe.length && !(noAction && !labelledOwe.length)) { money = 'owe'; mainAmount = (labelledOwe[0] || owe.reduce((a, b) => (b.value > a.value ? b : a))); }
    else if (receive.length) { money = 'receive'; mainAmount = receive[0]; }
    else if (amounts.length && noAction) { money = 'info'; mainAmount = amounts[0]; }
    else if (amounts.length) { money = 'unclear'; mainAmount = amounts[0]; }
    if (mainAmount) addEv('amount', mainAmount.index, mainAmount.raw);

    // short letters are fine if the key facts are readable
    const readable = confOk && (words.length >= 12 || (words.length >= 5 && (amounts.length > 0 || dates.some(d => d.date))));

    // --- signature ---
    let signature = false;
    for (const w of SIGN_WORDS) {
      if (has(t, w)) { // whole words only ("confirmed" must not match "firme")
        const m = new RegExp('(^|[^a-z0-9áéíóúñ])' + w + '($|[^a-z0-9áéíóúñ])', 'i').exec(text);
        signature = true; addEv('signature', m ? m.index : 0, w); break;
      }
    }
    if (!signature && /x\s?_{5,}|_{10,}\s*\n?\s*(signature|firma)/i.test(text)) {
      signature = true; addEv('signature', text.search(/x\s?_{5,}|_{10,}/i), 'signature line');
    }

    // --- type (DEC-17) ---
    const typeScores = TYPES.map(tp => ({ id: tp.id, score: tp.words.filter(w => has(t, w)).length }));
    typeScores.sort((a, b) => b.score - a.score);
    let docType = typeScores[0].score > 0 ? typeScores[0].id : 'other';

    // --- agency claimed & sender (SCM-07, SCM-09) ---
    const agency = AGENCIES.find(a => a.names.some(n => has(norm(lines.slice(0, 8).map(l => l.text).join(' ')), n) || has(t, n)));
    const senderLine = lines.map(l => (l.text || '').trim()).find(s => s.length > 3 && /[a-z]/i.test(s)) || '';

    // --- scam signals (SCM-02..06, SCM-10..14) ---
    const signals = [];
    const sig = (id, strength, index, raw) => { signals.push({ id, strength, raw }); if (index != null && index >= 0) addEv('risk', index, raw); };
    const tl = text.toLowerCase();
    const pay = LISTS.payment.find(w => has(t, w)); if (pay) sig('payment', 'strong', tl.indexOf(pay), pay);
    const ssnW = LISTS.ssn.find(w => has(t, w));
    if (ssnW && LISTS.ssnAsk.some(w => has(t, w))) sig('ssn', 'strong', tl.indexOf(ssnW), ssnW);
    const urg = LISTS.urgency.filter(w => has(t, w));
    if (urg.length) sig('urgency', urg.length >= 2 ? 'strong' : 'normal', tl.indexOf(urg[0]), urg.slice(0, 3).join(', '));
    const phr = LISTS.phrases.find(w => has(t, w)); if (phr) sig('phrase', 'normal', tl.indexOf(phr), phr);
    const capsLines = lines.filter(l => { const s = (l.text || '').replace(/[^A-Za-z]/g, ''); return s.length >= 12 && s === s.toUpperCase(); });
    if (capsLines.length >= 1 && capsLines.some(l => LISTS.urgency.some(w => has(norm(l.text), w)))) sig('caps', 'normal', text.indexOf(capsLines[0].text), capsLines[0].text.trim());

    // SCM-12 links and QR
    const urls = findUrls(text);
    const qr = (doc.qr || []).map(q => ({ raw: q, host: (q.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0] || '').toLowerCase() }));
    const links = urls.concat(qr);
    const badLink = links.find(u => SHORTENERS.some(s => u.host === s || u.host.endsWith('.' + s)) ||
      (agency && !(u.host === agency.site || u.host.endsWith('.' + agency.site))));
    if (badLink) sig('link', 'strong', badLink.index != null ? badLink.index : -1, badLink.raw);

    // SCM-10 fake urgency: little time between arrival and deadline
    const received = opts.received || null;
    if (received && deadline) {
      const span = dayDiff(received, deadline);
      if (span >= 0 && span <= 3) sig('squeeze', 'normal', null, span + 'd');
    }
    // SCM-11 weekend / holiday squeeze
    if (deadline && daysLeft != null && daysLeft >= 0 && daysLeft <= 5 && workingDaysBetween(today, deadline) <= 1) {
      sig('weekend', 'normal', null, '');
    }
    // SCM-14 contradictions
    const contradictions = [];
    const oweVals = Array.from(new Set(labelledOwe.map(a => a.value)));
    if (oweVals.length >= 2) contradictions.push({ id: 'twoAmounts', raw: labelledOwe.map(a => a.raw).join(' / ') });
    const dueVals = Array.from(new Set(dueDates.filter(d => d.date).map(d => d.date.toDateString())));
    if (dueVals.length >= 2) contradictions.push({ id: 'twoDeadlines', raw: dueDates.map(d => d.raw).join(' / ') });
    if (letterDate && deadline && dayDiff(letterDate.date, deadline) < 0) contradictions.push({ id: 'deadlineBeforeLetter', raw: letterDate.raw });
    if (contradictions.length) sig('contradiction', 'normal', null, contradictions.map(c => c.raw).join('; '));

    // --- belongs to you? (RES-04) ---
    let belongs = 'unknown';
    if (opts.userName) {
      const parts = norm(opts.userName).split(' ').filter(p => p.length > 1);
      const last = parts[parts.length - 1];
      if (parts.length && parts.every(p => has(t, p))) belongs = 'yes';
      else if (last && has(t, last)) belongs = 'partial';
      else belongs = 'no';
    }

    // --- sensitive ---
    const sensitive = findSensitive(text);
    const pageInfo = findPageCount(text);
    const phones = findPhones(text);

    // --- per-field confidence (RES-10, RES-11) ---
    const fieldConf = {
      deadline: !firstDue ? 'none' : (deadlineState === 'unclear' ? 'cantTell' : 'clear'),
      amount: !amounts.length ? 'none' : (money === 'unclear' || contradictions.some(c => c.id === 'twoAmounts') ? 'review' : 'clear'),
      sender: senderLine ? (doc.meanConf != null && doc.meanConf < 70 ? 'review' : 'clear') : 'cantTell',
      type: typeScores[0].score >= 2 ? 'clear' : typeScores[0].score === 1 ? 'review' : 'cantTell'
    };

    return {
      readable, text, lines, dates, deadline, deadlineState, daysLeft, letterDate,
      amounts, money, mainAmount, noAction, signature, docType, typeScores, agency, senderLine,
      signals, contradictions, links, phones, belongs, sensitive, pageInfo, fieldConf, evidence,
      meanConf: doc.meanConf
    };
  }

  // ---------- DEC-05: the full decision table, published in the app ----------
  // Order matters (DEC-04): scam signs are checked first.
  const TABLE = [
    { id: 'R0', when: 'unreadable', outcome: 'cantRead' },
    { id: 'R1', when: 'strongSign', outcome: 'scam' },
    { id: 'R2', when: 'twoOrMoreSigns', outcome: 'scam' },
    { id: 'R3', when: 'oneSign', outcome: 'help' },
    { id: 'R4', when: 'signature', outcome: 'help' },
    { id: 'R5', when: 'overdueWithMoney', outcome: 'help' },
    { id: 'R6', when: 'deadlineUnclearWithMoney', outcome: 'help' },
    { id: 'R7', when: 'oweMoney', outcome: 'action' },
    { id: 'R8', when: 'deadline', outcome: 'action' },
    { id: 'R9', when: 'moneyUnclear', outcome: 'help' },
    { id: 'R10', when: 'nothing', outcome: 'none' }
  ];

  function decide(f) {
    const strong = f.signals.filter(s => s.strength === 'strong').length;
    const count = f.signals.length;
    const tests = {
      unreadable: !f.readable,
      strongSign: strong >= 1,
      twoOrMoreSigns: count >= 2,
      oneSign: count === 1,
      signature: f.signature,
      overdueWithMoney: f.deadlineState === 'overdue' && f.money === 'owe',
      deadlineUnclearWithMoney: f.deadlineState === 'unclear' && f.money === 'owe',
      oweMoney: f.money === 'owe',
      deadline: f.deadlineState !== 'none',
      moneyUnclear: f.money === 'unclear',
      nothing: true
    };
    const rule = TABLE.find(r => tests[r.when]);
    // CAM-10: readable, but the key facts are uncertain -> "I'm not sure"
    const notSure = f.readable && rule.outcome !== 'scam' &&
      (f.fieldConf.deadline === 'cantTell' || f.fieldConf.amount === 'review') ;

    // EVD-05 checks passed / failed
    const checks = [
      { id: 'payment', found: f.signals.some(s => s.id === 'payment') },
      { id: 'ssn', found: f.signals.some(s => s.id === 'ssn') },
      { id: 'urgency', found: f.signals.some(s => s.id === 'urgency') },
      { id: 'link', found: f.signals.some(s => s.id === 'link') },
      { id: 'money', found: f.money === 'owe' },
      { id: 'deadline', found: f.deadlineState !== 'none' },
      { id: 'signature', found: f.signature }
    ];
    return { outcome: rule.outcome, rule: rule.id, notSure, scamCount: count, strongCount: strong, checks };
  }

  // Urgency band (DEC-11, DEC-12, DEC-13, DEC-14)
  function band(f) {
    switch (f.deadlineState) {
      case 'overdue': return 'overdue';
      case 'urgent': return 'urgent';
      case 'soon': return 'soon';
      case 'later': return 'later';
      case 'unclear': return 'unclear';
      default: return 'nodate';
    }
  }

  function analyze(doc, opts) {
    const f = extract(doc, opts);
    const d = decide(f);
    return Object.assign(f, { decision: d, band: band(f) });
  }

  const api = { LISTS, AGENCIES, TYPES, TABLE, extract, decide, analyze, maskText, findSensitive, dayDiff, norm };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PSRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
