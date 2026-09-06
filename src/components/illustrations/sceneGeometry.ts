/*
 * Geometry helpers for the hero scene.
 *
 * Faceted forms are generated rather than hand-drawn so that every
 * object in the scene is lit from the same direction. Hand-placing
 * hundreds of polygons never keeps its lighting consistent; deriving
 * each facet's tone from its own normal does, which is what makes the
 * low-poly forms read as dimensional paper instead of flat shapes.
 */

/** Deterministic PRNG — the scene must render identically every time. */
export function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Light arrives from the upper left, as it does in the reference. */
const LIGHT_X = -0.55;
const LIGHT_Y = -0.84;

export interface Facet {
  d: string;
  fill: string;
}

/** One irregular closed polygon, as a path string. */
function polygon(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  seed: number,
  jitter: number,
  squashY: number
): string {
  const rng = makeRng(seed);
  let d = '';
  for (let i = 0; i < sides; i += 1) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const r = radius * (1 - jitter / 2 + rng() * jitter);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * squashY;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

/**
 * A form built as stacked paper lobes: successively smaller irregular
 * layers, each nudged toward the light and cut from a lighter tone.
 *
 * Fanning triangles out from a centroid — the obvious way to facet a
 * blob — always reads as a beach umbrella, because every edge converges
 * on one point. Stacking offset layers instead gives the same sense of
 * volume while looking like what it is: pieces of cut paper laid on top
 * of one another.
 *
 * `tones` runs lightest to darkest.
 */
export function paperForm(
  cx: number,
  cy: number,
  radius: number,
  tones: string[],
  options: {
    sides?: number;
    seed?: number;
    jitter?: number;
    squashY?: number;
    layers?: number;
  } = {}
): Facet[] {
  const { sides = 11, seed = 7, jitter = 0.16, squashY = 1, layers = 4 } = options;
  const count = Math.min(layers, tones.length);
  const out: Facet[] = [];

  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1); // 0 = base, 1 = highlight
    const r = radius * (1 - t * 0.56);
    const ox = cx + LIGHT_X * radius * t * 0.4;
    const oy = cy + LIGHT_Y * radius * t * 0.4 * squashY;
    out.push({
      d: polygon(ox, oy, r, sides, seed + i * 37, jitter, squashY),
      fill: tones[tones.length - 1 - i],
    });
  }
  return out;
}

/** A ridge line of faceted peaks, used for the layered hills. */
export function ridge(
  width: number,
  baseY: number,
  amplitude: number,
  steps: number,
  seed: number,
  floorY: number
): string {
  const rng = makeRng(seed);
  let d = `M0 ${baseY}`;
  for (let i = 1; i <= steps; i += 1) {
    const x = (width / steps) * i;
    const y = baseY - rng() * amplitude;
    d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
  }
  d += ` L${width} ${floorY} L0 ${floorY} Z`;
  return d;
}

export const FOLIAGE_TONES = ['#BFE39C', '#A6D07F', '#8CBB66', '#74A452', '#5E8B42', '#4A7135'];
export const FOLIAGE_DEEP = ['#9CC97C', '#84B265', '#6D9A51', '#598340', '#476A33', '#38542A'];
export const BUSH_TONES = ['#A8D183', '#8FBF6B', '#78A857', '#628F46', '#4E7538'];
