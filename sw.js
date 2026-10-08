/* PaperShield offline support.
   Keeps a copy of the app's OWN files on the phone so it opens without internet.
   It never stores, reads or sends letters, photos or results:
   only GET requests to this site's own files are cached.

   Updates: app files are shown from the saved copy, and a fresh copy is
   downloaded in the background. So after you publish a change, people see it
   the next time they open the app. No version number to change by hand. */

const SHELL = 'papershield-shell';   // small app files: refreshed in the background
const HEAVY = 'papershield-heavy';   // big text-reader files: downloaded once, they rarely change

const SHELL_FILES = [
  './', 'index.html', 'welcome.html', 'privacy.html', 'accessibility.html', 'about.html', 'test.html',
  'manifest.webmanifest', 'css/app.css',
  'js/i18n.js', 'js/i18n-extra.js', 'js/store.js', 'js/static.js', 'js/tests.js', 'js/ui.js', 'js/rules.js', 'js/explain.js', 'js/demo.js', 'js/core.js', 'js/engine.js', 'js/app.js',
  'vendor/tesseract/tesseract.min.js', 'vendor/pdfjs/pdf.min.js', 'vendor/jsqr/jsQR.js',
  'vendor/fonts/atkinson-hyperlegible-latin-400-normal.woff2',
  'vendor/fonts/atkinson-hyperlegible-latin-700-normal.woff2',
  'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-512-maskable.png', 'assets/apple-touch-icon.png',
  'assets/onboard-1.svg', 'assets/onboard-2.svg', 'assets/onboard-3.svg', 'assets/architecture.svg', 'assets/bg.svg', 'assets/bg-dark.svg'
];

const HEAVY_FILES = [
  'vendor/tesseract/worker.min.js',
  'vendor/tesseract/tesseract-core-simd-lstm.wasm.js', 'vendor/tesseract/tesseract-core-lstm.wasm.js',
  'vendor/tesseract/lang/eng.traineddata.gz', 'vendor/tesseract/lang/spa.traineddata.gz',
  'vendor/pdfjs/pdf.worker.min.js'
];

const isHeavy = path => HEAVY_FILES.some(f => path.endsWith('/' + f));

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    await (await caches.open(SHELL)).addAll(SHELL_FILES);
    await (await caches.open(HEAVY)).addAll(HEAVY_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keep = [SHELL, HEAVY];
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);  // removes the old 'papershield-v1'
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // only our own files

  // Big reader files: saved copy first; download only if missing.
  if (isHeavy(url.pathname)) {
    e.respondWith((async () => {
      const cache = await caches.open(HEAVY);
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    })());
    return;
  }

  // App files: saved copy at once, fresh copy fetched in the background for next time.
  e.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const hit = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req, { cache: 'no-cache' })
      .then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
      .catch(() => null);
    if (hit) { e.waitUntil(fresh); return hit; }
    const res = await fresh;
    if (res) return res;
    if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
    return Response.error();
  })());
});
