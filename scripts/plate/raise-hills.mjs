/*
 * ONE-OFF post-process for the CURRENT public/hero-festival.jpg.
 *
 * Both passes carry coordinates measured off that exact plate, so they
 * do not survive a regeneration and are not meant to. The scene prompt
 * in scripts/generate-hero-art.mjs now asks for tall ridges and
 * upright, bushy trees directly; once the plate is regenerated with a
 * key, these scripts are history rather than tooling.
 *
 *   node scripts/plate/raise-hills.mjs    public/hero-festival.jpg out.jpg 1.55
 *   node scripts/plate/replace-trees.mjs  out.jpg public/hero-festival.jpg
 */
/*
 * Raises the plate's hills. Every new pixel is painted ONLY where the
 * plate currently holds empty sky, so the ferris wheel, trees, cart and
 * kite rack — all of which stand in front of the hills — are untouched
 * and simply end up with more hill behind them.
 *
 *   node hills.mjs <in.jpg> <out.jpg> [--trace] [k]
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(`${execSync('npm root -g').toString().trim()}/playwright`)); }

const [src, out] = process.argv.slice(2);
const trace = process.argv.includes('--trace');
const kArg = process.argv.find((a) => /^[0-9.]+$/.test(a));
const K = kArg ? Number(kArg) : 1.6;
const buf = await readFile(src);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
const uri = await page.evaluate(async ([dataUri, K, trace]) => {
  const img = new Image();
  img.src = dataUri;
  await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const id = ctx.getImageData(0, 0, W, H);
  const d = id.data;
  const at = (x, y) => (y * W + x) * 4;

  const isSky = (i) => d[i] > 233 && d[i + 1] > 226 && d[i + 2] > 200;
  const isHill = (i) => {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    if (isSky(i)) return false;
    const cool = b > r + 14 && b > 95;                       // blue and teal ridges
    const warm = r > 150 && g > 115 && b < 140 && r > b + 55; // mustard ridges
    return cool || warm;
  };

  /* The horizon the ridges rise from: scaling about it keeps every
     ridge rooted where it already meets the field. */
  const HORIZON = 492;
  const TOP_LIMIT = 330;

  // 1. trace the ridge line, leaving gaps wherever something stands in front
  const top = new Array(W).fill(null);
  for (let x = 0; x < W; x += 1) {
    for (let y = TOP_LIMIT; y < HORIZON; y += 1) {
      const i = at(x, y);
      if (!isHill(i)) continue;
      /* A ridge runs on down to the field. The ferris wheel's navy rim,
         the cart's blue awning and the display kites are all the right
         colour but only a shallow band deep, so depth is what tells a
         hill from a blue object standing in front of one. */
      let run = 0;
      while (y + run < HORIZON && isHill(at(x, y + run))) run += 1;
      if (run < 60 && y + run < HORIZON - 6) continue;
      if (!isSky(at(x, Math.max(0, y - 5)))) break; // something in front — no reading here
      top[x] = y;
      break;
    }
  }

  const reliable = top.map((v) => v !== null);

  // 2. close the gaps: papercraft ridges are straight, so a line across
  //    a blocked span is the same line the artist drew
  const known = [];
  for (let x = 0; x < W; x += 1) if (top[x] !== null) known.push(x);
  if (known.length) {
    for (let x = 0; x < W; x += 1) {
      if (top[x] !== null) continue;
      let lo = null, hi = null;
      for (const kx of known) { if (kx < x) lo = kx; else { hi = kx; break; } }
      if (lo === null) top[x] = top[hi];
      else if (hi === null) top[x] = top[lo];
      else top[x] = top[lo] + ((top[hi] - top[lo]) * (x - lo)) / (hi - lo);
    }
  }

  // 2b. smooth the traced line, or the new crest inherits every wobble
  const smooth = new Array(W);
  const R = 6;
  for (let x = 0; x < W; x += 1) {
    let sum = 0, n = 0;
    for (let k = -R; k <= R; k += 1) {
      const xx = Math.min(W - 1, Math.max(0, x + k));
      sum += top[xx]; n += 1;
    }
    smooth[x] = sum / n;
  }

  if (trace) {
    for (let x = 0; x < W; x += 1) {
      const y = Math.round(smooth[x]);
      for (let k = -1; k <= 1; k += 1) {
        const i = at(x, Math.max(0, Math.min(H - 1, y + k)));
        d[i] = 255; d[i + 1] = 0; d[i + 2] = 255;
      }
    }
    ctx.putImageData(id, 0, 0);
    return c.toDataURL('image/png');
  }

  /* Stretch the ridge band itself upward rather than repainting flat
     colour above it: a flat repaint loses the facet shading and leaves a
     seam where the new colour meets the old. Each new pixel is sampled
     from further down the same column — from at or below the traced
     crest, so only ridge is ever lifted — and only lands where the
     plate currently holds sky, which is what keeps the wheel, the
     trees, the cart and the rack in front of it. */
  /* A column blocked by the wheel, a tree or the cart has no ridge to
     lift — sampling it anyway drags the wheel's rim and legs up into
     the sky. Those columns borrow from the nearest column that did see
     the ridge, at the same depth below the crest, so the bands line up. */
  const donor = new Array(W);
  {
    let last = -1;
    const left = new Array(W).fill(-1);
    for (let x = 0; x < W; x += 1) { if (reliable[x]) last = x; left[x] = last; }
    last = -1;
    const right = new Array(W).fill(-1);
    for (let x = W - 1; x >= 0; x -= 1) { if (reliable[x]) last = x; right[x] = last; }
    for (let x = 0; x < W; x += 1) {
      if (reliable[x]) { donor[x] = x; continue; }
      if (left[x] < 0) donor[x] = right[x];
      else if (right[x] < 0) donor[x] = left[x];
      else donor[x] = x - left[x] <= right[x] - x ? left[x] : right[x];
    }
  }

  const outData = new Uint8ClampedArray(d);
  for (let x = 0; x < W; x += 1) {
    const crest = smooth[x];
    const xs = donor[x] < 0 ? x : donor[x];
    const srcCrest = smooth[xs];
    for (let y = Math.max(0, Math.floor(HORIZON - (HORIZON - crest) * K)); y < Math.ceil(crest); y += 1) {
      const i = at(x, y);
      if (!isSky(i)) continue;
      const depth = HORIZON + (y - HORIZON) / K - crest;
      if (depth < -0.5) continue;
      const sy = srcCrest + depth;
      if (sy >= HORIZON) continue;
      const y0 = Math.floor(sy);
      const fy = sy - y0;
      const a0 = at(xs, y0);
      const a1 = at(xs, Math.min(H - 1, y0 + 1));
      if (!isHill(a0)) continue;
      for (let k = 0; k < 3; k += 1) outData[i + k] = d[a0 + k] * (1 - fy) + d[a1 + k] * fy;
      outData[i + 3] = 255;
    }
  }
  ctx.putImageData(new ImageData(outData, W, H), 0, 0);
  return c.toDataURL('image/jpeg', 0.97);
}, [`data:image/jpeg;base64,${buf.toString('base64')}`, K, trace]);

await writeFile(out, Buffer.from(uri.split(',')[1], 'base64'));
console.log('wrote', out);
await browser.close();
