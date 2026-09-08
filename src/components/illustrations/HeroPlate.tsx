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
 * Everything is placed in percentages of the plate's own 1584x672 frame,
 * so the composite stays registered at any width.
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

/** Foreground stems that lean with the same wind as everything else. */
const STEM_BASE = 668;
const STEMS = [
  { x: 60, h: 74, petal: '#E07A5F' },
  { x: 152, h: 56, petal: null },
  { x: 266, h: 66, petal: '#E8B84B' },
  { x: 372, h: 48, petal: null },
  { x: 700, h: 60, petal: '#E07A5F' },
  { x: 820, h: 72, petal: '#F0A088' },
  { x: 1050, h: 52, petal: null },
  { x: 1196, h: 68, petal: '#E8B84B' },
  { x: 1336, h: 58, petal: '#E07A5F' },
  { x: 1472, h: 76, petal: null },
  { x: 1546, h: 56, petal: '#E8B84B' },
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
        {/* the runner's line, bobbing in step with the runner */}
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

        {/* ---- clouds, drifting far slower than the gusts ---- */}
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

        {/* ---- wind across the sky ---- */}
        <g className="hp-wind" stroke="#FFFFFF" fill="none" strokeLinecap="round" opacity="0.75">
          <path className="hp-gust hp-gust--1" d="M0 214 q 46 -11 96 -2 q 34 6 74 -4" strokeWidth="3.4" />
          <path className="hp-gust hp-gust--2" d="M0 286 q 38 -9 80 -1 q 28 5 60 -3" strokeWidth="2.8" />
          <path className="hp-gust hp-gust--3" d="M0 148 q 52 -12 108 -2 q 38 7 82 -5" strokeWidth="3" />
          <path className="hp-gust hp-gust--4" d="M0 372 q 32 -7 68 -1 q 24 4 52 -3" strokeWidth="2.4" />
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

        {/* ---- foreground stems, leaning in the same wind ---- */}
        <g className="hp-stems">
          {STEMS.map((s, i) => (
            <g key={i} className="hp-stem" style={{ animationDelay: `${(i % 5) * -0.9}s` }}>
              <path
                d={`M${s.x} ${STEM_BASE} q ${s.h * 0.34} -${s.h * 0.7} ${s.h * 0.62} -${s.h}`}
                stroke="#5B8C45"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {s.petal && <circle cx={s.x + s.h * 0.62} cy={STEM_BASE - s.h} r="8" fill={s.petal} />}
              {s.petal && <circle cx={s.x + s.h * 0.62} cy={STEM_BASE - s.h} r="3.2" fill="#FBF6EA" />}
            </g>
          ))}
        </g>

        {/* ---- the couple's conversation, taking turns ---- */}
        {/* tail lands on the man in mustard at (583, 465) */}
        <g className="hp-bubble hp-bubble--left">
          <path
            d="M486 356 H594 A16 16 0 0 1 610 372 V408 A16 16 0 0 1 594 424 H590 L578 450 L566 424 H486 A16 16 0 0 1 470 408 V372 A16 16 0 0 1 486 356 Z"
            fill="#FFFDF6"
          />
          <g className="hp-dots">
            <circle cx="515" cy="390" r="5.5" fill="#2C42B4" />
            <circle cx="540" cy="390" r="5.5" fill="#2C42B4" />
            <circle cx="565" cy="390" r="5.5" fill="#2C42B4" />
          </g>
        </g>

        {/* tail lands on the woman in coral at (688, 465) */}
        <g className="hp-bubble hp-bubble--right">
          <path
            d="M676 340 H780 A16 16 0 0 1 796 356 V390 A16 16 0 0 1 780 406 H716 L692 434 L700 406 H676 A16 16 0 0 1 660 390 V356 A16 16 0 0 1 676 340 Z"
            fill="#FFFDF6"
          />
          <g className="hp-dots">
            <circle cx="700" cy="373" r="5" fill="#E07A5F" />
            <circle cx="724" cy="373" r="5" fill="#E07A5F" />
            <circle cx="748" cy="373" r="5" fill="#E07A5F" />
          </g>
        </g>
      </svg>
    </div>
  );
}
