/* PaperShield engine: everything here runs on the phone. Nothing is uploaded. */
(function (root) {
  'use strict';

  // ---------- image quality (CAM-01, CAM-03, CAM-09) ----------
  function gray(imgData) {
    const { data, width, height } = imgData; const g = new Float32Array(width * height);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) g[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    return { g, width, height };
  }
  function small(source, maxW) {
    const sw = source.videoWidth || source.width, sh = source.videoHeight || source.height;
    const s = Math.min(1, maxW / sw); const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(sw * s)); c.height = Math.max(1, Math.round(sh * s));
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(source, 0, 0, c.width, c.height);
    return { canvas: c, data: x.getImageData(0, 0, c.width, c.height) };
  }
  function quality(source, prevGray) {
    const { data } = small(source, 240); const { g, width, height } = gray(data);
    let sum = 0, bright = 0;
    for (let i = 0; i < g.length; i++) { sum += g[i]; if (g[i] > 250) bright++; }
    const mean = sum / g.length, glare = bright / g.length;
    // variance of Laplacian = sharpness
    let lsum = 0, lsq = 0, n = 0;
    for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
      const i = y * width + x; const l = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - width] - g[i + width];
      lsum += l; lsq += l * l; n++;
    }
    const sharp = lsq / n - (lsum / n) ** 2;
    let motion = 0;
    if (prevGray && prevGray.length === g.length) { let d = 0; for (let i = 0; i < g.length; i += 3) d += Math.abs(g[i] - prevGray[i]); motion = d / (g.length / 3); }
    const box = pageBox(g, width, height);
    const cover = ((box.x1 - box.x0) * (box.y1 - box.y0)) / (width * height);
    const touchesEdge = box.x0 <= 1 || box.y0 <= 1 || box.x1 >= width - 2 || box.y1 >= height - 2;
    let issue = null;
    if (mean < 60) issue = 'camTooDark';
    else if (glare > 0.18) issue = 'camGlare';
    else if (prevGray && motion > 9) issue = 'camBlur';
    else if (cover < 0.35) issue = 'camCloser';
    else if (touchesEdge && cover > 0.97) issue = 'camCut';
    else if (sharp < 60) issue = 'camBlur';
    return { mean, glare, sharp, motion, cover, issue, gray: g };
  }

  // Page = bright region. Returns bounding box in the small image's coordinates.
  function pageBox(g, w, h) {
    let mean = 0; for (let i = 0; i < g.length; i++) mean += g[i]; mean /= g.length;
    const th = Math.min(200, mean + 15);
    const rows = new Float32Array(h), cols = new Float32Array(w);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (g[y * w + x] > th) { rows[y]++; cols[x]++; }
    const rT = w * 0.3, cT = h * 0.3;
    let y0 = 0, y1 = h - 1, x0 = 0, x1 = w - 1;
    while (y0 < h - 1 && rows[y0] < rT) y0++; while (y1 > y0 && rows[y1] < rT) y1--;
    while (x0 < w - 1 && cols[x0] < cT) x0++; while (x1 > x0 && cols[x1] < cT) x1--;
    if (x1 - x0 < w * 0.2 || y1 - y0 < h * 0.2) return { x0: 0, y0: 0, x1: w - 1, y1: h - 1 };
    return { x0, y0, x1, y1 };
  }

  // CAM-04: suggest page corners on the full image (tl, tr, br, bl)
  function suggestCorners(canvas) {
    const { data } = small(canvas, 400); const { g, width, height } = gray(data);
    const b = pageBox(g, width, height); const sx = canvas.width / width, sy = canvas.height / height;
    // refine each corner: search the brightest-edge point near each bbox corner
    const pts = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]];
    return pts.map(([x, y]) => ({ x: x * sx, y: y * sy }));
  }

  // Homography from 4 src points to rect, then inverse warp with bilinear sampling.
  function solve(A, b) { // Gaussian elimination
    const n = b.length;
    for (let i = 0; i < n; i++) {
      let max = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[max][i])) max = r;
      [A[i], A[max]] = [A[max], A[i]]; [b[i], b[max]] = [b[max], b[i]];
      for (let r = i + 1; r < n; r++) { const f = A[r][i] / A[i][i]; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; }
    }
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c]; x[i] = s / A[i][i]; }
    return x;
  }
  function homography(src, dst) { // maps dst -> src
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
      const { x, y } = dst[i], u = src[i].x, v = src[i].y;
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    const h = solve(A, b); h.push(1); return h;
  }
  function warp(canvas, corners) {
    const d = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
    let W = Math.round(Math.max(d(corners[0], corners[1]), d(corners[3], corners[2])));
    let H = Math.round(Math.max(d(corners[0], corners[3]), d(corners[1], corners[2])));
    const scale = Math.min(1, 2000 / Math.max(W, H)); W = Math.max(50, Math.round(W * scale)); H = Math.max(50, Math.round(H * scale));
    const h = homography(corners, [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }]);
    const sctx = canvas.getContext('2d', { willReadFrequently: true });
    const src = sctx.getImageData(0, 0, canvas.width, canvas.height), sd = src.data, sw = canvas.width, sh = canvas.height;
    const out = document.createElement('canvas'); out.width = W; out.height = H;
    const octx = out.getContext('2d'); const od = octx.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const z = h[6] * x + h[7] * y + 1, u = (h[0] * x + h[1] * y + h[2]) / z, v = (h[3] * x + h[4] * y + h[5]) / z;
      const x0 = Math.floor(u), y0 = Math.floor(v); const o = (y * W + x) * 4;
      if (x0 < 0 || y0 < 0 || x0 >= sw - 1 || y0 >= sh - 1) { od.data[o] = od.data[o + 1] = od.data[o + 2] = 255; od.data[o + 3] = 255; continue; }
      const fx = u - x0, fy = v - y0;
      for (let c = 0; c < 3; c++) {
        const i00 = (y0 * sw + x0) * 4 + c, i10 = i00 + 4, i01 = i00 + sw * 4, i11 = i01 + 4;
        od.data[o + c] = (sd[i00] * (1 - fx) + sd[i10] * fx) * (1 - fy) + (sd[i01] * (1 - fx) + sd[i11] * fx) * fy;
      }
      od.data[o + 3] = 255;
    }
    octx.putImageData(od, 0, 0); return out;
  }

  // Clean scan for OCR: grayscale + contrast stretch
  function enhance(canvas) {
    const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(canvas, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height); const p = d.data;
    let lo = 255, hi = 0; const hist = new Uint32Array(256);
    for (let i = 0; i < p.length; i += 4) { const v = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) | 0; hist[v]++; }
    const total = p.length / 4; let acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > total * 0.01) { lo = v; break; } }
    acc = 0; for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > total * 0.05) { hi = v; break; } }
    const span = Math.max(1, hi - lo);
    for (let i = 0; i < p.length; i += 4) {
      let v = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]; v = Math.max(0, Math.min(255, ((v - lo) * 255) / span));
      p[i] = p[i + 1] = p[i + 2] = v;
    }
    x.putImageData(d, 0, 0); return c;
  }

  // CAM-07: perceptual hash for duplicate pages
  function ahash(canvas) {
    const { data } = small(canvas, 16); const c = document.createElement('canvas'); c.width = 8; c.height = 8;
    const x = c.getContext('2d'); x.drawImage(canvas, 0, 0, 8, 8); const d = x.getImageData(0, 0, 8, 8).data;
    const v = []; for (let i = 0; i < d.length; i += 4) v.push(d[i] + d[i + 1] + d[i + 2]);
    const m = v.reduce((a, b) => a + b, 0) / v.length; return v.map(z => (z > m ? 1 : 0));
    void data;
  }
  function sameHash(a, b) { let n = 0; for (let i = 0; i < 64; i++) if (a[i] !== b[i]) n++; return n <= 6; }

  // ---------- OCR (on device) ----------
  let worker = null, workerReady = null;
  async function getWorker(onStatus) {
    if (workerReady) return workerReady;
    workerReady = (async () => {
      onStatus && onStatus('loadingLang');
      worker = await root.Tesseract.createWorker(['eng', 'spa'], 1, {
        // absolute URLs: the worker resolves paths from its own folder
        workerPath: new URL('vendor/tesseract/worker.min.js', location.href).href,
        corePath: new URL('vendor/tesseract/', location.href).href,
        langPath: new URL('vendor/tesseract/lang', location.href).href,
        gzip: true, workerBlobURL: false, cacheMethod: 'write'
      });
      await worker.setParameters({ preserve_interword_spaces: '1' });
      return worker;
    })();
    return workerReady;
  }

  async function ocrPages(canvases, onStatus) {
    const w = await getWorker(onStatus);
    const lines = []; let text = ''; let confSum = 0, confN = 0;
    for (let p = 0; p < canvases.length; p++) {
      onStatus && onStatus('stepRead', p + 1, canvases.length);
      const { data } = await w.recognize(canvases[p]);
      (data.lines || []).forEach(l => {
        lines.push({ text: l.text.replace(/\n$/, ''), bbox: l.bbox, page: p, conf: l.confidence });
        confSum += l.confidence * l.text.length; confN += l.text.length;
      });
      text += (p ? '\n' : '') + (data.lines || []).map(l => l.text.replace(/\n$/, '')).join('\n');
    }
    return { text, lines, meanConf: confN ? confSum / confN : 0 };
  }

  // ---------- PDF (CAM-08) ----------
  async function readPdf(file) {
    const lib = root.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = new URL('vendor/pdfjs/pdf.worker.min.js', location.href).href;
    const pdf = await lib.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false }).promise;
    const canvases = []; let textOut = ''; const lines = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i); const vp = page.getViewport({ scale: 2 });
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise; canvases.push(c);
      const tc = await page.getTextContent();
      // group items into lines by y
      const rows = {};
      tc.items.forEach(it => {
        const tx = lib.Util.transform(vp.transform, it.transform); const y = Math.round(tx[5] / 6);
        (rows[y] = rows[y] || []).push({ x: tx[4], y: tx[5], h: Math.hypot(tx[2], tx[3]), w: it.width * 2, s: it.str });
      });
      Object.keys(rows).map(Number).sort((a, b) => a - b).forEach(k => {
        const r = rows[k].sort((a, b) => a.x - b.x); const s = r.map(z => z.s).join(' ').replace(/\s+/g, ' ').trim();
        if (!s) return; const last = r[r.length - 1];
        lines.push({ text: s, page: i - 1, conf: 99, bbox: { x0: r[0].x - 4, y0: r[0].y - r[0].h - 4, x1: last.x + last.w + 4, y1: r[0].y + 6 } });
        textOut += s + '\n';
      });
    }
    return { canvases, text: textOut.trim(), lines, hasText: textOut.trim().length > 40 };
  }

  function fileToCanvas(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file); const img = new Image();
      img.onload = () => {
        const s = Math.min(1, 2400 / Math.max(img.width, img.height)); const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c);
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('image')); }; img.src = url;
    });
  }

  // SCM-12: QR codes
  function readQr(canvas) {
    if (!root.jsQR) return [];
    const { data } = small(canvas, 1000); const r = root.jsQR(data.data, data.width, data.height);
    return r && r.data ? [r.data] : [];
  }

  // PRV-01/PRV-03: wipe pixel data
  function wipe(canvases) { (canvases || []).forEach(c => { try { c.getContext('2d').clearRect(0, 0, c.width, c.height); c.width = c.height = 1; } catch (e) { /* ignore */ } }); }

  root.PSEngine = { quality, suggestCorners, warp, enhance, ahash, sameHash, ocrPages, readPdf, fileToCanvas, readQr, wipe, getWorker };
})(window);
