import './HeroPlate.css';

/*
 * The hero illustration: a generated plate with generated sprites and an
 * SVG layer composited over it, so the scene can actually move.
 *
 * The plate (public/hero-festival.jpg) is deliberately generated WITHOUT
 * the kites, windsock and running child — see scripts/generate-hero-art.mjs.
 * Those arrive separately as transparent sprites from
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

function BubbleLines({ x, y, widths }: { x: number; y: number; widths: number[] }) {
  return (
    <g className="hp-bubble-lines">
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * 13} width={w} height={5} rx="2.5" fill="#A9A08E" />
      ))}
    </g>
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

      {/* The child, her kite and the string between them travel as one
          unit at the same rate, or the line would tear away from her. */}
      <div className="hp-track hp-track--kite">
        <img className="hp-kite-small" src="/sprites/kiteSmall.png" alt="" />
      </div>
      <div className="hp-track hp-track--runner">
        <img className="hp-runner" src="/sprites/runner.png" alt="" />
      </div>

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

        {/* the runner's line, travelling with her */}
        <line
          className="hp-line"
          x1="332"
          y1="470"
          x2="474"
          y2="268"
          stroke="#BFB49A"
          strokeWidth="1.6"
          opacity="0.85"
        />

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
          <path d={bubblePath(452, 350, 130, 58, 548, 574, 452)} fill="#FFFDF6" />
          <BubbleLines x={474} y={367} widths={[86, 66, 44]} />
        </g>

        {/* tail lands on the seated woman in coral, head measured at (690, 470) */}
        <g className="hp-bubble hp-bubble--right">
          <path d={bubblePath(636, 334, 122, 54, 664, 688, 452)} fill="#FFFDF6" />
          <BubbleLines x={656} y={351} widths={[80, 56, 68]} />
        </g>

        {/* ---- pinwheels, the fastest thing in the scene ---- */}
        <Pinwheel cx={148} cy={470} r={60} spin={2.4} poleTo={700} />
        <Pinwheel cx={862} cy={468} r={46} spin={3.1} poleTo={700} />

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
