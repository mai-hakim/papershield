# PaperShield

**It doesn't explain documents. It decides.**

Photograph a letter. PaperShield gives one of four answers — no action needed, action needed, ask someone you trust, or careful: signs of a scam — and shows the exact line in the letter the answer came from. Everything runs on the phone.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | The app |
| `welcome.html` | Landing page (the story: a letter arrives → scan → understand → decide → get help) |
| `test.html` | Pilot test page for the team: scores the app on real documents against fixed targets |
| `privacy.html`, `accessibility.html`, `about.html` | Policy and info pages (fill in the `[ ]` placeholders) |
| `js/rules.js` | The fixed decision rules and published word lists — the heart of the app |
| `js/explain.js` | Turns the rules' result into plain sentences |
| `js/i18n.js` | Every word on screen, English and Spanish |
| `js/engine.js` | Camera checks, crop and straighten, on-device text reading (OCR), PDF and QR reading |
| `js/app.js`, `js/core.js` | Screens, storage on the phone, read-aloud, alerts |
| `vendor/` | Libraries stored locally (no outside servers): Tesseract.js OCR, pdf.js, jsQR, Atkinson Hyperlegible font |
| `test-set/` | 5 synthetic hard test images + answer sheet (all fictional) |
| `docs/IDEAS_STATUS.md` | Status of all 169 ideas from the team review sheet |
| `docs/DEMO_SCRIPT.md` | 75-second demo story, two-phone demo, video script |

## Put it online with GitHub Pages (free)

1. Sign in at github.com → **New repository** → name it `papershield` → **Public** → Create.
2. On the new repository page click **uploading an existing file**.
3. Drag **everything inside this folder** (not the folder itself) into the page. Wait until every file shows. Click **Commit changes**.
4. Go to **Settings → Pages**. Under *Branch* choose `main` and `/ (root)` → **Save**.
5. Wait 1–2 minutes. Your app is at `https://YOUR-USERNAME.github.io/papershield/`.
6. On the phone, open that link → browser menu → **Add to Home screen**.

The first visit downloads the text reader (about 13 MB). After that it works without internet.

> GitHub Pages needs the repository to be **public** on the free plan, so anyone can read the code. The code contains no passwords or keys. If you plan to sell, read “Selling” below.

## Security — what was done

- **Nothing is uploaded.** Text reading (OCR), rules and results all run in the phone's browser.
- **No outside servers.** All libraries and fonts are stored in `vendor/`. A strict Content Security Policy in every page blocks scripts, fonts and connections from anywhere else.
- **No keys or secrets** anywhere in the code.
- **No account, no login, no analytics, no cookies.**
- Photos exist only in memory while a result is open, and are wiped when it closes.
- Saved on the phone only: settings, trusted people, reminders (a date + one sentence), monthly counts.
- Private numbers (SSN, account, card) are masked on screen and can be hidden before sharing.
- Links to WhatsApp/SMS open only after the user sees the exact message.

## Selling — do these first

1. **Ownership.** The ideas came from the Fair Chance Futures AI Lab Team 3 review. Get written agreement from the team and check the program's IP terms before charging money.
2. **Name.** A web search on 6 Oct 2026 found no app called PaperShield. Still check **tmsearch.uspto.gov**, the App Store, Google Play and the domain before paying for anything.
3. **Private code.** Move to a private repository and host on Cloudflare Pages (free, works with private repos).
4. **Legal review.** Have a lawyer check `privacy.html`, the disclaimer and the line “It decides”.
5. **Spanish review** by a native speaker.
6. **Google Play:** wrap with PWABuilder (pwabuilder.com) → one-time $25 developer fee. **App Store:** $99/year; Apple may reject apps that are only a website in a wrapper.
7. Keep the license notices in `vendor/` (Apache-2.0 and SIL OFL allow commercial use with notice). See `THIRD_PARTY.md`.

## Change the rules

All decision logic is in `js/rules.js`: the word lists at the top (`LISTS`), the official sites (`AGENCIES`) and the decision table (`TABLE`, checked in order R0 → R10). The in-app page “How it decides” shows the same table and lists automatically.

## Run the tests

Open `test.html`, choose `test-set/answer-sheet.csv` and the 5 images, enter test date `2026-10-06`, press **Run the test**. Replace them with your 20 real documents and your own answer sheet for the pilot.

---
PaperShield gives information, not financial or legal advice. © [YEAR] [OWNER]. All rights reserved.
