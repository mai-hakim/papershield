# PaperShield — status of all ideas from the Team 3 review sheet

Checked against every row of the sheet (169 ideas). Counts: Done: 125, Not chosen: 5, Not possible: 6, Partial: 26, People task: 7.

"Done" means built and tested in the app as described. "Partial" says exactly what is missing.

## A.  THE DECISION & HOW WE CLASSIFY

| ID | Idea | Status | Notes |
|---|---|---|---|
| DEC-01 | Three outcomes: Routine / Needs someone / Suspicious | Not chosen | You chose 4 outcomes (DEC-02). |
| DEC-02 | Split into four outcomes instead of three | Done | No action / Action needed / Ask someone you trust / Signs of a scam. |
| DEC-03 | Separate 'what the document is' from 'is it a scam' | Done | Rules engine (js/rules.js) + result screen |
| DEC-04 | Ordered decision tree | Done | Rules engine (js/rules.js) + result screen |
| DEC-05 | Full decision table | Done | Rules engine (js/rules.js) + result screen |
| DEC-06 | Rules decide, AI only extracts | Partial | On-device OCR extracts; fixed rules decide. No AI model is used. |
| DEC-07 | Replace 'throw it away' with 'don't reply, don't pay, don't sign — keep it' | Done | Rules engine (js/rules.js) + result screen |
| DEC-08 | Plainer outcome names | Done | Rules engine (js/rules.js) + result screen |
| DEC-09 | Keep 'It decides' as our positioning line | Done | Tagline in app, landing page, About. |
| DEC-10 | Softer positioning line | Not chosen | You chose DEC-09. |
| DEC-11 | Fourth colour band: no date on the document | Done | Rules engine (js/rules.js) + result screen |
| DEC-12 | Band for an overdue deadline | Done | Rules engine (js/rules.js) + result screen |
| DEC-13 | Band for an unreadable or unconfirmed date | Done | Rules engine (js/rules.js) + result screen |
| DEC-14 | Colour + icon + word — never colour alone | Done | Rules engine (js/rules.js) + result screen |
| DEC-15 | Human time language | Done | Rules engine (js/rules.js) + result screen |
| DEC-16 | Disclaimer on every result screen | Done | Rules engine (js/rules.js) + result screen |
| DEC-17 | Document type recognition | Partial | Type found by keyword rules, not AI. User can correct it (DEC-18). |
| DEC-18 | Ask the user to confirm the type | Done | Rules engine (js/rules.js) + result screen |

## B.  THE RESULT SCREEN

| ID | Idea | Status | Notes |
|---|---|---|---|
| RES-01 | Four fixed questions, same order every time | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-02 | Reword the four questions into plain speech | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-03 | 'What do I need to do?' as the headline | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-04 | Add: 'Does this document belong to you?' | Partial | Checks the first name typed in onboarding. Address check not built. |
| RES-05 | Distinguish money owed from money owed to you | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-06 | One large sentence at the top of the result | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-07 | 'What happens if I ignore this?' | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-08 | Numbered steps | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-09 | 'What I could not read' section | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-10 | Confidence in words, not a percentage | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-11 | Confidence per field, not per document | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-12 | Reassuring opening sentence | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-13 | 'I don't understand' button | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-14 | Define the levels of 'I don't understand' | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-15 | Escalating 'I don't understand' | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-16 | Replay / slow down / stop | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-17 | Repeat only one part | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-18 | Read in chunks with pauses | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-19 | Easy Read beside the original | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-20 | Tap a hard word for its meaning | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-21 | Built-in glossary | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-22 | Document timeline | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-23 | 'What not to do' card | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-24 | Home screen: one giant camera button | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-25 | Greeting with the user's name | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-26 | Three equal input options (camera / text-to-speech / upload) | Done (combined) | Giant camera button + smaller upload and read-aloud buttons below it (with RES-24). |
| RES-27 | Chat box | Not possible (free version) | Free-text chat needs an AI model. Replaced by RES-28. |
| RES-28 | Document-grounded questions instead of open chat | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-29 | Activity screen ('20 documents this month') | Done (combined) | Count kept, shown as encouragement (RES-30). |
| RES-30 | Activity reworded as encouragement | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-31 | 'What should I do today?' instead of an activity log | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-32 | Document inbox with statuses | Partial | Home shows open items with "Mark as handled". Full status inbox not built. |
| RES-33 | Magnifying glass on touch | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-34 | Magnifier that also reads the line it is over | Done | Result / home screen (js/app.js, js/explain.js) |
| RES-35 | One-hand mode | Done | Result / home screen (js/app.js, js/explain.js) |

## C.  EVIDENCE & EXPLAINABILITY

| ID | Idea | Status | Notes |
|---|---|---|---|
| EVD-01 | Evidence screen — highlight the line the decision came from | Done | Evidence screen + "Why I decided this" |
| EVD-02 | Auto-zoom and read that line aloud | Done | Evidence screen + "Why I decided this" |
| EVD-03 | 'Why did you decide this?' in plain words | Done | Evidence screen + "Why I decided this" |
| EVD-04 | Evidence chips | Done | Evidence screen + "Why I decided this" |
| EVD-05 | 'Why did you NOT flag this?' | Done | Evidence screen + "Why I decided this" |
| EVD-06 | Colour-coded overlay on the image | Done | Evidence screen + "Why I decided this" |
| EVD-07 | 'Show me what matters' | Done | Evidence screen + "Why I decided this" |
| EVD-08 | Jump to the right page | Done | Evidence screen + "Why I decided this" |
| EVD-09 | Architecture diagram for the presentation | Done | Evidence screen + "Why I decided this" |

## D.  SCAM DETECTION

| ID | Idea | Status | Notes |
|---|---|---|---|
| SCM-01 | Scam alert | Done | Rules engine + result screen |
| SCM-02 | Never say 'this is a scam' — say 'signs of a scam' | Done | Rules engine + result screen |
| SCM-03 | Published scam word list | Done | Rules engine + result screen |
| SCM-04 | Suspicious payment methods as the strongest signal | Done | Rules engine + result screen |
| SCM-05 | Urgency and threat language detection | Done | Rules engine + result screen |
| SCM-06 | Count the signals | Done | Rules engine + result screen |
| SCM-07 | 'Call the official number, not the one on the letter' | Partial | Shows the official WEBSITE for IRS, SSA, Medicare, USPS, FTC, DMV. Phone numbers not included until verified from each official site. |
| SCM-08 | Sender verification against known agencies | Partial | Fixed local list of 6 agencies and their official sites only. |
| SCM-09 | Say plainly what we cannot verify | Done | Rules engine + result screen |
| SCM-10 | Fake urgency check | Done | Rules engine + result screen |
| SCM-11 | Weekend / holiday squeeze detection | Partial | Weekends counted; public holidays not counted. |
| SCM-12 | QR code and link safety check | Done | Rules engine + result screen |
| SCM-13 | Match against published FTC / AARP scam campaigns | Partial | Published phrase list only; no live FTC/AARP campaign matching. |
| SCM-14 | Internal contradiction detection | Done | Rules engine + result screen |
| SCM-15 | 'Report this' button | Done | Rules engine + result screen |
| SCM-16 | Phone-call panic button | Done | Rules engine + result screen |
| SCM-17 | 20-second teaching moment after each catch | Done | Rules engine + result screen |
| SCM-18 | Logo and letterhead forgery detection | Not possible (free version) | Logo comparison needs image AI. |
| SCM-19 | Community scam database | Not possible (free version) | Needs a server and would break the on-device privacy promise. |

## E.  CAMERA & CAPTURE

| ID | Idea | Status | Notes |
|---|---|---|---|
| CAM-01 | Live guidance before the shot | Partial | Light, glare, blur, distance and cut-off checks in the browser. Weaker than a native app. |
| CAM-02 | Auto-capture when the image is good | Partial | Takes the photo after the image is good and steady for about 2 seconds. |
| CAM-03 | Shake tolerance | Partial | Waits until frames stop moving. |
| CAM-04 | Auto-crop, straighten and correct perspective | Partial | Suggests a box around the page; user drags 4 corners; perspective is corrected. Auto-detection of tilted corners is basic. |
| CAM-05 | Multi-page capture | Done | Camera / crop screens (js/engine.js) |
| CAM-06 | 'This looks like page 3 of 5 — capture the rest?' | Done | Camera / crop screens (js/engine.js) |
| CAM-07 | Duplicate page detection | Done | Camera / crop screens (js/engine.js) |
| CAM-08 | Accept PDF, screenshots and emailed images | Done | Camera / crop screens (js/engine.js) |
| CAM-09 | Guided 'I can't read this' screen | Done | Camera / crop screens (js/engine.js) |
| CAM-10 | 'I'm not sure' as a separate state from 'I can't read this' | Done | Camera / crop screens (js/engine.js) |

## F.  PRIVACY

| ID | Idea | Status | Notes |
|---|---|---|---|
| PRV-01 | Upload → answer → delete, nothing stored | Done (reworded) | Replaced by the exact promise in PRV-02. |
| PRV-02 | State exactly what IS kept | Done | Whole app; Privacy page |
| PRV-03 | Visible deletion indicator | Done | Whole app; Privacy page |
| PRV-04 | Counter stored on the device only | Done | Whole app; Privacy page |
| PRV-05 | On-device processing | Done | Reading and rules run on the phone. Nothing uploaded. |
| PRV-06 | No login, no account | Done | Whole app; Privacy page |
| PRV-07 | Mask sensitive numbers on screen | Done | Whole app; Privacy page |
| PRV-08 | Offer to hide sensitive data before sharing | Done | Whole app; Privacy page |
| PRV-09 | 'Do not use my data to improve the system' setting | Done | Whole app; Privacy page |
| PRV-10 | No payment, no signing, no auto-reply in the app | Done | Whole app; Privacy page |

## G.  TRUSTED CONTACT & FAMILY

| ID | Idea | Status | Notes |
|---|---|---|---|
| FAM-01 | Send to a trusted contact | Done | Share flow + trusted people in Settings |
| FAM-02 | Consent when adding a trusted contact | Done | Share flow + trusted people in Settings |
| FAM-03 | Preview and confirm before every send | Done | Share flow + trusted people in Settings |
| FAM-04 | Choose what to send | Done | Share flow + trusted people in Settings |
| FAM-05 | Structured summary for the recipient | Done | Share flow + trusted people in Settings |
| FAM-06 | Recipient sees the evidence too | Done | Share flow + trusted people in Settings |
| FAM-07 | 'Got it, I'll call you' button | Not possible (free version) | Needs a server so the sender can see the tap. Replaced by replying on WhatsApp. |
| FAM-08 | Direct call button | Done | Share flow + trusted people in Settings |
| FAM-09 | Call preparation script | Done | Share flow + trusted people in Settings |
| FAM-10 | Ready-made WhatsApp or SMS message | Partial | WhatsApp/SMS links carry the text. Photo is attached only through the phone share sheet (where supported). |
| FAM-11 | Two or three saved trusted people | Done | Share flow + trusted people in Settings |
| FAM-12 | Permission tiers per contact | Done | Share flow + trusted people in Settings |
| FAM-13 | Separate caregiver view | Not possible (free version) | A second caregiver interface needs accounts and a server. |
| FAM-14 | Weekly or monthly family report | Partial | Monthly report text built on the phone; user sends it themselves. |
| FAM-15 | Voice reply from the trusted contact | Partial | Voice reply happens in WhatsApp, outside the app. |
| FAM-16 | 'Send to my senior centre' | Done | Share flow + trusted people in Settings |

## H.  ACCESSIBILITY & SETTINGS

| ID | Idea | Status | Notes |
|---|---|---|---|
| ACC-01 | Tap-only input, no voice required | Done | Settings, onboarding, CSS profiles |
| ACC-02 | Preset accessibility profiles | Done | Settings, onboarding, CSS profiles |
| ACC-03 | Presets based on age | Done (combined) | Age is optional; 80+ suggests larger text. |
| ACC-04 | Presets based on need, asked as two friendly questions | Done (combined) | Two friendly questions in onboarding. |
| ACC-05 | Live preview when choosing a profile | Done | Settings, onboarding, CSS profiles |
| ACC-06 | Full settings menu | Done (combined) | Full settings menu alongside the presets. |
| ACC-07 | Speech speed including a 'very slow' option | Done | Settings, onboarding, CSS profiles |
| ACC-08 | Human-recorded voices instead of synthetic | Not possible (free version) | Needs real people to record voices. Uses the phone voice with speed and tone control. |
| ACC-09 | Different tone per outcome | Done | Settings, onboarding, CSS profiles |
| ACC-10 | Flash + vibration + sound alerts | Done | Settings, onboarding, CSS profiles |
| ACC-11 | Spanish | Partial | Full Spanish interface. NOT yet reviewed by a native speaker. |
| ACC-12 | More LA languages | Partial | Not started: the 5 extra languages need translators. Interface is ready for more languages. |
| ACC-13 | Auto-detect the document's language | Partial | Reads English and Spanish documents and answers in the chosen language. Other languages not detected. |
| ACC-14 | VoiceOver / TalkBack support | Partial | Labels and live regions added. Not tested with VoiceOver or TalkBack yet. |
| ACC-15 | Dynamic type instead of fixed font sizes | Done | Settings, onboarding, CSS profiles |
| ACC-16 | Section 508 compliance | Partial | Built toward Section 508. Not audited. The app makes no compliance claim. |
| ACC-17 | Accessibility statement listing what we actually tested | Done | Settings, onboarding, CSS profiles |
| ACC-18 | Accessibility testing as part of the project | Partial | One automated phone-size browser run done. Screen reader, color-blind, low-vision and one-hand tests not run. |
| ACC-19 | Large-print printable summary | Done | Settings, onboarding, CSS profiles |
| ACC-20 | Guided signing mode | Partial | "Where do I sign?" opens the photo at the signature line. Step-by-step talk-through not built. |
| ACC-21 | Undo window and confirmation on destructive taps | Done | Settings, onboarding, CSS profiles |

## I.  DEADLINES & REMINDERS

| ID | Idea | Status | Notes |
|---|---|---|---|
| REM-01 | Extract the deadline automatically | Done | Result screen + home "What to do today" |
| REM-02 | Offer a reminder before the deadline | Partial | Reminder saved on the phone and shown + alerted when the app is opened. No background notification without a server; use REM-03 for a phone alert. |
| REM-03 | Add to calendar in one tap | Done | Result screen + home "What to do today" |
| REM-04 | Snooze / 'not now' | Done | Result screen + home "What to do today" |

## J.  HOW WE PROVE IT WORKS

| ID | Idea | Status | Notes |
|---|---|---|---|
| TST-01 | 20 real documents, 5 of them real scams | People task | Collect 20 real documents (5 real scams). The test page scores them. |
| TST-02 | Raise the test set to 100 documents | People task | Same, 100 documents. |
| TST-03 | Set pass targets before we test | Done | Targets fixed in the test page: 90% correct, 0 missed scams, max 2 false alarms, 100% correct "can't read". |
| TST-04 | Report false positives as the headline number | Done (combined) | Both shown as headline numbers. |
| TST-05 | Report missed scams as the headline number | Done (combined) | Both shown as headline numbers. |
| TST-06 | Measure amount and date accuracy separately | Done | test.html |
| TST-07 | Measure correct 'I don't know' responses | Done | test.html |
| TST-08 | Usability test with real seniors | People task | Needs 5–8 older adults. |
| TST-09 | Measure whether the user took the right next step unaided | People task | Needs real users; observe whether they take the right step. |
| TST-10 | Red team the system on purpose | Partial | 5 synthetic hard cases built (blur, dark, two amounts, scam photo). Real folded/handwritten letters still needed. |
| TST-11 | Error gallery in the presentation | Done | Error gallery generated by the test page. |
| TST-12 | Call it 'an initial pilot on 20 documents' | Done | Wording built into the test report. |

## K.  DEMO & PRESENTATION

| ID | Idea | Status | Notes |
|---|---|---|---|
| DEM-01 | Demo mode with pre-loaded documents | Done | App sample letters, welcome.html, DEMO_SCRIPT.md |
| DEM-02 | Live scan of a real scam letter | People task | Needs a real scam letter. |
| DEM-03 | Two phones: parent scans, child receives | Done | Phone 1 sends the summary by WhatsApp; phone 2 receives it. See DEMO_SCRIPT.md. |
| DEM-04 | Before / after visual | Done | App sample letters, welcome.html, DEMO_SCRIPT.md |
| DEM-05 | One continuous 60-90 second story | Done | App sample letters, welcome.html, DEMO_SCRIPT.md |
| DEM-06 | Landing page as a story | Done | App sample letters, welcome.html, DEMO_SCRIPT.md |
| DEM-07 | Interactive 'try it' on the landing page | Partial | Landing page links to the app's sample letters rather than an embedded demo. |
| DEM-08 | About us page | Done | App sample letters, welcome.html, DEMO_SCRIPT.md |
| DEM-09 | Short how-to video | People task | Script written in DEMO_SCRIPT.md; recording needs a person and a phone. |
| DEM-10 | Real user story or testimonial | People task | Needs a real person. |

## L.  NAME & POSITIONING

| ID | Idea | Status | Notes |
|---|---|---|---|
| NAM-01 | ScanSAY | Not chosen | Chosen name: PaperShield. |
| NAM-02 | Clean Speak | Not chosen | Chosen name: PaperShield. |
| NAM-03 | Alternative names | Not chosen | Chosen name: PaperShield. |
| NAM-04 | Check any name before committing | Partial | Web search on 6 Oct 2026 found no app called PaperShield. USPTO, App Store, Google Play and domain NOT checked yet. |
| NAM-05 | Tagline | Done | "It doesn't explain documents. It decides." |
