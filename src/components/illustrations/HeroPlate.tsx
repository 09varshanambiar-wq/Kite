import './HeroPlate.css';

/*
 * The hero illustration: a generated plate with an animated layer on top.
 *
 * The plate comes from Gemini's Nano Banana Pro (gemini-3-pro-image) via
 * the style contract in scripts/generate-hero-art.mjs. It carries the
 * things that need render quality and hold still — the giant wheel, the
 * kite shop and its keeper, the crowd, and the wind-swept grass.
 *
 * Everything that needs to MOVE is drawn over it as SVG, because a
 * bitmap cannot animate: the birds, the couple's conversation, and the
 * wind itself. The overlay shares the plate's 1584x672 coordinate space
 * and the same slice behaviour as the image's object-fit, so the two
 * stay registered at any width.
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

export function HeroPlate() {
  return (
    <div className="kite-plate" aria-hidden="true">
      <img src="/hero-festival.png" alt="" decoding="async" fetchPriority="high" />

      <svg
        className="kite-plate-motion"
        viewBox="0 0 1584 672"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* ---- wind, blowing left to right across the sky ---- */}
        <g className="hp-wind" stroke="#FFFFFF" fill="none" strokeLinecap="round" opacity="0.75">
          <path className="hp-gust hp-gust--1" d="M0 214 q 46 -11 96 -2 q 34 6 74 -4" strokeWidth="3.4" />
          <path className="hp-gust hp-gust--2" d="M0 286 q 38 -9 80 -1 q 28 5 60 -3" strokeWidth="2.8" />
          <path className="hp-gust hp-gust--3" d="M0 148 q 52 -12 108 -2 q 38 7 82 -5" strokeWidth="3" />
          <path className="hp-gust hp-gust--4" d="M0 372 q 32 -7 68 -1 q 24 4 52 -3" strokeWidth="2.4" />
        </g>

        {/* ---- birds, two flocks crossing at different heights ---- */}
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

        {/* ---- the couple's conversation, taking turns ---- */}
        <g className="hp-bubble hp-bubble--left">
          <path
            d="M300 452 h108 a17 17 0 0 1 17 17 v34 a17 17 0 0 1 -17 17 h-58 l-20 19 v-19 h-30 a17 17 0 0 1 -17 -17 v-34 a17 17 0 0 1 17 -17 Z"
            fill="#FFFDF6"
          />
          <g className="hp-dots">
            <circle cx="330" cy="486" r="5.5" fill="#2C42B4" />
            <circle cx="352" cy="486" r="5.5" fill="#2C42B4" />
            <circle cx="374" cy="486" r="5.5" fill="#2C42B4" />
          </g>
        </g>

        <g className="hp-bubble hp-bubble--right">
          <path
            d="M494 428 h96 a16 16 0 0 1 16 16 v31 a16 16 0 0 1 -16 16 h-30 l18 19 l-36 -19 h-48 a16 16 0 0 1 -16 -16 v-31 a16 16 0 0 1 16 -16 Z"
            fill="#FFFDF6"
          />
          <g className="hp-dots">
            <circle cx="520" cy="460" r="5" fill="#E07A5F" />
            <circle cx="540" cy="460" r="5" fill="#E07A5F" />
            <circle cx="560" cy="460" r="5" fill="#E07A5F" />
          </g>
        </g>
      </svg>
    </div>
  );
}
