#!/usr/bin/env node
/*
 * Generates the hero illustration through OpenRouter.
 *
 *   export OPENROUTER_API_KEY=sk-or-v1-...
 *   node scripts/generate-hero-art.mjs --list             # image-capable models, live
 *   node scripts/generate-hero-art.mjs --scene festival   # -> public/hero-festival.png
 *   node scripts/generate-hero-art.mjs --all              # every scene
 *   node scripts/generate-hero-art.mjs --scene desk --model <id>
 *
 * The key is read from the environment and never written to disk.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://openrouter.ai/api/v1';

// Verify against `--list` before trusting this default; OpenRouter's image
// line-up shifts, and only some models return an image at all.
const DEFAULT_MODEL = 'google/gemini-2.5-flash-image-preview';

/* ------------------------------------------------------------------ *
 * The style contract every scene shares. This is the part that makes
 * the output match the reference rather than looking like generic AI
 * 3D — keep it identical across scenes so the set stays coherent.
 * ------------------------------------------------------------------ */
const STYLE = `
Low-poly papercraft 3D render, as if every object were folded from thick matte
construction paper and photographed in a soft daylight studio. Faceted,
flat-shaded geometry with visible polygon edges. Matte clay surfaces, absolutely
no gloss, no reflections, no glass, no chrome. Soft ambient occlusion and gentle
long shadows; light comes from the upper left. Slightly elevated three-quarter
camera, close to eye level, wide panoramic framing.

Palette, strictly: warm ivory-cream sky (#F7F1E3), deep royal blue (#1C2FB0),
mustard yellow (#E8B84B), sage and forest green (#8FBF6B, #4E7A4B), terracotta
coral (#E07A5F), soft off-white. Muted and chalky, never saturated or neon.

Composition is critical: the scene sits along the BOTTOM THIRD of the frame on a
green field with a clean horizon. The TOP 55% must be empty, uncluttered cream
sky with nothing but a few small kites and wisps — that space is reserved for
headline type, so keep it visually quiet and free of detail. Layered faceted
hills in blue, teal and mustard sit behind the field. The scene runs edge to
edge and is cropped by both side margins, continuing beyond the frame.

No text, no letters, no numbers, no logos, no watermarks, no UI. No people
looking at the camera. Children's-book warmth, calm and unhurried.
`.trim();

const SCENES = {
  festival: `A breezy kite festival in a public park. Twelve or so small
    stylised people: a child running with a kite line taut into the sky, two
    friends sitting cross-legged on a picnic blanket mid-conversation, a vendor
    at a little wooden market cart with a striped awning selling pinwheels, a
    couple walking, someone on a park bench. A beagle trotting across the grass.
    A tall pole with a blue-and-yellow striped windsock and a small anemometer
    spinning. A rack of hanging display kites — diamond kites, a fish kite, a
    butterfly kite. Low-poly faceted trees. Wildflowers and tufts of grass. A
    large blue-and-mustard diamond kite high in the upper right with a long
    ribbon tail.`,

  desk: `A calm home workspace on a wooden desk, seen as a small diorama island.
    One stylised person seated, mid-conversation, a mug beside them. A monitor
    and a small desk lamp, a potted trailing plant, a stack of books, papers. A
    cat curled at the edge of the desk. Soft daylight from a window off-frame.`,

  studio: `A small recording studio corner. One stylised person at a microphone
    on a boom arm, wearing headphones, mid-sentence. Acoustic foam panels in
    muted blue and mustard on the wall behind, a mixing desk with faders, a
    monitor speaker on a stand, coiled cables, a stool, a potted plant.`,

  workshop: `A bright maker's workshop. Two stylised people at a broad wooden
    workbench, talking while they work. Hand tools on a pegboard wall, a vice, a
    stack of timber offcuts, jars of fixings, a rolled set of drawings, sawdust
    and shavings on the floor, a swing-arm task lamp.`,

  rooftop: `A city rooftop terrace at golden hour. Three stylised people around a
    low table with cups, talking. Potted plants and a small planter of herbs,
    string lights overhead on slim poles, a couple of folding chairs, a low
    parapet wall, faceted low-poly city rooftops and water towers receding into
    the distance behind.`,
};

const ASPECT = 'Wide panoramic banner, roughly 21:9, at least 2400px across.';

/* ------------------------------------------------------------------ */

function parseArgs(argv) {
  const args = { scenes: [], model: DEFAULT_MODEL, list: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--list') args.list = true;
    else if (a === '--all') args.scenes = Object.keys(SCENES);
    else if (a === '--scene') args.scenes.push(argv[++i]);
    else if (a === '--model') args.model = argv[++i];
  }
  return args;
}

function requireKey() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error('Set OPENROUTER_API_KEY first:\n  export OPENROUTER_API_KEY=sk-or-v1-...');
    process.exit(1);
  }
  return key;
}

async function listModels(key) {
  const res = await fetch(`${API}/models`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const { data } = await res.json();

  const imageModels = data.filter((m) =>
    (m.architecture?.output_modalities ?? []).includes('image')
  );

  if (!imageModels.length) {
    console.log('No image-output models are visible on this account right now.');
    return;
  }
  console.log(`Models that can return an image (${imageModels.length}):\n`);
  for (const m of imageModels) {
    const price = m.pricing?.image ?? m.pricing?.completion ?? '?';
    console.log(`  ${m.id}\n      ${m.name} — image price: ${price}`);
  }
}

function extractImage(payload) {
  const msg = payload.choices?.[0]?.message;
  const url = msg?.images?.[0]?.image_url?.url ?? msg?.images?.[0]?.url;
  if (typeof url === 'string' && url.startsWith('data:')) {
    return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  }
  const b64 = payload.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, 'base64');
  return null;
}

async function generate(key, model, scene) {
  const body = SCENES[scene];
  if (!body) {
    console.error(`Unknown scene "${scene}". Available: ${Object.keys(SCENES).join(', ')}`);
    process.exit(1);
  }

  const prompt = `${STYLE}\n\nSCENE — ${scene.toUpperCase()}:\n${body.replace(/\s+/g, ' ')}\n\n${ASPECT}`;

  process.stdout.write(`Generating "${scene}" with ${model}… `);
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      modalities: ['image', 'text'],
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    console.log('failed.');
    console.error(`  ${res.status}: ${await res.text()}`);
    return;
  }

  const payload = await res.json();
  const buf = extractImage(payload);
  if (!buf) {
    console.log('no image returned.');
    console.error('  Raw response:', JSON.stringify(payload).slice(0, 600));
    console.error('  This model likely cannot emit images — check `--list`.');
    return;
  }

  const out = resolve(ROOT, 'public', `hero-${scene}.png`);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  console.log(`saved public/hero-${scene}.png (${(buf.length / 1024).toFixed(0)} KB)`);
}

const args = parseArgs(process.argv.slice(2));
const key = requireKey();

if (args.list) {
  await listModels(key);
} else if (args.scenes.length) {
  for (const scene of args.scenes) await generate(key, args.model, scene);
} else {
  console.log('Usage:\n  --list\n  --scene festival\n  --all\n  --scene desk --model <id>');
}
