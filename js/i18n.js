/* All words the user sees. Spanish must be reviewed by a native speaker before release (ACC-11). */
(function (root) {
  'use strict';
  const en = {
    appName: 'PaperShield',
    tagline: "It doesn't explain documents. It decides.",
    goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
    scan: 'Scan a document', scanSub: 'Point your camera at the letter',
    upload: 'Choose a photo or PDF', readAloud: 'Read the screen aloud',
    tryDemo: 'Try a sample letter', phonePanic: 'Is someone pressuring you on the phone right now?',
    phonePanicTitle: 'Hang up now.',
    phonePanicBody: 'Government agencies do not ask for payment by phone. Real companies will wait while you check. Call back using the number on your own card or the official website.',
    hangUpDone: 'I hung up', callTrusted: 'Call my trusted person',
    today: 'What to do today', todayEmpty: 'Nothing is waiting. Scan a letter when one arrives.',
    encourage: 'This month you handled {n} documents. {h} needed help.',
    settings: 'Settings', help: 'How it decides', about: 'About', privacy: 'Privacy', accessibility: 'Accessibility',
    back: 'Back', close: 'Close', yes: 'Yes', no: 'No', next: 'Next', done: 'Done', cancel: 'Cancel', undo: 'Undo', continue: 'Continue', save: 'Save',

    // capture
    camTitle: 'Hold the letter flat', camHint: 'Fill the frame with the page',
    camTooDark: 'Too dark. Turn on a light.', camGlare: 'Too much glare. Tilt the page a little.',
    camBlur: 'Hold still…', camCloser: 'Move closer to the page.', camGood: 'Good. Taking the photo…',
    camCut: 'Part of the page is cut off. Move back a little.',
    takePhoto: 'Take photo', addPage: 'Add another page', finish: 'Finish and read', pages: 'Pages: {n}',
    duplicate: 'You already captured this page.', cameraBlocked: 'The camera is blocked. You can choose a photo instead.',
    pageOf: 'This looks like page {p} of {n}. Capture the other pages?', captureRest: 'Capture the rest', skip: 'Skip',
    cropTitle: 'Check the corners', cropHint: 'Drag the four dots to the corners of the page.', autoFix: 'Straighten',

    // progress + privacy
    reading: 'Reading your document…', stepRead: 'Reading the words', stepCheck: 'Checking the rules', stepDelete: 'Deleting the photo',
    deleted: 'Photo deleted from this phone’s memory', loadingLang: 'Getting the reader ready (first time only)…',

    // outcomes (DEC-02, DEC-08 plain names)
    out_none: 'No action needed', out_action: 'Action needed', out_help: 'Ask someone you trust', out_scam: 'Careful — signs of a scam',
    out_cantRead: "I can't read this", out_notSure: "I'm not sure",
    open_none: "Don't worry — this one doesn't need anything from you.",
    open_action: 'This needs one thing from you.',
    open_help: 'Please show this to someone you trust before you do anything.',
    open_scam: "Don't reply, don't pay, don't sign. Keep the letter.",

    // urgency bands (DEC-11..15)
    band_overdue: 'Past the deadline', band_urgent: '{d} days left', band_urgent1: '1 day left', band_today: 'Due today',
    band_soon: '{d} days left', band_later: '{d} days left', band_unclear: "There is a date, but I can't read it clearly", band_nodate: 'No deadline on this document',
    overdueBy: 'The date passed {d} days ago',

    // headline sentences (RES-06)
    h_payBy: 'Pay {amt} by {date}.', h_pay: 'Pay {amt}.', h_signBy: 'Sign and return the form by {date}.', h_sign: 'Sign and return the form.',
    h_respondBy: 'Respond by {date}.', h_receive: 'You will receive {amt}. Nothing to do.', h_none: 'Nothing to do. Keep it for your records.',
    h_scam: "Don't pay and don't call the number on this letter.", h_help: 'Show this to someone you trust before you act.',
    h_cantRead: 'The photo is not clear enough to read.', h_overdue: 'This was due on {date}. Call the sender using a number you trust.',

    // ignore (RES-07)
    ig_pay: "If you don't pay, there may be a late fee or the service may stop.",
    ig_sign: "If you don't sign and return it, the benefit or service may stop.",
    ig_none: 'Nothing happens if you ignore this.',
    ig_scam: 'Nothing bad happens if you ignore a scam. Real agencies send more letters and never threaten arrest.',
    ig_deadline: 'If you miss the date, you may lose the chance to respond.',
    ig_unknown: "I can't tell what happens if you ignore this. Ask someone you trust.",

    // four questions (RES-01/02)
    q_who: 'Who sent this?', q_do: 'What should I do?', q_much: 'How much?', q_sign: 'Where do I sign?',
    a_noSign: 'No signature needed.', a_signFound: 'There is a place to sign. Tap to see it.', a_noMoney: 'No money is mentioned.',
    money_owe: 'You owe {amt}', money_receive: 'You will receive {amt}', money_unclear: 'I see {amt}, but not who pays it', money_info: '{amt} is mentioned for your information', money_none: 'No amount',
    unknownSender: "I can't tell who sent this.",

    steps: 'Steps', step_payCheck: 'Get your payment ready (check, card or online).', step_payMail: 'Send it using the envelope or the official website.', step_payBefore: 'Make sure it arrives before {date}.',
    step_signFind: 'Find the signature line (tap “Where do I sign?”).', step_signHelp: 'Ask someone you trust to read the form with you.', step_signSend: 'Send it back before {date}.',
    step_keep: 'Keep the letter in a safe place.', step_scam1: 'Keep the letter. Do not throw it away.', step_scam2: 'Call your trusted person.', step_scam3: 'If you want, report it (button below).',

    whyTitle: 'Why I decided this', whyNot: 'What I checked', found: 'found', notFound: 'not found',
    r_payment: 'It asks you to pay with {x}. Real agencies never ask for that.', r_ssn: 'It asks for your Social Security number.',
    r_urgency: 'It uses pressure words: “{x}”.', r_phrase: 'It uses a common scam phrase: “{x}”.', r_caps: 'It shouts in capital letters.',
    r_link: 'The web address ({x}) is not an official site.', r_squeeze: 'It gives you almost no time after it arrived.',
    r_weekend: 'The deadline leaves almost no working days.', r_contradiction: 'Some details do not match: {x}.',
    r_signature: 'It asks for your signature.', r_owe: 'It asks for money: {x}.', r_deadline: 'It has a deadline: {x}.',
    r_overdue: 'The deadline has already passed.', r_unclearDate: 'I found a date but could not read it for sure.',
    r_moneyUnclear: 'There is an amount, but I could not tell who pays it.', r_nothing: 'No money, no deadline, no signature and no scam signs.',
    r_receive: 'The money is coming to you: {x}.', r_noAction: 'The letter says you do not need to do anything.',
    c_payment: 'Unusual payment method', c_ssn: 'Social Security number request', c_urgency: 'Pressure language', c_link: 'Unofficial web link',
    c_money: 'Payment requested', c_deadline: 'Deadline', c_signature: 'Signature required',
    scamCount: '⚠ {n} scam signs found', scamCount1: '⚠ 1 scam sign found',
    cantVerify: 'This looks like it comes from {who}, but I cannot confirm that. Use the official website: {site}.',
    cantVerifyGeneric: 'I cannot confirm who really sent this. Use a phone number from your own card or bill, not from this letter.',
    teach: 'How we knew', learn: 'Next time, look for: {x}.',

    notRead: 'What I could not read', allRead: 'I could read everything I needed.',
    conf_clear: 'Clear', conf_review: 'Needs review', conf_cantTell: "I can't tell", conf_none: 'Not on this document',
    f_deadline: 'Deadline', f_amount: 'Amount', f_sender: 'Sender', f_type: 'Type of document',
    belongsQ: 'Is this letter for you?', belongsNo: 'I could not find your name on it. It may be for someone else.', belongsPartial: 'I found only part of your name. Check it is really for you.',

    type_bill: 'Bill', type_insurance: 'Insurance notice', type_gov: 'Government letter', type_medical: 'Medical letter', type_promo: 'Advertisement', type_other: 'Letter',
    typeConfirm: 'I think this is: {t}. Is that right?', typeFixed: 'Thanks. I will remember your answer for this document.',

    dontTitle: 'What not to do', dont1: "Don't pay.", dont2: "Don't sign.", dont3: "Don't call the number on the letter.", dont4: "Don't send your Social Security number.", dont5: "Don't throw it away. Keep it.",

    // controls
    play: 'Read it to me', pause: 'Pause', stop: 'Stop', slower: 'Slower', replay: 'Replay', readRest: 'Shall I read the rest?',
    rep_amount: 'Repeat the amount', rep_deadline: 'Repeat the deadline', rep_do: 'Repeat what I need to do',
    dontUnderstand: "I don't understand", level1: 'Plain words', level2: 'One sentence', level3: 'One step', level4: 'Ask someone you trust',
    showEvidence: 'Show me where it says this', showMatters: 'Show me what matters', original: 'Original words', easyRead: 'Easy Read',
    grounded: 'Ask about this letter', g_important: 'Is it important?', g_money: 'Is there money?', g_scam: 'Is it a scam?', g_do: 'What do I do?',
    g_imp_yes: 'Yes. {x}', g_imp_no: 'No. It does not need anything from you.',
    g_money_yes: 'Yes. {x}', g_money_no: 'No money is mentioned.',
    g_scam_yes: 'It has {n} signs of a scam. Treat it with care and ask someone you trust.', g_scam_no: 'I found no scam signs. I still cannot confirm who sent it.',
    timeline: 'Timeline', tl_today: 'Today', tl_due: 'Due',
    remind: 'Remind me before the deadline?', reminderSet: 'Reminder saved for {date}. Only the date and one sentence are saved — not the document.',
    addCalendar: 'Add to my calendar', later: 'Not now — remind me later', snoozed: 'Saved for later.',
    print: 'Print in large type', report: 'Report this', share: 'Send to someone I trust', call: 'Call', callScript: 'What to say when you call',
    handled: 'Mark as handled', handledDone: 'Marked as handled.',
    disclaimer: 'This is not financial or legal advice. Check with someone you trust.',
    tryAgain: 'Try again', fixDark: 'The photo is dark. Turn on a light and try again.', fixBlur: 'The photo is blurry. Hold the phone still with both hands.',
    fixPart: 'Try a photo of just the part with the date and amount.', fixShort: 'I found very few words. Make sure the whole page is in the photo.',
    notSureBody: 'I can read the page, but some important details are unclear. Please check with someone you trust.',

    // share (FAM-*)
    trustedTitle: 'Your trusted people', trustedIntro: 'Who can help you with letters? You can add up to three people.',
    tName: 'Name', tPhone: 'Phone number', tRelation: 'Who is this person?', tConsent: 'I agree that PaperShield may prepare messages to this person when I choose to send them.',
    tAdd: 'Add person', tRemove: 'Remove', tNone: 'No trusted person yet. Add one in Settings.',
    tLevel: 'What can this person receive?', lvl_alert: 'A short alert only', lvl_summary: 'The summary', lvl_all: 'Summary and photo',
    sendWhat: 'What do you want to send?', send_summary: 'Summary only', send_image: 'Photo only', send_both: 'Both',
    hideSensitive: 'I found {n} private numbers. Hide them before sending?', hideYes: 'Yes, hide them', hideNo: 'No, send as is',
    confirmSend: 'You are about to send this to {name}. Continue?', sent: 'Message ready. Check it and press send.',
    viaWhatsApp: 'WhatsApp', viaSms: 'Text message', viaShare: 'Other app',
    replyHint: 'They can reply to you on WhatsApp or by voice note.',
    msgIntro: 'Hi {name}, PaperShield checked a letter for me. Can you help?',
    msgType: 'Type', msgResult: 'Result', msgAmount: 'Amount', msgDeadline: 'Deadline', msgWhy: 'Why', msgSaid: 'The letter says',
    script1: 'Say: “I got a letter and I need help understanding it.”', script2: 'Read them the result and the deadline from this screen.', script3: 'Have the letter in your hand.', script4: 'Ask: “What should I do first?”',
    seniorCenter: 'My senior center or helper', familyReport: 'Monthly report for my family', reportText: 'This month: {n} documents, {s} needed a signature, {c} looked like scams.',

    // settings + accessibility
    setName: 'Your first name', setLang: 'Language', setProfile: 'How the app looks', setSpeed: 'Reading speed', setVoice: 'Voice', setAlerts: 'Alerts',
    prof_standard: 'Standard', prof_large: 'Larger text', prof_contrast: 'High contrast', prof_hearing: 'Hearing support', prof_lowvision: 'Low vision', prof_colorblind: 'Color-blind friendly',
    ask1: 'Is this text too small to read?', ask2: 'Is the sound loud enough?', ageOptional: 'Your age (optional)',
    speed_vslow: 'Very slow', speed_slow: 'Slow', speed_normal: 'Normal', speed_fast: 'Fast',
    theme: 'Colors', theme_system: 'Same as my phone', theme_light: 'Light', theme_dark: 'Dark', invert: 'Invert colors', brightness: 'Brightness',
    alert_sound: 'Sound', alert_vibrate: 'Vibration', alert_flash: 'Screen flash', toneMatch: 'Change the voice tone for warnings',
    oneHand: 'One-hand mode (buttons at the bottom)', magnifier: 'Magnifier when I touch the photo', readUnder: 'Read the line under the magnifier',
    noImprove: 'Do not use my data to improve PaperShield', noImproveNote: 'PaperShield never sends your documents anywhere. This is always on.',
    resetAll: 'Delete everything on this phone', resetConfirm: 'This deletes your settings, trusted people, reminders and counts. Continue?',
    keptTitle: 'What PaperShield keeps on this phone', kept1: 'Your settings and first name', kept2: 'Your trusted people', kept3: 'Reminders: a date and one sentence', kept4: 'A count of documents handled',
    notKept: 'Never kept: photos, document text, amounts, account numbers.', neverSent: 'Nothing leaves your phone unless you press send yourself.',
    noAccount: 'No account. No login.', welcome: 'Welcome to PaperShield', welcomeBody: 'Photograph a letter. PaperShield tells you what to do with it.', start: 'Start',
    glossary: 'Word list', tapWord: 'Tap an underlined word to see what it means.',
    installHint: 'Add PaperShield to your home screen: open your browser menu and choose “Add to Home screen”.',
    offline: 'Works without internet after the first visit.',
    demoBill: 'Electric bill', demoInsurance: 'Insurance renewal', demoGov: 'Benefits form', demoScam: 'Possible scam', demoRefund: 'Refund letter',
    sampleBadge: 'Sample letter — not real'
  };

  const es = {
    appName: 'PaperShield', tagline: 'No explica documentos. Decide.',
    goodMorning: 'Buenos días', goodAfternoon: 'Buenas tardes', goodEvening: 'Buenas noches',
    scan: 'Escanear un documento', scanSub: 'Apunte la cámara a la carta', upload: 'Elegir foto o PDF', readAloud: 'Leer la pantalla en voz alta',
    tryDemo: 'Probar una carta de ejemplo', phonePanic: '¿Alguien le está presionando por teléfono ahora mismo?', phonePanicTitle: 'Cuelgue ahora.',
    phonePanicBody: 'Las agencias del gobierno no piden pagos por teléfono. Las empresas reales esperan mientras usted verifica. Llame usando el número de su propia tarjeta o del sitio web oficial.',
    hangUpDone: 'Ya colgué', callTrusted: 'Llamar a mi persona de confianza',
    today: 'Qué hacer hoy', todayEmpty: 'No hay nada pendiente. Escanee una carta cuando llegue.', encourage: 'Este mes usted manejó {n} documentos. {h} necesitaron ayuda.',
    settings: 'Ajustes', help: 'Cómo decide', about: 'Acerca de', privacy: 'Privacidad', accessibility: 'Accesibilidad',
    back: 'Atrás', close: 'Cerrar', yes: 'Sí', no: 'No', next: 'Siguiente', done: 'Listo', cancel: 'Cancelar', undo: 'Deshacer', continue: 'Continuar', save: 'Guardar',
    camTitle: 'Mantenga la carta plana', camHint: 'Llene el cuadro con la página', camTooDark: 'Muy oscuro. Encienda una luz.', camGlare: 'Mucho reflejo. Incline un poco la página.',
    camBlur: 'No se mueva…', camCloser: 'Acérquese a la página.', camGood: 'Bien. Tomando la foto…', camCut: 'Parte de la página está cortada. Aléjese un poco.',
    takePhoto: 'Tomar foto', addPage: 'Agregar otra página', finish: 'Terminar y leer', pages: 'Páginas: {n}', duplicate: 'Ya capturó esta página.',
    cameraBlocked: 'La cámara está bloqueada. Puede elegir una foto.', pageOf: 'Parece la página {p} de {n}. ¿Capturar las otras páginas?', captureRest: 'Capturar el resto', skip: 'Omitir',
    cropTitle: 'Revise las esquinas', cropHint: 'Mueva los cuatro puntos a las esquinas de la página.', autoFix: 'Enderezar',
    reading: 'Leyendo su documento…', stepRead: 'Leyendo las palabras', stepCheck: 'Revisando las reglas', stepDelete: 'Borrando la foto',
    deleted: 'Foto borrada de la memoria de este teléfono', loadingLang: 'Preparando el lector (solo la primera vez)…',
    out_none: 'No necesita hacer nada', out_action: 'Necesita hacer algo', out_help: 'Pida ayuda a alguien de confianza', out_scam: 'Cuidado — señales de estafa',
    out_cantRead: 'No puedo leer esto', out_notSure: 'No estoy seguro',
    open_none: 'No se preocupe — esta carta no necesita nada de usted.', open_action: 'Esta carta necesita una cosa de usted.',
    open_help: 'Muestre esto a alguien de confianza antes de hacer algo.', open_scam: 'No responda, no pague, no firme. Guarde la carta.',
    band_overdue: 'La fecha ya pasó', band_urgent: 'Quedan {d} días', band_urgent1: 'Queda 1 día', band_today: 'Vence hoy', band_soon: 'Quedan {d} días', band_later: 'Quedan {d} días',
    band_unclear: 'Hay una fecha, pero no la puedo leer bien', band_nodate: 'Este documento no tiene fecha límite', overdueBy: 'La fecha pasó hace {d} días',
    h_payBy: 'Pague {amt} antes del {date}.', h_pay: 'Pague {amt}.', h_signBy: 'Firme y devuelva el formulario antes del {date}.', h_sign: 'Firme y devuelva el formulario.',
    h_respondBy: 'Responda antes del {date}.', h_receive: 'Usted recibirá {amt}. No tiene que hacer nada.', h_none: 'No tiene que hacer nada. Guárdela.',
    h_scam: 'No pague y no llame al número de esta carta.', h_help: 'Muestre esto a alguien de confianza antes de actuar.', h_cantRead: 'La foto no está lo bastante clara para leerla.',
    h_overdue: 'Esto vencía el {date}. Llame a quien la envió usando un número de confianza.',
    ig_pay: 'Si no paga, puede haber un cargo por atraso o el servicio puede cortarse.', ig_sign: 'Si no la firma y devuelve, el beneficio o servicio puede terminar.',
    ig_none: 'No pasa nada si ignora esto.', ig_scam: 'No pasa nada malo si ignora una estafa. Las agencias reales envían más cartas y nunca amenazan con arresto.',
    ig_deadline: 'Si pierde la fecha, puede perder la oportunidad de responder.', ig_unknown: 'No sé qué pasa si ignora esto. Pregunte a alguien de confianza.',
    q_who: '¿Quién la envió?', q_do: '¿Qué debo hacer?', q_much: '¿Cuánto?', q_sign: '¿Dónde firmo?',
    a_noSign: 'No necesita firmar.', a_signFound: 'Hay un lugar para firmar. Toque para verlo.', a_noMoney: 'No se menciona dinero.',
    money_owe: 'Usted debe {amt}', money_receive: 'Usted recibirá {amt}', money_unclear: 'Veo {amt}, pero no sé quién lo paga', money_info: '{amt} se menciona solo como información', money_none: 'Sin cantidad',
    unknownSender: 'No puedo saber quién la envió.',
    steps: 'Pasos', step_payCheck: 'Prepare su pago (cheque, tarjeta o en línea).', step_payMail: 'Envíelo en el sobre o por el sitio web oficial.', step_payBefore: 'Asegúrese de que llegue antes del {date}.',
    step_signFind: 'Busque la línea de firma (toque “¿Dónde firmo?”).', step_signHelp: 'Pida a alguien de confianza que lea el formulario con usted.', step_signSend: 'Devuélvalo antes del {date}.',
    step_keep: 'Guarde la carta en un lugar seguro.', step_scam1: 'Guarde la carta. No la tire.', step_scam2: 'Llame a su persona de confianza.', step_scam3: 'Si quiere, denúnciela (botón abajo).',
    whyTitle: 'Por qué decidí esto', whyNot: 'Lo que revisé', found: 'encontrado', notFound: 'no encontrado',
    r_payment: 'Le pide pagar con {x}. Las agencias reales nunca piden eso.', r_ssn: 'Le pide su número de Seguro Social.', r_urgency: 'Usa palabras de presión: “{x}”.',
    r_phrase: 'Usa una frase común de estafa: “{x}”.', r_caps: 'Grita en letras mayúsculas.', r_link: 'La dirección web ({x}) no es un sitio oficial.',
    r_squeeze: 'Le da casi nada de tiempo desde que llegó.', r_weekend: 'La fecha límite deja casi ningún día hábil.', r_contradiction: 'Algunos datos no coinciden: {x}.',
    r_signature: 'Pide su firma.', r_owe: 'Pide dinero: {x}.', r_deadline: 'Tiene fecha límite: {x}.', r_overdue: 'La fecha límite ya pasó.',
    r_unclearDate: 'Encontré una fecha pero no pude leerla con seguridad.', r_moneyUnclear: 'Hay una cantidad, pero no sé quién la paga.',
    r_nothing: 'Sin dinero, sin fecha límite, sin firma y sin señales de estafa.', r_receive: 'El dinero es para usted: {x}.', r_noAction: 'La carta dice que no tiene que hacer nada.',
    c_payment: 'Forma de pago inusual', c_ssn: 'Pide Seguro Social', c_urgency: 'Palabras de presión', c_link: 'Enlace no oficial', c_money: 'Pide pago', c_deadline: 'Fecha límite', c_signature: 'Requiere firma',
    scamCount: '⚠ {n} señales de estafa', scamCount1: '⚠ 1 señal de estafa',
    cantVerify: 'Parece que viene de {who}, pero no lo puedo confirmar. Use el sitio web oficial: {site}.',
    cantVerifyGeneric: 'No puedo confirmar quién la envió. Use un número de su propia tarjeta o factura, no de esta carta.',
    teach: 'Cómo lo supimos', learn: 'La próxima vez, busque: {x}.',
    notRead: 'Lo que no pude leer', allRead: 'Pude leer todo lo necesario.',
    conf_clear: 'Claro', conf_review: 'Revisar', conf_cantTell: 'No puedo saber', conf_none: 'No aparece',
    f_deadline: 'Fecha límite', f_amount: 'Cantidad', f_sender: 'Remitente', f_type: 'Tipo de documento',
    belongsQ: '¿Esta carta es para usted?', belongsNo: 'No encontré su nombre. Puede ser para otra persona.', belongsPartial: 'Encontré solo parte de su nombre. Verifique que sea para usted.',
    type_bill: 'Factura', type_insurance: 'Aviso de seguro', type_gov: 'Carta del gobierno', type_medical: 'Carta médica', type_promo: 'Publicidad', type_other: 'Carta',
    typeConfirm: 'Creo que esto es: {t}. ¿Es correcto?', typeFixed: 'Gracias. Usaré su respuesta para este documento.',
    dontTitle: 'Qué no hacer', dont1: 'No pague.', dont2: 'No firme.', dont3: 'No llame al número de la carta.', dont4: 'No envíe su número de Seguro Social.', dont5: 'No la tire. Guárdela.',
    play: 'Léamelo', pause: 'Pausa', stop: 'Parar', slower: 'Más lento', replay: 'Repetir', readRest: '¿Leo el resto?',
    rep_amount: 'Repetir la cantidad', rep_deadline: 'Repetir la fecha', rep_do: 'Repetir qué hacer',
    dontUnderstand: 'No entiendo', level1: 'Palabras simples', level2: 'Una frase', level3: 'Un paso', level4: 'Pregunte a alguien de confianza',
    showEvidence: 'Muéstreme dónde lo dice', showMatters: 'Muéstreme lo importante', original: 'Palabras originales', easyRead: 'Lectura fácil',
    grounded: 'Preguntar sobre esta carta', g_important: '¿Es importante?', g_money: '¿Hay dinero?', g_scam: '¿Es una estafa?', g_do: '¿Qué hago?',
    g_imp_yes: 'Sí. {x}', g_imp_no: 'No. No necesita nada de usted.', g_money_yes: 'Sí. {x}', g_money_no: 'No se menciona dinero.',
    g_scam_yes: 'Tiene {n} señales de estafa. Tenga cuidado y pregunte a alguien de confianza.', g_scam_no: 'No encontré señales de estafa. Aun así no puedo confirmar quién la envió.',
    timeline: 'Línea de tiempo', tl_today: 'Hoy', tl_due: 'Vence',
    remind: '¿Le recuerdo antes de la fecha?', reminderSet: 'Recordatorio guardado para el {date}. Solo se guarda la fecha y una frase, no el documento.',
    addCalendar: 'Agregar a mi calendario', later: 'Ahora no — recuérdeme después', snoozed: 'Guardado para después.',
    print: 'Imprimir en letra grande', report: 'Denunciar esto', share: 'Enviar a alguien de confianza', call: 'Llamar', callScript: 'Qué decir al llamar',
    handled: 'Marcar como resuelto', handledDone: 'Marcado como resuelto.',
    disclaimer: 'Esto no es asesoría financiera ni legal. Consulte con alguien de confianza.',
    tryAgain: 'Intentar otra vez', fixDark: 'La foto está oscura. Encienda una luz e intente otra vez.', fixBlur: 'La foto está borrosa. Sostenga el teléfono quieto con las dos manos.',
    fixPart: 'Tome una foto solo de la parte con la fecha y la cantidad.', fixShort: 'Encontré muy pocas palabras. Asegúrese de que toda la página esté en la foto.',
    notSureBody: 'Puedo leer la página, pero algunos datos importantes no están claros. Consulte con alguien de confianza.',
    trustedTitle: 'Sus personas de confianza', trustedIntro: '¿Quién le puede ayudar con cartas? Puede agregar hasta tres personas.',
    tName: 'Nombre', tPhone: 'Teléfono', tRelation: '¿Quién es esta persona?', tConsent: 'Acepto que PaperShield prepare mensajes para esta persona cuando yo decida enviarlos.',
    tAdd: 'Agregar persona', tRemove: 'Quitar', tNone: 'Todavía no hay persona de confianza. Agregue una en Ajustes.',
    tLevel: '¿Qué puede recibir esta persona?', lvl_alert: 'Solo un aviso corto', lvl_summary: 'El resumen', lvl_all: 'Resumen y foto',
    sendWhat: '¿Qué quiere enviar?', send_summary: 'Solo el resumen', send_image: 'Solo la foto', send_both: 'Los dos',
    hideSensitive: 'Encontré {n} números privados. ¿Ocultarlos antes de enviar?', hideYes: 'Sí, ocultarlos', hideNo: 'No, enviar así',
    confirmSend: 'Va a enviar esto a {name}. ¿Continuar?', sent: 'Mensaje listo. Revíselo y presione enviar.',
    viaWhatsApp: 'WhatsApp', viaSms: 'Mensaje de texto', viaShare: 'Otra aplicación', replyHint: 'Le pueden responder por WhatsApp o con una nota de voz.',
    msgIntro: 'Hola {name}, PaperShield revisó una carta para mí. ¿Me ayudas?', msgType: 'Tipo', msgResult: 'Resultado', msgAmount: 'Cantidad', msgDeadline: 'Fecha límite', msgWhy: 'Por qué', msgSaid: 'La carta dice',
    script1: 'Diga: “Recibí una carta y necesito ayuda para entenderla.”', script2: 'Léale el resultado y la fecha de esta pantalla.', script3: 'Tenga la carta en la mano.', script4: 'Pregunte: “¿Qué hago primero?”',
    seniorCenter: 'Mi centro de mayores o ayudante', familyReport: 'Informe mensual para mi familia', reportText: 'Este mes: {n} documentos, {s} necesitaron firma, {c} parecían estafas.',
    setName: 'Su nombre', setLang: 'Idioma', setProfile: 'Cómo se ve la aplicación', setSpeed: 'Velocidad de lectura', setVoice: 'Voz', setAlerts: 'Avisos',
    prof_standard: 'Normal', prof_large: 'Letra más grande', prof_contrast: 'Alto contraste', prof_hearing: 'Apoyo auditivo', prof_lowvision: 'Baja visión', prof_colorblind: 'Para daltonismo',
    ask1: '¿Este texto es demasiado pequeño?', ask2: '¿El sonido es suficientemente alto?', ageOptional: 'Su edad (opcional)',
    speed_vslow: 'Muy lento', speed_slow: 'Lento', speed_normal: 'Normal', speed_fast: 'Rápido',
    theme: 'Colores', theme_system: 'Igual que mi teléfono', theme_light: 'Claro', theme_dark: 'Oscuro', invert: 'Invertir colores', brightness: 'Brillo',
    alert_sound: 'Sonido', alert_vibrate: 'Vibración', alert_flash: 'Destello de pantalla', toneMatch: 'Cambiar el tono de voz en advertencias',
    oneHand: 'Modo una mano (botones abajo)', magnifier: 'Lupa al tocar la foto', readUnder: 'Leer la línea bajo la lupa',
    noImprove: 'No usar mis datos para mejorar PaperShield', noImproveNote: 'PaperShield nunca envía sus documentos a ningún lugar. Esto siempre está activo.',
    resetAll: 'Borrar todo en este teléfono', resetConfirm: 'Esto borra sus ajustes, personas de confianza, recordatorios y conteos. ¿Continuar?',
    keptTitle: 'Lo que PaperShield guarda en este teléfono', kept1: 'Sus ajustes y su nombre', kept2: 'Sus personas de confianza', kept3: 'Recordatorios: una fecha y una frase', kept4: 'Un conteo de documentos',
    notKept: 'Nunca se guarda: fotos, texto del documento, cantidades, números de cuenta.', neverSent: 'Nada sale de su teléfono a menos que usted presione enviar.',
    noAccount: 'Sin cuenta. Sin contraseña.', welcome: 'Bienvenido a PaperShield', welcomeBody: 'Tome una foto de una carta. PaperShield le dice qué hacer.', start: 'Empezar',
    glossary: 'Lista de palabras', tapWord: 'Toque una palabra subrayada para ver qué significa.',
    installHint: 'Agregue PaperShield a su pantalla: abra el menú del navegador y elija “Agregar a pantalla de inicio”.', offline: 'Funciona sin internet después de la primera visita.',
    demoBill: 'Factura de luz', demoInsurance: 'Renovación de seguro', demoGov: 'Formulario de beneficios', demoScam: 'Posible estafa', demoRefund: 'Carta de reembolso',
    sampleBadge: 'Carta de ejemplo — no es real'
  };

  // RES-20 / RES-21 glossary
  const glossary = {
    en: {
      'due date': 'The last day to pay or answer.', premium: 'The amount you pay for your insurance.', balance: 'The money still owed on an account.',
      notice: 'A letter that tells you about something official.', renewal: 'Continuing something for another period, like a policy or a benefit.',
      appeal: 'Asking for a decision to be looked at again.', deductible: 'What you pay yourself before insurance starts to pay.',
      statement: 'A list of charges and payments for a period.', 'past due': 'Not paid by the deadline.', coverage: 'What your insurance pays for.',
      beneficiary: 'The person who receives money or a benefit.', eligibility: 'Whether you are allowed to get something.', 'late fee': 'Extra money charged for paying late.',
      refund: 'Money paid back to you.', invoice: 'A bill asking for payment.', 'account number': 'The number a company uses to find your account.',
      verify: 'To check that something is true.', warrant: 'A paper from a court. Real warrants are never sent by mail asking for money.'
    },
    es: {
      'fecha de vencimiento': 'El último día para pagar o responder.', prima: 'La cantidad que paga por su seguro.', saldo: 'El dinero que todavía se debe en una cuenta.',
      aviso: 'Una carta que le informa algo oficial.', renovación: 'Continuar algo por otro período, como una póliza o un beneficio.',
      apelación: 'Pedir que una decisión se revise otra vez.', deducible: 'Lo que usted paga antes de que el seguro empiece a pagar.',
      'estado de cuenta': 'Una lista de cargos y pagos de un período.', vencido: 'No pagado a tiempo.', cobertura: 'Lo que su seguro paga.',
      reembolso: 'Dinero que le devuelven.', factura: 'Una cuenta que pide pago.', 'número de cuenta': 'El número que usa una empresa para encontrar su cuenta.'
    }
  };

  const dict = { en, es };
  let lang = 'en';
  function t(key, vars) {
    let s = (dict[lang] && dict[lang][key]) || en[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function setLang(l) { lang = dict[l] ? l : 'en'; document.documentElement.lang = lang; }
  function getLang() { return lang; }
  function fmtDate(d) {
    if (!d) return '';
    return d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  root.PSi18n = { t, setLang, getLang, fmtDate, glossary, dict };
})(typeof window !== 'undefined' ? window : globalThis);
