/* DEM-01: fictional sample documents. Every company, name and number is invented.
 * Dates are generated relative to today so the demo always shows live deadlines. */
(function (root) {
  'use strict';
  const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmt(d) { return M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function plus(today, n) { const d = new Date(today); d.setDate(d.getDate() + n); return d; }

  function build(today) {
    today = today || new Date();
    return [
      {
        id: 'bill', titleKey: 'demoBill',
        text: [
          'SAMPLE ONLY - VALLEY LIGHT & WATER CO.',
          'Customer Service: 555-0142',
          '',
          'Statement date: ' + fmt(plus(today, -6)),
          'Account number: 4410-2291-0087',
          'Maria Example',
          '1200 Sample Street, Los Angeles, CA',
          '',
          'Electric service 09/01 - 09/30          $38.10',
          'Water service                           $ 7.40',
          'Amount due: $45.50',
          'Please pay by ' + fmt(plus(today, 8)) + '.',
          'If payment is not received, a late fee may be added',
          'and service may be interrupted.',
          'Pay online at valleylightwater.example or by mail.',
          'Page 1 of 1'
        ].join('\n')
      },
      {
        id: 'insurance', titleKey: 'demoInsurance',
        text: [
          'SAMPLE ONLY - SUNRISE MUTUAL INSURANCE',
          'Policy number: HP-7781-3302',
          '',
          fmt(plus(today, -3)),
          'Dear Maria Example,',
          'Your home insurance policy renews automatically.',
          'Your new yearly premium is $612.00, the same as last year.',
          'Your deductible and coverage have not changed.',
          'You do not need to do anything. This letter is for your records.',
          'Questions? Call the number on your insurance card.',
          'Page 1 of 1'
        ].join('\n')
      },
      {
        id: 'gov', titleKey: 'demoGov',
        text: [
          'SAMPLE ONLY - COUNTY OF EXAMPLE',
          'Department of Public Social Services',
          '',
          'Notice date: ' + fmt(plus(today, -2)),
          'Maria Example',
          '1200 Sample Street, Los Angeles, CA',
          '',
          'NOTICE OF RENEWAL FOR YOUR BENEFITS',
          'To keep your benefits, you must sign and return',
          'the enclosed form by ' + fmt(plus(today, 12)) + '.',
          'If we do not receive the signed form, your benefits may stop.',
          'Signature: X__________________________',
          'Page 1 of 2'
        ].join('\n')
      },
      {
        id: 'scam', titleKey: 'demoScam',
        text: [
          'SAMPLE ONLY - FINAL NOTICE',
          'TAX RESOLUTION DEPARTMENT IRS SERVICES',
          '',
          'URGENT: YOUR TAX ACCOUNT HAS A BALANCE',
          'Amount due: $1,850.00',
          'You must act now. Pay within 24 hours or a warrant for your arrest',
          'will be issued and your bank account will be frozen.',
          'Payment must be made with gift cards or wire transfer only.',
          'Call 555-0199 immediately and have your Social Security number',
          'ready to verify your identity.',
          'Visit irs-tax-payments.example.com to confirm your account.',
          'Do not tell anyone about this notice.'
        ].join('\n')
      },
      {
        id: 'refund', titleKey: 'demoRefund',
        text: [
          'SAMPLE ONLY - CITYWIDE PHARMACY',
          fmt(plus(today, -1)),
          'Dear Maria Example,',
          'We overcharged you for your last order.',
          'A refund of $18.25 will be sent to your card on file.',
          'You will receive it in 5 to 7 business days.',
          'You do not need to do anything.'
        ].join('\n')
      }
    ];
  }

  /* Render a sample as an image so the evidence screen can highlight lines (EVD-01). */
  function render(doc) {
    const lines = doc.text.split('\n');
    const W = 900, pad = 56, lh = 38;
    const H = pad * 2 + lines.length * lh + 20;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#1b1b1b'; g.font = '24px Georgia, "Times New Roman", serif'; g.textBaseline = 'top';
    const out = [];
    lines.forEach((t, i) => {
      const y = pad + i * lh;
      g.fillText(t, pad, y);
      const w = Math.min(W - pad * 2, g.measureText(t).width);
      out.push({ text: t, bbox: { x0: pad - 6, y0: y - 6, x1: pad + w + 6, y1: y + 30 }, page: 0, conf: 99 });
    });
    return { canvas: c, lines: out };
  }

  const api = { build, render, fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PSDemo = api;
})(typeof window !== 'undefined' ? window : globalThis);
