#!/usr/bin/env node
/*
 * Generates the movable pieces of the hero scene as transparent sprites.
 *
 *   export GEMINI_API_KEY=...
 *   node scripts/generate-sprites.mjs            # all sprites
 *   node scripts/generate-sprites.mjs windsock   # just one
 *
 * The image models return JPEG, which has no alpha channel, so a
 * transparent asset cannot be asked for directly. Instead each sprite is
 * generated on a flat chroma background and keyed out here. Magenta is
 * used because nothing in the scene's palette comes near it, so the key
 * never eats part of the subject.
 *
 * JPEG also smears colour at edges, so the key runs with a tolerance and
 * then erodes the remaining fringe, otherwise every sprite carries a
 * magenta halo.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

/* Playwright may only be installed globally, which ESM import cannot
   resolve from inside the project, so fall back to the global root. */
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  const globalRoot = execSync('npm root -g').toString().trim();
  ({ chromium } = require(`${globalRoot}/playwright`));
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-3-pro-image';
const CHROMA = '#FF00FF';

const STYLE = `
Low-poly papercraft 3D render, as if folded from thick matte construction
paper. Faceted flat-shaded geometry, matte surfaces, no gloss or reflections.
Soft daylight from the upper left. Palette: deep royal blue (#1C2FB0), mustard
yellow (#E8B84B), sage green (#8FBF6B), terracotta coral (#E07A5F), off-white.

CRITICAL: the entire background must be FLAT PURE MAGENTA ${CHROMA}, one solid
uncorrected colour edge to edge, with nothing else in frame — no ground, no
shadow on the background, no sky, no scenery, no gradient, no vignette. Only
the single subject, centred, with generous magenta margin on all sides. No
text, no watermark.
`.trim();

const SPRITES = {
  windsock: `A tall slim pole with a blue-and-mustard striped windsock flying
    from it, streaming out horizontally to the right in a stiff breeze, plus a
    small three-cup anemometer at the top of the pole. Shown side-on, the whole
    pole from top to base.`,

  kite: `A single diamond kite, deep royal blue and mustard, with a long
    ribbon tail streaming below and to the side. Seen from slightly below as
    if flying. No string, no hand, no person — only the kite and its tail.`,

  kiteSmall: `A single small diamond kite in terracotta coral and off-white
    with a short curling ribbon tail, seen from below as if flying high. No
    string, no person.`,

  runner: `A small stylised child running to the right at full tilt, one arm
    raised above the head holding a kite string, hair and clothing streaming
    back in the wind. Simple rounded papercraft figure in a blue top and
    mustard trousers. Full body including both feet. No kite, no background.`,
};

function requireKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('Set GEMINI_API_KEY first.');
    process.exit(1);
  }
  return key;
}

async function generate(key, name) {
  const brief = SPRITES[name];
  const prompt = `${STYLE}\n\nSUBJECT:\n${brief.replace(/\s+/g, ' ')}`;

  process.stdout.write(`  ${name}: generating… `);
  const res = await fetch(`${GEMINI_API}/models/${MODEL}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  });

  if (!res.ok) {
    console.log('failed.');
    console.error(`    ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return null;
  }

  const payload = await res.json();
  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const data = (part.inlineData ?? part.inline_data)?.data;
    if (data) {
      process.stdout.write('ok, ');
      return Buffer.from(data, 'base64');
    }
  }
  console.log('no image returned.');
  return null;
}

/**
 * Keys the chroma background out in a headless canvas and trims the
 * result to the subject's bounding box, so the sprite can be positioned
 * by its own edges rather than by whatever margin the model left.
 */
async function keyOut(page, jpegBuffer) {
  const dataUri = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
  return page.evaluate(async (uri) => {
    const img = new Image();
    img.src = uri;
    await img.decode();

    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    const id = ctx.getImageData(0, 0, c.width, c.height);
    const d = id.data;

    // Magenta is high red, high blue, low green. JPEG ringing means the
    // test has to be generous rather than exact.
    const isChroma = (r, g, b) => r > 120 && b > 120 && g < Math.min(r, b) - 55;

    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (isChroma(d[i], d[i + 1], d[i + 2])) {
        d[i + 3] = 0;
      } else {
        const p = i / 4;
        const x = p % c.width;
        const y = (p / c.width) | 0;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    // De-fringe: any surviving pixel touching transparency gets pulled
    // toward neutral, which kills the magenta halo JPEG leaves behind.
    const src = new Uint8ClampedArray(d);
    const at = (x, y) => (y * c.width + x) * 4;
    for (let y = 1; y < c.height - 1; y += 1) {
      for (let x = 1; x < c.width - 1; x += 1) {
        const i = at(x, y);
        if (src[i + 3] === 0) continue;
        const nearHole =
          src[at(x - 1, y) + 3] === 0 || src[at(x + 1, y) + 3] === 0 ||
          src[at(x, y - 1) + 3] === 0 || src[at(x, y + 1) + 3] === 0;
        if (!nearHole) continue;
        const r = src[i], g = src[i + 1], b = src[i + 2];
        if (r > g + 25 && b > g + 25) {
          const avg = (r + g + b) / 3;
          d[i] = avg; d[i + 1] = avg; d[i + 2] = avg;
          d[i + 3] = 140;
        }
      }
    }

    ctx.putImageData(id, 0, 0);

    if (maxX <= minX || maxY <= minY) return null;
    const pad = 2;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(c.width - 1, maxX + pad); maxY = Math.min(c.height - 1, maxY + pad);
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    out.getContext('2d').drawImage(c, minX, minY, w, h, 0, 0, w, h);
    return { uri: out.toDataURL('image/png'), w, h, srcW: c.width, srcH: c.height };
  }, dataUri);
}

const key = requireKey();
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const names = wanted.length ? wanted : Object.keys(SPRITES);

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage();
await mkdir(resolve(ROOT, 'public/sprites'), { recursive: true });

for (const name of names) {
  if (!SPRITES[name]) {
    console.error(`Unknown sprite "${name}". Available: ${Object.keys(SPRITES).join(', ')}`);
    continue;
  }
  const jpeg = await generate(key, name);
  if (!jpeg) continue;

  const cut = await keyOut(page, jpeg);
  if (!cut) {
    console.log('key failed (nothing survived — background may not be flat).');
    continue;
  }
  const png = Buffer.from(cut.uri.split(',')[1], 'base64');
  const out = resolve(ROOT, 'public/sprites', `${name}.png`);
  await writeFile(out, png);
  console.log(
    `keyed ${cut.srcW}x${cut.srcH} -> ${cut.w}x${cut.h}, saved public/sprites/${name}.png (${(png.length / 1024).toFixed(0)} KB)`
  );
}

await browser.close();
