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
 * Draws upright, bushy, low-poly trees over the plate's wind-bent ones.
 * Nothing is masked or removed: each new canopy is sized to contain the
 * old one outright, and each new trunk is straight and wide enough to
 * swallow the leaning one underneath it.
 *
 *   node trees.mjs <in.jpg> <out.jpg>
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(`${execSync('npm root -g').toString().trim()}/playwright`)); }

/* Read off the plate's own trees so the replacements share their
   palette exactly. */
const CANOPY = ['#D2DEA8', '#B8C98C', '#9BB06E', '#7D9252', '#61743A', '#485827', '#36441D'];
const TRUNK = ['#7A5B3A', '#66492C', '#4E3620'];

/* base = where the trunk meets the ground; cy/r = the canopy mass.
   Each is sized to cover the bent tree it replaces. */
const TREES = [
  { bx: 30, by: 516, cy: 366, r: 90, seed: 7, trunkW: 26 },
  { bx: 104, by: 512, cy: 420, r: 66, seed: 23, trunkW: 20 },
  { bx: 462, by: 498, cy: 382, r: 70, seed: 41, trunkW: 22 },
  { bx: 538, by: 502, cy: 338, r: 82, seed: 59, trunkW: 24 },
];

/* The generator drew leaves and a bare branch tearing off the old
   trees. With the trees standing straight there is nothing to tear. */
const DEBRIS = { x0: 548, x1: 672, y0: 292, y1: 384 };

const [src, out] = process.argv.slice(2);
const buf = await readFile(src);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
const uri = await page.evaluate(async ([dataUri, TREES, CANOPY, TRUNK, DEBRIS]) => {
  const img = new Image();
  img.src = dataUri;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const rng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const poly = (pts, fill) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  /* Clear the torn-off leaves first: each one is replaced by the ridge
     colour immediately to its right, which is what lies behind it. */
  {
    const W = c.width;
    const idata = ctx.getImageData(0, 0, W, c.height);
    const d = idata.data;
    const at = (x, y) => (y * W + x) * 4;
    /* Name the debris by what it is — leaf green and branch brown —
       rather than as "not ridge": the anti-aliased pixels along the
       ridge's own top edge are not ridge either, and rewriting those
       leaves a dashed line along the skyline. */
    const isDebris = (i) => {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const leaf = g > r + 8 && g > b + 15 && r + g + b < 470;
      const branch = r > g + 12 && g > b + 6 && r < 185 && r + g + b < 430;
      return leaf || branch;
    };
    for (let y = DEBRIS.y0; y < DEBRIS.y1; y += 1) {
      for (let x = DEBRIS.x0; x < DEBRIS.x1; x += 1) {
        const i = at(x, y);
        if (!isDebris(i)) continue;
        let rx = x;
        while (rx < W - 1 && isDebris(at(rx, y))) rx += 1;
        const si = at(rx, y);
        d[i] = d[si]; d[i + 1] = d[si + 1]; d[i + 2] = d[si + 2];
      }
    }
    ctx.putImageData(idata, 0, 0);
  }

  for (const t of TREES) {
    const rand = rng(t.seed);

    // trunk: straight, tapering, with a lit edge down one side
    const topY = t.cy + t.r * 0.35;
    const wB = t.trunkW;
    const wT = t.trunkW * 0.62;
    poly([[t.bx - wB / 2, t.by], [t.bx + wB / 2, t.by], [t.bx + wT / 2, topY], [t.bx - wT / 2, topY]], TRUNK[1]);
    poly([[t.bx - wB / 2, t.by], [t.bx - wB / 2 + wB * 0.3, t.by], [t.bx - wT / 2 + wT * 0.3, topY], [t.bx - wT / 2, topY]], TRUNK[0]);
    poly([[t.bx + wB / 2 - wB * 0.24, t.by], [t.bx + wB / 2, t.by], [t.bx + wT / 2, topY], [t.bx + wT / 2 - wT * 0.24, topY]], TRUNK[2]);
    // two limbs lifting into the canopy, so the mass has something to sit on
    for (const dir of [-1, 1]) {
      const ex = t.bx + dir * t.r * 0.34;
      const ey = t.cy + t.r * 0.1;
      poly([
        [t.bx - dir * wT * 0.3, topY + 6],
        [t.bx + dir * wT * 0.45, topY + 8],
        [ex + dir * 5, ey],
        [ex - dir * 4, ey - 3],
      ], dir < 0 ? TRUNK[0] : TRUNK[2]);
    }

    /* The canopy is two overlapping faceted lobes — one ball reads as a
       lollipop, two read as a bush. Each lobe is an outer ring and a
       half-step-rotated inner ring with the annulus tiled by triangles:
       fanning everything to one centre leaves wedge-shaped gaps and,
       where it does not, reads as a beach umbrella. */
    const lobes = [
      { dx: 0, dy: 0, rr: t.r },
      { dx: -t.r * 0.42, dy: t.r * 0.3, rr: t.r * 0.64 },
      { dx: t.r * 0.4, dy: t.r * 0.26, rr: t.r * 0.6 },
    ];

    /* Shade each lobe about its OWN centre and light it from the upper
       left, the way the rest of the plate is lit. Shading the whole
       canopy about one centre flattens it into a single green mass. */
    const tone = (px, py, lobe, jitter) => {
      const ox = t.bx + lobe.dx;
      const oy = t.cy + lobe.dy;
      const nx = (px - ox) / lobe.rr;
      const ny = (py - oy) / lobe.rr;
      const lit = (-nx * 0.5 - ny * 0.86 + 1) / 2;
      // the lower lobes sit in the shadow of the crown
      const bias = lobe.dy > 0 ? 1 : 0;
      const idx = Math.round((1 - lit) * (CANOPY.length - 1) + jitter + bias);
      return CANOPY[Math.min(CANOPY.length - 1, Math.max(0, idx))];
    };

    for (const lobe of lobes) {
      const ox = t.bx + lobe.dx;
      const oy = t.cy + lobe.dy;
      const M = 11;
      const outer = [];
      const inner = [];
      for (let j = 0; j < M; j += 1) {
        const a = (j / M) * Math.PI * 2 - Math.PI / 2;
        const ai = a + Math.PI / M;
        const ro = lobe.rr * (0.86 + rand() * 0.17);
        const ri = lobe.rr * (0.38 + rand() * 0.17);
        outer.push([ox + Math.cos(a) * ro, oy + Math.sin(a) * ro * 0.94]);
        inner.push([ox + Math.cos(ai) * ri, oy + Math.sin(ai) * ri * 0.94]);
      }
      for (let j = 0; j < M; j += 1) {
        const o0 = outer[j];
        const o1 = outer[(j + 1) % M];
        const i0 = inner[j];
        const i1 = inner[(j + 1) % M];
        poly([o0, o1, i0], tone((o0[0] + o1[0] + i0[0]) / 3, (o0[1] + o1[1] + i0[1]) / 3, lobe, Math.round(rand() * 1.6 - 0.6)));
        poly([o1, i1, i0], tone((o1[0] + i1[0] + i0[0]) / 3, (o1[1] + i1[1] + i0[1]) / 3, lobe, Math.round(rand() * 1.6 - 0.6)));
      }
      poly(inner, tone(ox, oy - lobe.rr * 0.34, lobe, -1));
    }
  }

  return c.toDataURL('image/jpeg', 0.97);
}, [`data:image/jpeg;base64,${buf.toString('base64')}`, TREES, CANOPY, TRUNK, DEBRIS]);

await writeFile(out, Buffer.from(uri.split(',')[1], 'base64'));
console.log('wrote', out);
await browser.close();
