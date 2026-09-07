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
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta';

// Verify against `--list` before trusting either default; both line-ups
// shift, and only some models return an image at all.
const DEFAULT_MODEL = 'google/gemini-2.5-flash-image-preview';
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash-image-preview';

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
  const args = { scenes: [], model: null, list: false, provider: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--list') args.list = true;
    else if (a === '--all') args.scenes = Object.keys(SCENES);
    else if (a === '--scene') args.scenes.push(argv[++i]);
    else if (a === '--model') args.model = argv[++i];
    else if (a === '--provider') args.provider = argv[++i];
  }
  // Default to whichever key is present. Note that some sandboxes reach
  // Google's endpoint but not OpenRouter's.
  if (!args.provider) {
    args.provider = process.env.OPENROUTER_API_KEY ? 'openrouter' : 'gemini';
  }
  if (!args.model) {
    args.model = args.provider === 'gemini' ? DEFAULT_GEMINI_MODEL : DEFAULT_MODEL;
  }
  return args;
}

function requireKey(provider) {
  const envName = provider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENROUTER_API_KEY';
  const key = process.env[envName];
  if (!key) {
    console.error(
      `Set ${envName} first:\n  export ${envName}=...\n\n` +
        'Providers: --provider gemini | --provider openrouter'
    );
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

async function geminiImageModels(key) {
  const res = await fetch(`${GEMINI_API}/models?key=${key}`);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const { models = [] } = await res.json();
  return models.filter((m) => /image/i.test(`${m.name} ${m.displayName ?? ''}`));
}

async function listGeminiModels(key) {
  const imageModels = await geminiImageModels(key);
  console.log(`Gemini models that can return an image (${imageModels.length}):\n`);
  for (const m of imageModels) {
    console.log(`  ${m.name.replace('models/', '')}\n      ${m.displayName ?? ''}`);
  }
  if (!imageModels.length) {
    console.log('  (none matched — pass --model <id> explicitly)');
  }
}

/**
 * Resolves a friendly name to a real model id by asking the API what
 * this account actually has, rather than hardcoding an id that may
 * have been renamed. "nano-banana-pro" is Google's Pro image model;
 * "nano-banana" the Flash one.
 */
export async function resolveGeminiModel(key, wanted) {
  const available = await geminiImageModels(key);
  if (!available.length) return DEFAULT_GEMINI_MODEL;

  const ids = available.map((m) => m.name.replace('models/', ''));
  const want = (wanted ?? '').toLowerCase();

  // An explicit, real id always wins.
  if (ids.includes(wanted)) return wanted;

  const wantsPro = /pro/.test(want) || want.includes('nano-banana-pro');
  const score = (id) => {
    let s = 0;
    if (/image/.test(id)) s += 4;
    if (wantsPro && /pro/.test(id)) s += 6;
    if (!wantsPro && /flash/.test(id)) s += 3;
    // prefer the newest generation on offer
    const gen = parseFloat((id.match(/gemini-(\d+(?:\.\d+)?)/) ?? [])[1] ?? '0');
    s += gen;
    if (/preview|exp/.test(id)) s -= 0.5;
    return s;
  };

  const best = ids.slice().sort((a, b) => score(b) - score(a))[0];
  return best;
}

function extractImage(payload) {
  // OpenRouter chat-completions shape
  const msg = payload.choices?.[0]?.message;
  const url = msg?.images?.[0]?.image_url?.url ?? msg?.images?.[0]?.url;
  if (typeof url === 'string' && url.startsWith('data:')) {
    return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  }
  // Gemini generateContent shape
  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const data = part.inlineData?.data ?? part.inline_data?.data;
    if (data) return Buffer.from(data, 'base64');
  }
  const b64 = payload.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, 'base64');
  return null;
}

async function callGemini(key, model, prompt) {
  const res = await fetch(`${GEMINI_API}/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  });
  return res;
}

async function generate(key, model, scene, provider) {
  const body = SCENES[scene];
  if (!body) {
    console.error(`Unknown scene "${scene}". Available: ${Object.keys(SCENES).join(', ')}`);
    process.exit(1);
  }

  const prompt = `${STYLE}\n\nSCENE — ${scene.toUpperCase()}:\n${body.replace(/\s+/g, ' ')}\n\n${ASPECT}`;

  process.stdout.write(`Generating "${scene}" via ${provider} (${model})… `);
  const res =
    provider === 'gemini'
      ? await callGemini(key, model, prompt)
      : await fetch(`${API}/chat/completions`, {
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

/* Only run the CLI when invoked directly, so the module stays
   importable (and its model resolution testable). */
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) await main();

async function main() {
const args = parseArgs(process.argv.slice(2));
const key = requireKey(args.provider);

if (args.list) {
  if (args.provider === 'gemini') await listGeminiModels(key);
  else await listModels(key);
} else if (args.scenes.length) {
  let model = args.model;
  if (args.provider === 'gemini') {
    model = await resolveGeminiModel(key, args.model ?? 'nano-banana-pro');
    console.log(`Resolved image model: ${model}`);
  }
  for (const scene of args.scenes) await generate(key, model, scene, args.provider);
} else {
  console.log(
    'Usage:\n' +
      '  --list                        models that can return an image\n' +
      '  --scene festival              generate one scene\n' +
      '  --all                         generate all five\n' +
      '  --provider gemini|openrouter  default: whichever key is set\n' +
      '  --model <id>                  override the model'
  );
}
}
