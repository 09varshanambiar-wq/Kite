import './HeroPlate.css';

/*
 * The hero illustration: a generated plate with generated sprites and an
 * SVG layer composited over it, so the scene can actually move.
 *
 * The plate (public/hero-festival.jpg) is deliberately generated WITHOUT
 * the kite and windsock — see scripts/generate-hero-art.mjs. Those arrive
 * separately as transparent sprites from
 * scripts/generate-sprites.mjs, which generates each on a magenta
 * background and keys it out, because the image models return JPEG and
 * JPEG carries no alpha channel.
 *
 * Everything is placed in the plate's own 1584x672 frame, so the
 * composite stays registered at any width. Coordinates below were
 * measured off the plate against a calibration grid.
 */

const BIRDS_A = [
  { x: 0, y: 0, s: 1 },
  { x: 34, y: 14, s: 0.82 },
  { x: 62, y: -8, s: 0.7 },
  { x: 92, y: 10, s: 0.6 },
];

const BIRDS_B = [
  { x: 0, y: 0, s: 0.86 },
  { x: 30, y: 12, s: 0.7 },
  { x: 56, y: -6, s: 0.58 },
];

/* ---------------- pinwheels ---------------- */
/* Each sail is two faces meeting at a fold, which is what separates a
   paper pinwheel from a flat daisy: the lit face catches the light, the
   folded-under face sits in its shadow. */
const VANE_COLOURS = ['#E8B84B', '#7FB05C', '#A897C9', '#E07A5F', '#5D9E97', '#EFDCB2'];

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c * (1 - amount));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((c) => mix(c).toString(16).padStart(2, '0'))
    .join('')}`;
}

/* The lit face runs from a sharp outer point back to the fold line; the
   fold face is the paper curled under toward the next sail. Together
   they span 70 degrees on a 60-degree pitch, so the sails overlap the
   way a real pinwheel's do. */
function litFace(r: number) {
  return [
    `M0 0`,
    `L ${r * 0.53} ${-r * 0.85}`,
    `Q ${r * 0.95} ${-r * 0.62} ${r * 0.97} ${-r * 0.24}`,
    `Z`,
  ].join(' ');
}

function foldFace(r: number) {
  return [
    `M0 0`,
    `L ${r * 0.97} ${-r * 0.24}`,
    `Q ${r * 0.78} ${r * 0.14} ${r * 0.42} ${r * 0.3}`,
    `Q ${r * 0.2} ${r * 0.16} 0 0`,
    `Z`,
  ].join(' ');
}

function Pinwheel({
  cx,
  cy,
  r,
  spin,
  poleTo,
}: {
  cx: number;
  cy: number;
  r: number;
  spin: number;
  poleTo: number;
}) {
  const lit = litFace(r);
  const fold = foldFace(r);
  const poleW = Math.max(5, r * 0.09);
  return (
    <g className="hp-pinwheel-rig">
      <rect x={cx - poleW / 2} y={cy} width={poleW} height={poleTo - cy} fill="#C9AC7E" />
      <rect x={cx - poleW / 2} y={cy} width={poleW * 0.34} height={poleTo - cy} fill="#A5875C" />
      <g transform={`translate(${cx} ${cy})`}>
        <g className="hp-pinwheel" style={{ animationDuration: `${spin}s` }}>
          {VANE_COLOURS.map((fill, i) => (
            <g key={i} transform={`rotate(${i * 60})`}>
              <path d={lit} fill={fill} />
              <path d={fold} fill={shade(fill, 0.24)} />
            </g>
          ))}
          <circle r={r * 0.14} fill="#B85F45" />
          <circle r={r * 0.14} fill="#7E3A2A" clipPath="url(#hp-boss-shade)" />
          <circle r={r * 0.05} fill="#F6EBD4" />
        </g>
      </g>
    </g>
  );
}

/* ---------------- drifting leaves ---------------- */
/* Replaces the old white speed-lines: wind you can see because it is
   carrying something, rather than wind drawn as streaks. */
const LEAVES = [
  { y: 214, s: 1.7, dur: 13, delay: 0, tilt: 9, fill: '#6F9B4C' },
  { y: 302, s: 1.35, dur: 17, delay: -6, tilt: 15, fill: '#8DB35F' },
  { y: 168, s: 1.05, dur: 21, delay: -13, tilt: 7, fill: '#C6A24B' },
  { y: 392, s: 1.5, dur: 15, delay: -9.5, tilt: 12, fill: '#7FAE57' },
  { y: 262, s: 1.2, dur: 19, delay: -3, tilt: 11, fill: '#CE7F52' },
  { y: 460, s: 1.6, dur: 12, delay: -7.5, tilt: 18, fill: '#B8913F' },
  { y: 128, s: 0.95, dur: 24, delay: -16, tilt: 5, fill: '#87AE63' },
  { y: 352, s: 1.25, dur: 18, delay: -11, tilt: 14, fill: '#D89A5C' },
];

const LEAF_D = 'M0 0 C 6 -7.5, 17 -7.5, 22 0 C 17 7.5, 6 7.5, 0 0 Z';

/* ---------------- sparkles ---------------- */
const SPARKLES = [
  { x: 118, y: 626, s: 1, delay: 0 },
  { x: 352, y: 648, s: 0.75, delay: -1.4 },
  { x: 612, y: 620, s: 0.9, delay: -2.6 },
  { x: 868, y: 652, s: 0.7, delay: -0.7 },
  { x: 1124, y: 630, s: 0.85, delay: -3.3 },
  { x: 1372, y: 656, s: 0.65, delay: -1.9 },
  { x: 1508, y: 614, s: 0.8, delay: -2.2 },
];

/* ---------------- butterflies ---------------- */
const BUTTERFLIES = [
  { y: 592, s: 1, dur: 22, delay: 0, fill: '#E8B84B' },
  { y: 634, s: 0.78, dur: 29, delay: -14, fill: '#D9836A' },
];

const SPARKLE_D = 'M0 -11 Q 1.8 -1.8 11 0 Q 1.8 1.8 0 11 Q -1.8 1.8 -11 0 Q -1.8 -1.8 0 -11 Z';

/* ---------------- children flying kites ---------------- */
/* Drawn as faceted planes rather than rounded strokes, because the
   plate they stand on is a low-poly render: a figure built from
   tapering polygons with a lit and a shaded face on every limb sits in
   that world, and one built from round-capped lines does not.
   Local units: feet on y=0, facing right, about 94 tall. */
interface ChildPalette {
  skin: string;
  skinShade: string;
  hair: string;
  hairShade: string;
  shirt: string;
  shirtShade: string;
  shirtLit: string;
  pants: string;
  pantsShade: string;
  /* The far side of the body is held back a full step in tone, so a
     limb behind the torso still reads as behind it. */
  pantsFar: string;
  skinFar: string;
  shoe: string;
  shoeFar: string;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Walks `len` from a joint at `angle` degrees off straight-down. */
function joint([x, y]: number[], len: number, angle: number): number[] {
  return [x + len * Math.sin(rad(angle)), y + len * Math.cos(rad(angle))];
}

/** A tapered quad between two joints — a limb with some thickness to it. */
function limb([ax, ay]: number[], [bx, by]: number[], wa: number, wb: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return [
    `M${ax + (nx * wa) / 2} ${ay + (ny * wa) / 2}`,
    `L${bx + (nx * wb) / 2} ${by + (ny * wb) / 2}`,
    `L${bx - (nx * wb) / 2} ${by - (ny * wb) / 2}`,
    `L${ax - (nx * wa) / 2} ${ay - (ny * wa) / 2}`,
    `Z`,
  ].join(' ');
}

/* One stride, six poses: strike, stance, toe-off, tuck, knee-drive,
   reach. [thigh angle off vertical, knee bend]. The other leg runs the
   same table three frames along, which is what makes it a stride
   rather than a hop. */
const LEG: [number, number][] = [
  [34, 16],
  [10, 8],
  [-26, 26],
  [-18, 100],
  [22, 94],
  [38, 44],
];

/* Two of the six poses have both feet off the ground. That flight
   phase is the whole difference between a run and a march. */
const RISE = [-1, 0, -2, -7, -6, -3];

/* The free arm swings against the legs. */
const FREE_ARM = [-52, -22, 20, 48, 16, -34];

const FRAMES = LEG.length;
const THIGH = 21;
const SHIN = 21;

function ChildPose({ c, id, f }: { c: ChildPalette; id: string; f: number }) {
  const rise = RISE[f];
  const hip = [0, -40 + rise];

  const leg = (phase: number) => {
    const [thigh, knee] = LEG[phase % FRAMES];
    const kneePt = joint(hip, THIGH, thigh);
    const ankle = joint(kneePt, SHIN, thigh - knee);
    const toe = joint(ankle, 10, thigh - knee + 74);
    return { kneePt, ankle, toe };
  };

  const near = leg(f);
  const far = leg(f + 3);
  /* Angles are off straight-down, so the free arm hangs near 0 and
     swings around it; the elbow stays bent the way a runner's does. */
  /* Long enough, and swinging wide enough, that both ends of the swing
     clear the torso — a shorter arm spends the whole stride hidden
     behind it. */
  const freeShoulder = [-4, -62 + rise];
  const freeElbow = joint(freeShoulder, 16, FREE_ARM[f]);
  const freeHand = joint(freeElbow, 15, FREE_ARM[f] + 65);

  /* The string hand is pinned: the kite is anchored to it from outside
     this group, so it must not ride the bob. The shoulder moves and the
     arm takes up the difference. */
  const HAND = [33, -97];
  const ELBOW = [24, -79];
  const stringShoulder = [10, -62 + rise];

  return (
    <g>
      {/* far side first — leg and arm behind the body */}
      <path d={limb(hip, far.kneePt, 15, 12)} fill={c.pantsFar} />
      <path d={limb(far.kneePt, far.ankle, 12, 9)} fill={c.pantsFar} />
      <path d={limb(far.ankle, far.toe, 8, 6)} fill={c.shoeFar} />
      <path d={limb(freeShoulder, freeElbow, 9.5, 8)} fill={c.skinFar} />
      <path d={limb(freeElbow, freeHand, 8, 6.5)} fill={c.skinFar} />
      <circle cx={freeHand[0]} cy={freeHand[1]} r="4" fill={c.skinFar} />

      {/* torso */}
      <path
        d={`M${-13} ${-38 + rise} L13 ${-38 + rise} L19 ${-68 + rise} L-8 ${-68 + rise} Z`}
        fill={`url(#${id}-shirt)`}
      />
      <path
        d={`M6 ${-38 + rise} L13 ${-38 + rise} L19 ${-68 + rise} L11 ${-68 + rise} Z`}
        fill={c.shirtShade}
        opacity="0.45"
      />

      {/* near leg */}
      <path d={limb(hip, near.kneePt, 16, 13)} fill={`url(#${id}-pants)`} />
      <path d={limb(near.kneePt, near.ankle, 13, 10)} fill={`url(#${id}-pants)`} />
      <path d={limb(near.ankle, near.toe, 9, 7)} fill={c.shoe} />

      {/* sleeves */}
      <path d={`M-8 ${-68 + rise} L0 ${-68 + rise} L-2 ${-55 + rise} L-12 ${-57 + rise} Z`} fill={c.shirtLit} />
      <path d={`M11 ${-68 + rise} L19 ${-68 + rise} L18 ${-55 + rise} L10 ${-56 + rise} Z`} fill={c.shirtShade} />

      {/* the arm up the string, and the fist closed on it */}
      <path d={limb(stringShoulder, ELBOW, 10, 8)} fill={`url(#${id}-skin)`} />
      <path d={limb(ELBOW, HAND, 8, 7)} fill={c.skin} />
      <circle cx={HAND[0]} cy={HAND[1]} r="4.2" fill={c.skinShade} />

      <path d={`M1 ${-73 + rise} L12 ${-73 + rise} L12 ${-63 + rise} L1 ${-63 + rise} Z`} fill={c.skinShade} />

      {/* head — deliberately large, the way a child's is */}
      <g transform={`translate(0 ${rise})`}>
        <path d="M8 -97 L19 -92 L22 -81 L16 -69 L5 -68 L-3 -76 L-3 -89 Z" fill={`url(#${id}-skin)`} />
        <path d="M14 -94 L19 -92 L22 -81 L16 -69 L12 -69 Z" fill={c.skinShade} opacity="0.7" />
        <path d="M2 -88 L13 -85 L13 -73 L4 -71 L-1 -77 Z" fill={c.skin} opacity="0.55" />
        <path d="M8 -98 L20 -92 L22 -83 L14 -87 L2 -85 L-3 -79 L-3 -89 Z" fill={c.hair} />
        <path d="M14 -94 L20 -92 L22 -83 L15 -86 Z" fill={c.hairShade} />
        <path d="M6 -97 L15 -93 L12 -89 L2 -87 L-1 -90 Z" fill={c.skin} opacity="0.16" />
      </g>
    </g>
  );
}

/* The stride plays as six drawn poses rather than tweened joints: the
   plate is a stop-motion-looking papercraft render, and swapped poses
   sit in that world better than smooth interpolation does. */
function ChildRunning({ c, id, cycle }: { c: ChildPalette; id: string; cycle: number }) {
  return (
    <g>
      <defs>
        {/* The plate is a soft render, not flat colour, so each part
            carries a gradient from its lit edge into its shade. */}
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2="0.7">
          <stop offset="0" stopColor={c.shirtLit} />
          <stop offset="0.55" stopColor={c.shirt} />
          <stop offset="1" stopColor={c.shirtShade} />
        </linearGradient>
        <linearGradient id={`${id}-pants`} x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0" stopColor={c.pants} />
          <stop offset="1" stopColor={c.pantsShade} />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0.1" y1="0" x2="1" y2="0.8">
          <stop offset="0" stopColor={c.skin} />
          <stop offset="1" stopColor={c.skinShade} />
        </linearGradient>
      </defs>
      {LEG.map((_, f) => (
        <g
          key={f}
          className="hp-frame"
          style={{
            animationDuration: `${cycle}s`,
            animationDelay: `${(-(FRAMES - f) * cycle) / FRAMES}s`,
          }}
        >
          <ChildPose c={c} id={id} f={f} />
        </g>
      ))}
    </g>
  );
}

function Kite({ face, fold, tail }: { face: string; fold: string; tail: string }) {
  return (
    <g>
      <path d="M0 -32 L21 0 L0 32 L-21 0 Z" fill={face} />
      <path d="M0 -32 L21 0 L0 32 Z" fill={fold} />
      <path d="M0 -32 L0 32 M-21 0 L21 0" stroke="#FFFDF6" strokeWidth="1.5" opacity="0.5" />
      <path
        d="M0 32 q 9 18 -4 31 q -11 15 3 29"
        fill="none"
        stroke={tail}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M-6 47 L6 43 M-3 67 L9 71 M-4 87 L8 91" stroke={tail} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

interface KidProps {
  cls: string;
  s: number;
  dur: number;
  delay: number;
  /** where the run starts and ends, and the ground line it runs along */
  x0: number;
  x1: number;
  gy: number;
  hand: [number, number];
  kite: [number, number];
  palette: ChildPalette;
  kiteColours: { face: string; fold: string; tail: string };
}

/** Local units from sole to crown. */
const CHILD_H = 97;

/* Child, string and kite travel as one group, so the three can never
   drift apart. The group that swings is anchored at the child's hand —
   its bounding box ends exactly there — so rotating it about its
   bottom-right corner swings the kite through an arc while the string
   stays in her fist. */
function KiteKid({ cls, s, dur, delay, x0, x1, gy, hand, kite, palette, kiteColours }: KidProps) {
  /* Pin the stride to the distance actually covered, or she treadmills:
     one cycle is two steps, and a running stride runs a little longer
     than the runner is tall. */
  const speed = Math.abs(x1 - x0) / dur;
  const cycle = (1.15 * CHILD_H * s) / speed;

  return (
    <g
      className={`hp-kid ${cls}`}
      style={{
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        ['--hp-x0' as string]: `${x0}px`,
        ['--hp-x1' as string]: `${x1}px`,
        ['--hp-gy' as string]: `${gy}px`,
      }}
    >
      <ellipse cx="0" cy="2" rx={17 * s} ry={4.5 * s} fill="#2F4A2A" opacity="0.16" />
      <g transform={`scale(${s})`}>
        <ChildRunning c={palette} id={cls} cycle={cycle} />
      </g>
      <g transform={`translate(${hand[0]} ${hand[1]})`}>
        <g className="hp-kid-line" style={{ animationDelay: `${delay / 3}s` }}>
          <line x1="0" y1="0" x2={kite[0]} y2={kite[1]} stroke="#C3B79C" strokeWidth="1.5" opacity="0.85" />
          <g transform={`translate(${kite[0]} ${kite[1]})`}>
            <Kite {...kiteColours} />
          </g>
        </g>
      </g>
    </g>
  );
}

function Bird({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="hp-bird" style={{ animationDelay: `${delay}s` }}>
        <path
          d="M-11 0 q 5.5 -6.5 11 -0.5 q 5.5 -6 11 0.5"
          fill="none"
          stroke="#3E4A63"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/* Rounded speech bubble with a tail that lands on a given point. The
   tail is built from the body's bottom edge so it always reads as part
   of the same sheet of paper. */
function bubblePath(x: number, y: number, w: number, h: number, tailX: number, tipX: number, tipY: number) {
  const r = 14;
  return [
    `M${x + r} ${y}`,
    `H${x + w - r}`,
    `A${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V${y + h - r}`,
    `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    `H${tailX + 13}`,
    `L${tipX} ${tipY}`,
    `L${tailX - 4} ${y + h}`,
    `H${x + r}`,
    `A${r} ${r} 0 0 1 ${x} ${y + h - r}`,
    `V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    `Z`,
  ].join(' ');
}

function BubbleText({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text className="hp-bubble-text" x={x} y={y} textAnchor="middle">
      {children}
    </text>
  );
}

export function HeroPlate() {
  return (
    <div className="kite-plate" aria-hidden="true">
      <img
        className="kite-plate-base"
        src="/hero-festival.jpg"
        alt=""
        decoding="async"
        fetchPriority="high"
      />

      {/* ---- generated sprites, each with its own motion ---- */}
      <img className="hp-sprite hp-windsock" src="/sprites/windsock.png" alt="" />
      <img className="hp-sprite hp-kite-big" src="/sprites/kite.png" alt="" />

      <svg
        className="kite-plate-motion"
        viewBox="0 0 1584 672"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* shades the underside of every pinwheel's centre boss */}
          <clipPath id="hp-boss-shade">
            <rect x="-40" y="0" width="80" height="40" />
          </clipPath>
        </defs>

        {/* ---- clouds, drifting far slower than anything else ---- */}
        <g className="hp-clouds">
          <g className="hp-cloud hp-cloud--1">
            <ellipse cx="0" cy="0" rx="62" ry="22" fill="#FFFDF6" />
            <ellipse cx="44" cy="-10" rx="42" ry="19" fill="#FFFFFF" />
            <ellipse cx="-40" cy="-4" rx="34" ry="16" fill="#FBF4E4" />
            <ellipse cx="6" cy="12" rx="70" ry="12" fill="#F3EADA" opacity="0.75" />
          </g>
          <g className="hp-cloud hp-cloud--2">
            <ellipse cx="0" cy="0" rx="46" ry="17" fill="#FFFDF6" />
            <ellipse cx="34" cy="-8" rx="30" ry="14" fill="#FFFFFF" />
            <ellipse cx="2" cy="9" rx="52" ry="9" fill="#F3EADA" opacity="0.7" />
          </g>
          <g className="hp-cloud hp-cloud--3">
            <ellipse cx="0" cy="0" rx="34" ry="13" fill="#FFFDF6" />
            <ellipse cx="24" cy="-6" rx="22" ry="11" fill="#FFFFFF" />
          </g>
        </g>

        {/* ---- birds ---- */}
        <g className="hp-flock hp-flock--a">
          {BIRDS_A.map((b, i) => (
            <Bird key={i} {...b} delay={i * 0.13} />
          ))}
        </g>
        <g className="hp-flock hp-flock--b">
          {BIRDS_B.map((b, i) => (
            <Bird key={i} {...b} delay={i * 0.17} />
          ))}
        </g>

        {/* ---- leaves carried on the wind ---- */}
        {LEAVES.map((l, i) => (
          <g
            key={i}
            className="hp-leaf-track"
            style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s`, ['--hp-ly' as string]: `${l.y}px` }}
          >
            <g className="hp-leaf" style={{ animationDelay: `${l.delay}s` }}>
              <g transform={`rotate(${l.tilt}) scale(${l.s})`}>
                <path d={LEAF_D} fill={l.fill} />
                <path d="M0 0 H22" stroke="#4F6B34" strokeWidth="1" opacity="0.5" />
              </g>
            </g>
          </g>
        ))}

        {/* ---- the couple's conversation, taking turns ---- */}
        {/* tail lands on the seated man in mustard, head measured at (578, 468) */}
        <g className="hp-bubble hp-bubble--left">
          <path d={bubblePath(442, 346, 150, 54, 548, 574, 452)} fill="#FFFDF6" />
          <BubbleText x={517} y={379}>Think it&#8217;ll fly?</BubbleText>
        </g>

        {/* tail lands on the seated woman in coral, head measured at (690, 470) */}
        <g className="hp-bubble hp-bubble--right">
          <path d={bubblePath(628, 342, 140, 50, 664, 688, 452)} fill="#FFFDF6" />
          <BubbleText x={698} y={373}>It already is.</BubbleText>
        </g>

        {/* ---- pinwheels, the fastest thing in the scene ---- */}
        <Pinwheel cx={148} cy={470} r={60} spin={2.4} poleTo={700} />
        <Pinwheel cx={862} cy={468} r={46} spin={3.1} poleTo={700} />

        {/* ---- two children running their kites across the field ---- */}
        <KiteKid
          cls="hp-kid--a"
          s={1.02}
          dur={16}
          delay={0}
          x0={90}
          x1={1560}
          gy={618}
          hand={[34, -99]}
          kite={[-186, -172]}
          palette={{
            skin: '#D9A26E',
            skinShade: '#B57F4D',
            hair: '#4A3524',
            hairShade: '#33240F',
            shirt: '#E0826A',
            shirtShade: '#B85F49',
            shirtLit: '#F09C80',
            pants: '#4A6FC8',
            pantsShade: '#33509E',
            pantsFar: '#22376B',
            skinFar: '#9C6B3E',
            shoe: '#3A2E22',
            shoeFar: '#291F16',
          }}
          kiteColours={{ face: '#E8B84B', fold: '#C08F2E', tail: '#2C42B4' }}
        />
        <KiteKid
          cls="hp-kid--b"
          s={1.14}
          dur={19}
          delay={-11}
          x0={-80}
          x1={1420}
          gy={660}
          hand={[38, -111]}
          kite={[-178, -224]}
          palette={{
            skin: '#E8C39A',
            skinShade: '#C49B70',
            hair: '#6B4A32',
            hairShade: '#4A3120',
            shirt: '#69A9A2',
            shirtShade: '#4A7D77',
            shirtLit: '#84C1BA',
            pants: '#E0B44C',
            pantsShade: '#BE9236',
            pantsFar: '#7E5D1C',
            skinFar: '#A87F53',
            shoe: '#3A2E22',
            shoeFar: '#291F16',
          }}
          kiteColours={{ face: '#F0E2C2', fold: '#E07A5F', tail: '#5D9E97' }}
        />

        {/* ---- butterflies working the flowerbeds ---- */}
        {BUTTERFLIES.map((b, i) => (
          <g
            key={i}
            className="hp-flutter"
            style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, ['--hp-by' as string]: `${b.y}px` }}
          >
            <g transform={`scale(${b.s})`}>
              <g className="hp-wing hp-wing--l">
                <path d="M0 -4 C -7 -21, -24 -23, -26 -10 C -27 -1, -15 1, 0 -1 Z" fill={b.fill} />
                <path d="M0 0 C -9 5, -20 11, -17 18 C -13 24, -4 13, 0 5 Z" fill={shade(b.fill, 0.18)} />
              </g>
              <g className="hp-wing hp-wing--r">
                <path d="M0 -4 C 7 -21, 24 -23, 26 -10 C 27 -1, 15 1, 0 -1 Z" fill={b.fill} />
                <path d="M0 0 C 9 5, 20 11, 17 18 C 13 24, 4 13, 0 5 Z" fill={shade(b.fill, 0.18)} />
              </g>
              <ellipse cx="0" cy="1" rx="1.8" ry="8" fill="#4A3B2A" />
              <path d="M-1 -7 C -3 -12, -5 -13, -6 -14 M1 -7 C 3 -12, 5 -13, 6 -14" stroke="#4A3B2A" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
          </g>
        ))}

        {/* ---- sparkles through the flowerbeds ---- */}
        {SPARKLES.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.s})`}>
            <path className="hp-sparkle" d={SPARKLE_D} fill="#FFFDF6" style={{ animationDelay: `${s.delay}s` }} />
          </g>
        ))}
      </svg>
    </div>
  );
}
