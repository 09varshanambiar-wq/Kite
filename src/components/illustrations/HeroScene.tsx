import './HeroScene.css';
import { Person } from './ScenePeople';
import { paperForm, ridge, FOLIAGE_TONES, FOLIAGE_DEEP, BUSH_TONES } from './sceneGeometry';

/*
 * The hero scene: a low-poly papercraft kite festival.
 *
 * Vector rather than a flat image, because the small animations live
 * INSIDE the picture — a bitmap cannot spin its own pinwheel. Every
 * moving part is its own node.
 *
 * Depth is built the way a papercraft set is: faceted forms lit from a
 * single direction, every object grounded with a cast shadow, distant
 * layers washed toward the sky colour, and a fibre grain laid over the
 * whole thing so it reads as paper rather than plastic.
 */

const W = 1600;
const H = 600;

/* Trees are generated so their facets stay consistently lit. Distant
   ones use the deeper palette and get washed back by an atmosphere
   layer drawn over them. */
const TREES = [
  { cx: 1223, cy: 400, r: 58, seed: 11, tones: FOLIAGE_TONES, trunk: [1216, 436, 15, 70] },
  { cx: 1506, cy: 420, r: 52, seed: 23, tones: FOLIAGE_TONES, trunk: [1500, 448, 14, 64] },
  { cx: 201, cy: 428, r: 44, seed: 41, tones: FOLIAGE_DEEP, trunk: [196, 450, 12, 56] },
  { cx: 1092, cy: 432, r: 34, seed: 57, tones: FOLIAGE_DEEP, trunk: [1088, 448, 10, 44] },
] as const;

/* Shrubs belong at tree bases and along the edges — dropped in open
   lawn they read as stray objects rather than planting. */
const BUSHES = [
  { cx: 74, cy: 508, r: 25, seed: 5 },
  { cx: 258, cy: 462, r: 19, seed: 9 },
  { cx: 1266, cy: 452, r: 21, seed: 13 },
  { cx: 1462, cy: 448, r: 16, seed: 17 },
  { cx: 1566, cy: 496, r: 23, seed: 19 },
  { cx: 1130, cy: 452, r: 14, seed: 27 },
];

const HILL_FAR = ridge(W, 372, 62, 13, 3, 470);
const HILL_MID = ridge(W, 398, 44, 11, 8, 480);
const HILL_NEAR = ridge(W, 418, 30, 9, 15, 490);

/** Scattered grass tufts, denser toward the foreground. */
const TUFTS = Array.from({ length: 46 }, (_, i) => {
  const t = i / 46;
  const x = ((i * 137) % 1600) + (i % 3) * 11;
  const y = 470 + t * 118 + ((i * 53) % 24);
  const h = 9 + ((i * 7) % 12);
  return { x, y, h, dark: i % 3 === 0 };
});

export function HeroScene() {
  return (
    <div className="kite-scene" aria-hidden="true">
      <svg
        className="kite-scene-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        role="img"
      >
        <defs>
          <linearGradient id="ks-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A9D488" />
            <stop offset="55%" stopColor="#8CC069" />
            <stop offset="100%" stopColor="#6D9F4E" />
          </linearGradient>
          <linearGradient id="ks-field-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBE3AC" />
            <stop offset="100%" stopColor="#A9D488" />
          </linearGradient>
          {/* washes distant layers toward the sky, giving aerial depth */}
          <linearGradient id="ks-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7F1E3" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#F7F1E3" stopOpacity="0" />
          </linearGradient>

          {/* paper fibre — the texture that makes this read as paper */}
          <filter id="ks-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
          </filter>

          {/* the soft lift of a cut-paper layer off the sheet below it */}
          <filter id="ks-lift" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#3A4A2E" floodOpacity="0.22" />
          </filter>
          <filter id="ks-lift-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#3A4A2E" floodOpacity="0.24" />
          </filter>
        </defs>

        {/* ---------------- sky ---------------- */}
        <g className="ks-cloud ks-cloud--a" opacity="0.95">
          <ellipse cx="250" cy="96" rx="54" ry="21" fill="#FFFDF7" />
          <ellipse cx="292" cy="86" rx="37" ry="18" fill="#FFFFFF" />
          <ellipse cx="212" cy="88" rx="29" ry="15" fill="#F6EEDF" />
        </g>
        <g className="ks-cloud ks-cloud--b" opacity="0.8">
          <ellipse cx="1180" cy="76" rx="46" ry="18" fill="#FFFDF7" />
          <ellipse cx="1216" cy="68" rx="31" ry="15" fill="#FFFFFF" />
        </g>

        {/* ---------------- hills, back to front ---------------- */}
        <path d={HILL_FAR} fill="#2C42B4" />
        <path d={HILL_MID} fill="#4A6FC8" />
        <path d={HILL_NEAR} fill="#7FB3B3" />
        <path d={ridge(W, 432, 20, 8, 31, 500)} fill="#D8B45F" opacity="0.75" />
        {/* aerial haze over the distance only */}
        <rect x="0" y="330" width={W} height="150" fill="url(#ks-haze)" />

        {/* ---------------- field ---------------- */}
        <path d={`M0 440 L${W} 440 L${W} ${H} L0 ${H} Z`} fill="url(#ks-field-far)" />
        <path
          d={`M0 478 C 300 458, 640 494, 980 470 C 1240 452, 1420 488, ${W} 472 L${W} ${H} L0 ${H} Z`}
          fill="url(#ks-field)"
        />
        {/* a mown band catching the light */}
        <path
          d={`M0 512 C 340 496, 700 528, 1040 508 C 1300 492, 1440 520, ${W} 506 L${W} 540 C 1400 552, 1200 528, 940 542 C 640 558, 320 530, 0 548 Z`}
          fill="#B2DB90"
          opacity="0.35"
        />

        {/* ---------------- trees ---------------- */}
        {TREES.map((t, i) => (
          <g key={`tree-${i}`}>
            <ellipse cx={t.cx} cy={t.trunk[1] + t.trunk[3]} rx={t.r * 0.62} ry="7" fill="#2F4A2A" opacity="0.2" />
            <rect x={t.trunk[0]} y={t.trunk[1]} width={t.trunk[2]} height={t.trunk[3]} rx="5" fill="#8A5F3C" />
            <rect x={t.trunk[0]} y={t.trunk[1]} width={t.trunk[2] / 2.4} height={t.trunk[3]} rx="4" fill="#A0714A" />
            <g filter="url(#ks-lift)">
              {paperForm(t.cx, t.cy, t.r, [...t.tones], { seed: t.seed, sides: 12, squashY: 0.92, layers: 5, jitter: 0.2 }).map((f, j) => (
                <path key={j} d={f.d} fill={f.fill} />
              ))}
            </g>
          </g>
        ))}

        {/* ---------------- bushes ---------------- */}
        {BUSHES.map((b, i) => (
          <g key={`bush-${i}`}>
            <ellipse cx={b.cx} cy={b.cy + b.r * 0.62} rx={b.r * 0.9} ry="5" fill="#2F4A2A" opacity="0.16" />
            {paperForm(b.cx, b.cy, b.r, BUSH_TONES, { seed: b.seed, sides: 10, squashY: 0.86, layers: 4, jitter: 0.24 }).map((f, j) => (
              <path key={j} d={f.d} fill={f.fill} />
            ))}
          </g>
        ))}

        {/* ---------------- kite lines ---------------- */}
        <line x1="470" y1="242" x2="676" y2="470" stroke="#BFB49A" strokeWidth="1.3" />
        <line x1="1470" y1="286" x2="1318" y2="452" stroke="#BFB49A" strokeWidth="1.3" />

        {/* ---------------- kites ---------------- */}
        <g className="ks-kite ks-kite--lead" filter="url(#ks-lift-sm)">
          <line x1="1268" y1="176" x2="884" y2="418" stroke="#BFB49A" strokeWidth="1.5" />
          <path d="M1268 96 L1334 172 L1268 248 L1202 172 Z" fill="#2C42B4" />
          <path d="M1268 96 L1334 172 L1268 172 Z" fill="#E8B84B" />
          <path d="M1268 248 L1202 172 L1268 172 Z" fill="#1B2E8C" />
          <path d="M1268 96 L1202 172 L1268 172 Z" fill="#4A6FC8" />
          <path className="ks-tail" d="M1268 248 q 28 36 -6 66 q -32 30 4 64" fill="none" stroke="#E8B84B" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g className="ks-kite ks-kite--a" filter="url(#ks-lift-sm)">
          <path d="M470 148 L510 196 L470 244 L430 196 Z" fill="#7FB3B3" />
          <path d="M470 148 L510 196 L470 196 Z" fill="#A9D3D3" />
          <path d="M470 244 L430 196 L470 196 Z" fill="#4E8686" />
          <path className="ks-tail" d="M470 244 q 16 24 -4 42" fill="none" stroke="#E07A5F" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="ks-kite ks-kite--b" filter="url(#ks-lift-sm)">
          <path d="M760 94 L794 136 L760 178 L726 136 Z" fill="#E07A5F" />
          <path d="M760 94 L794 136 L760 136 Z" fill="#F0A088" />
          <path d="M760 178 L726 136 L760 136 Z" fill="#B85742" />
          <path className="ks-tail" d="M760 178 q 14 22 -4 38" fill="none" stroke="#2C42B4" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="ks-kite ks-kite--c" filter="url(#ks-lift-sm)">
          <path d="M1470 208 L1502 248 L1470 288 L1438 248 Z" fill="#E8B84B" />
          <path d="M1470 208 L1502 248 L1470 248 Z" fill="#F5D68C" />
          <path d="M1470 288 L1438 248 L1470 248 Z" fill="#C08F28" />
          <path className="ks-tail" d="M1470 288 q 12 20 -4 34" fill="none" stroke="#2C42B4" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* ---------------- kite display rack ---------------- */}
        <g>
          <ellipse cx="232" cy="512" rx="150" ry="9" fill="#2F4A2A" opacity="0.14" />
          <rect x="92" y="366" width="9" height="146" rx="4" fill="#8A5F3C" />
          <rect x="92" y="366" width="4" height="146" rx="2" fill="#A0714A" />
          <rect x="362" y="366" width="9" height="146" rx="4" fill="#8A5F3C" />
          <rect x="362" y="366" width="4" height="146" rx="2" fill="#A0714A" />
          <rect x="82" y="360" width="298" height="10" rx="5" fill="#75502F" />
          <rect x="82" y="360" width="298" height="4" rx="2" fill="#9A6C44" />

          <g className="ks-hang ks-hang--1" filter="url(#ks-lift-sm)">
            <line x1="150" y1="370" x2="150" y2="384" stroke="#BFB49A" strokeWidth="1.4" />
            <path d="M150 384 L178 418 L150 452 L122 418 Z" fill="#2C42B4" />
            <path d="M150 384 L178 418 L150 418 Z" fill="#80AFFF" />
            <path d="M150 452 L122 418 L150 418 Z" fill="#1B2E8C" />
          </g>
          <g className="ks-hang ks-hang--2" filter="url(#ks-lift-sm)">
            <line x1="232" y1="370" x2="232" y2="384" stroke="#BFB49A" strokeWidth="1.4" />
            <path d="M232 384 L262 422 L232 460 L202 422 Z" fill="#E8B84B" />
            <path d="M232 384 L262 422 L232 422 Z" fill="#F5D68C" />
            <path d="M232 460 L202 422 L232 422 Z" fill="#C08F28" />
          </g>
          <g className="ks-hang ks-hang--3" filter="url(#ks-lift-sm)">
            <line x1="318" y1="370" x2="318" y2="382" stroke="#BFB49A" strokeWidth="1.4" />
            <ellipse cx="304" cy="406" rx="19" ry="25" fill="#E07A5F" />
            <ellipse cx="332" cy="406" rx="19" ry="25" fill="#F0A088" />
            <ellipse cx="304" cy="432" rx="14" ry="18" fill="#C2604A" />
            <ellipse cx="332" cy="432" rx="14" ry="18" fill="#E07A5F" />
            <rect x="316" y="382" width="4" height="66" rx="2" fill="#75502F" />
          </g>
        </g>

        {/* ---------------- windsock mast ---------------- */}
        <g>
          <ellipse cx="562" cy="518" rx="26" ry="6" fill="#2F4A2A" opacity="0.16" />
          <rect x="556" y="296" width="10" height="222" rx="5" fill="#D8CDB6" />
          <rect x="556" y="296" width="4" height="222" rx="2" fill="#EDE4D2" />
          <g className="ks-anemo" style={{ transformOrigin: '561px 302px' }}>
            <line x1="561" y1="302" x2="527" y2="286" stroke="#2C42B4" strokeWidth="3.4" />
            <line x1="561" y1="302" x2="595" y2="290" stroke="#2C42B4" strokeWidth="3.4" />
            <line x1="561" y1="302" x2="563" y2="340" stroke="#2C42B4" strokeWidth="3.4" />
            <circle cx="525" cy="285" r="9.5" fill="#7FB3B3" />
            <circle cx="522" cy="282" r="4" fill="#A9D3D3" />
            <circle cx="597" cy="289" r="9.5" fill="#2C42B4" />
            <circle cx="594" cy="286" r="4" fill="#4A6FC8" />
            <circle cx="563" cy="342" r="9.5" fill="#80AFFF" />
            <circle cx="560" cy="339" r="4" fill="#AECBFF" />
            <circle cx="561" cy="302" r="5" fill="#1B2E8C" />
          </g>
          <g className="ks-windsock" style={{ transformOrigin: '566px 350px' }} filter="url(#ks-lift-sm)">
            <path d="M566 332 L648 342 L648 374 L566 368 Z" fill="#2C42B4" />
            <path d="M592 335 L618 338 L618 372 L592 370 Z" fill="#FBF6EA" />
            <path d="M648 342 L682 350 L682 368 L648 374 Z" fill="#E8B84B" />
            <path d="M566 332 L648 342 L648 350 L566 340 Z" fill="#4A6FC8" opacity="0.7" />
          </g>
        </g>

        {/* ---------------- notice board ---------------- */}
        <g>
          <ellipse cx="688" cy="520" rx="56" ry="7" fill="#2F4A2A" opacity="0.16" />
          <rect x="652" y="474" width="9" height="46" rx="4" fill="#75502F" />
          <rect x="716" y="474" width="9" height="46" rx="4" fill="#75502F" />
          <g filter="url(#ks-lift)">
            <rect x="636" y="392" width="104" height="84" rx="6" fill="#3A52BE" />
            <rect x="636" y="392" width="104" height="8" rx="4" fill="#5C77D8" />
            <rect x="646" y="406" width="38" height="28" rx="3" fill="#FBF6EA" />
            <rect x="692" y="406" width="38" height="28" rx="3" fill="#E8B84B" />
            <rect x="646" y="440" width="38" height="28" rx="3" fill="#E8B84B" />
            <rect x="692" y="440" width="38" height="28" rx="3" fill="#FBF6EA" />
          </g>
        </g>

        {/* ---------------- picnic: blue blanket ---------------- */}
        <g>
          <path d="M596 524 L790 512 L814 566 L612 580 Z" fill="#3A52BE" filter="url(#ks-lift-sm)" />
          <path d="M596 524 L790 512 L800 536 L604 548 Z" fill="#5C77D8" opacity="0.8" />
          <path d="M660 518 L676 574" stroke="#5C77D8" strokeWidth="4" opacity="0.55" />
          <path d="M726 514 L742 570" stroke="#5C77D8" strokeWidth="4" opacity="0.55" />
          <g filter="url(#ks-lift-sm)">
            <rect x="812" y="518" width="38" height="28" rx="5" fill="#C79468" />
            <rect x="812" y="518" width="38" height="8" rx="4" fill="#8A5F3C" />
          </g>
        </g>
        <Person x={668} y={540} s={0.94} skin="#E8B48A" skinShade="#D19A70" hair="#5A4632" shirt={['#E8B84B', '#C08F28']} pants={['#4A6FC8', '#2C42B4']} pose="sit" />
        <Person x={752} y={548} s={0.94} skin="#C98D5E" skinShade="#AE754A" hair="#2E2419" shirt={['#E07A5F', '#B85742']} pants={['#7FB3B3', '#4E8686']} pose="sit" flip />

        {/* bubbles: they take turns, so the pair reads as a conversation */}
        <g className="ks-bubble ks-bubble--a" filter="url(#ks-lift-sm)">
          <ellipse cx="700" cy="446" rx="27" ry="18" fill="#FFFFFF" />
          <path d="M690 461 l-9 13 l17 -6 Z" fill="#FFFFFF" />
        </g>
        <g className="ks-bubble ks-bubble--b" filter="url(#ks-lift-sm)">
          <ellipse cx="786" cy="452" rx="23" ry="15" fill="#FFFFFF" />
          <path d="M796 465 l9 12 l-17 -6 Z" fill="#FFFFFF" />
        </g>

        {/* ---------------- picnic: yellow blanket ---------------- */}
        <g>
          <path d="M900 538 L1082 526 L1104 574 L920 588 Z" fill="#E8B84B" filter="url(#ks-lift-sm)" />
          <path d="M900 538 L1082 526 L1090 546 L908 558 Z" fill="#F5D68C" opacity="0.85" />
          <path d="M960 532 L976 582" stroke="#F5D68C" strokeWidth="4" opacity="0.6" />
          <g filter="url(#ks-lift-sm)">
            <rect x="1016" y="530" width="34" height="26" rx="5" fill="#C79468" />
            <rect x="1016" y="530" width="34" height="8" rx="4" fill="#8A5F3C" />
          </g>
          <circle cx="1074" cy="546" r="9" fill="#7FB3B3" />
          <circle cx="1072" cy="543" r="4" fill="#A9D3D3" />
        </g>
        <Person x={952} y={556} s={0.9} skin="#E8B48A" skinShade="#D19A70" hair="#8A5F3C" shirt={['#4A6FC8', '#2C42B4']} pants={['#E8B84B', '#C08F28']} pose="sit" />

        {/* ---------------- the kite flyer ---------------- */}
        <Person className="ks-runner" x={866} y={500} s={1} skin="#C98D5E" skinShade="#AE754A" hair="#5A4632" shirt={['#4A6FC8', '#2C42B4']} pants={['#E07A5F', '#B85742']} pose="run" />

        {/* ---------------- bench ---------------- */}
        <g>
          <ellipse cx="1104" cy="500" rx="66" ry="7" fill="#2F4A2A" opacity="0.16" />
          <g filter="url(#ks-lift-sm)">
            <rect x="1046" y="452" width="118" height="10" rx="4" fill="#8A5F3C" />
            <rect x="1046" y="452" width="118" height="4" rx="2" fill="#A0714A" />
            <rect x="1046" y="430" width="118" height="9" rx="4" fill="#9A6C44" />
            <rect x="1054" y="462" width="9" height="34" rx="4" fill="#75502F" />
            <rect x="1147" y="462" width="9" height="34" rx="4" fill="#75502F" />
          </g>
        </g>

        {/* ---------------- dog ---------------- */}
        <g className="ks-dog">
          <ellipse cx="1176" cy="566" rx="30" ry="6" fill="#2F4A2A" opacity="0.18" />
          <path d="M1156 552 L1152 566" stroke="#C79468" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M1190 552 L1194 566" stroke="#C79468" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M1166 552 L1162 566" stroke="#EFE2CC" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M1184 552 L1188 566" stroke="#EFE2CC" strokeWidth="5.5" strokeLinecap="round" />
          <ellipse cx="1174" cy="537" rx="27" ry="15" fill="#FBF6EA" />
          <path d="M1156 528 q 18 -9 36 0 q -16 7 -36 0 Z" fill="#C79468" />
          <path d="M1150 534 q -13 -11 -20 -2 q 7 11 20 6 Z" fill="#C79468" />
          <circle cx="1200" cy="524" r="12" fill="#EFE2CC" />
          <path d="M1192 517 q 11 -7 18 2 q -9 5 -18 -2 Z" fill="#A0714A" />
          <ellipse cx="1210" cy="529" rx="6.5" ry="5" fill="#8A5F3C" />
          <circle cx="1212" cy="527" r="2" fill="#2E2419" />
          <path d="M1193 519 q -8 5 -3 15 q 9 -3 9 -13 Z" fill="#A0714A" />
        </g>

        {/* ---------------- market cart ---------------- */}
        <g>
          <ellipse cx="1400" cy="512" rx="86" ry="9" fill="#2F4A2A" opacity="0.16" />
          <g filter="url(#ks-lift)">
            <path d="M1330 400 L1472 400 L1482 430 L1320 430 Z" fill="#FBF6EA" />
            <path d="M1354 400 L1362 430 L1330 430 L1338 400 Z" fill="#E07A5F" />
            <path d="M1396 400 L1402 430 L1372 430 L1378 400 Z" fill="#2C42B4" />
            <path d="M1438 400 L1444 430 L1412 430 L1418 400 Z" fill="#E8B84B" />
            <rect x="1334" y="430" width="136" height="58" rx="6" fill="#A0714A" />
            <rect x="1334" y="430" width="136" height="10" rx="5" fill="#B98354" />
            <rect x="1334" y="452" width="136" height="7" fill="#8A5F3C" opacity="0.6" />
          </g>
          <circle cx="1364" cy="496" r="19" fill="#E8B84B" />
          <circle cx="1364" cy="496" r="12" fill="#F5D68C" />
          <circle cx="1364" cy="496" r="5" fill="#FBF6EA" />
          <circle cx="1446" cy="496" r="19" fill="#2C42B4" />
          <circle cx="1446" cy="496" r="12" fill="#4A6FC8" />
          <circle cx="1446" cy="496" r="5" fill="#FBF6EA" />

          <rect x="1356" y="362" width="3.4" height="42" fill="#D8CDB6" />
          <g className="ks-pinwheel ks-pinwheel--a" style={{ transformOrigin: '1358px 362px' }}>
            <path d="M1358 362 L1358 338 L1378 347 Z" fill="#2C42B4" />
            <path d="M1358 362 L1382 362 L1373 382 Z" fill="#E8B84B" />
            <path d="M1358 362 L1358 386 L1338 377 Z" fill="#E07A5F" />
            <path d="M1358 362 L1334 362 L1343 342 Z" fill="#7FB3B3" />
            <circle cx="1358" cy="362" r="4" fill="#FBF6EA" />
          </g>
          <rect x="1410" y="372" width="3.4" height="32" fill="#D8CDB6" />
          <g className="ks-pinwheel ks-pinwheel--b" style={{ transformOrigin: '1412px 372px' }}>
            <path d="M1412 372 L1412 352 L1429 360 Z" fill="#E8B84B" />
            <path d="M1412 372 L1432 372 L1424 389 Z" fill="#2C42B4" />
            <path d="M1412 372 L1412 392 L1395 384 Z" fill="#7FB3B3" />
            <path d="M1412 372 L1392 372 L1400 355 Z" fill="#E07A5F" />
            <circle cx="1412" cy="372" r="3.4" fill="#FBF6EA" />
          </g>
        </g>

        {/* ---------------- people about the field ---------------- */}
        <Person x={1508} y={508} s={0.96} skin="#E8B48A" skinShade="#D19A70" hair="#5A4632" shirt={['#E8B84B', '#C08F28']} pants={['#7FB3B3', '#4E8686']} pose="point" flip />
        <Person x={1268} y={520} s={0.94} skin="#E8B48A" skinShade="#D19A70" hair="#2E2419" shirt={['#E07A5F', '#B85742']} pants={['#3A52BE', '#1B2E8C']} pose="walk" />
        <Person x={1310} y={526} s={0.88} skin="#C98D5E" skinShade="#AE754A" hair="#8A5F3C" shirt={['#4A6FC8', '#2C42B4']} pants={['#E8B84B', '#C08F28']} pose="walk" />
        <Person x={412} y={498} s={0.82} skin="#E8B48A" skinShade="#D19A70" hair="#5A4632" shirt={['#7FB3B3', '#4E8686']} pants={['#E07A5F', '#B85742']} pose="stand" />
        <Person x={448} y={504} s={0.7} skin="#C98D5E" skinShade="#AE754A" hair="#2E2419" shirt={['#E8B84B', '#C08F28']} pants={['#4A6FC8', '#2C42B4']} pose="point" />

        {/* ---------------- grass, flowers, foreground ---------------- */}
        <g className="ks-grass">
          {TUFTS.map((t, i) => (
            <path
              key={`tuft-${i}`}
              d={`M${t.x} ${t.y} q ${t.h * 0.4} -${t.h} ${t.h * 0.9} -${t.h * 1.25}`}
              stroke={t.dark ? '#4E7A4B' : '#6BA050'}
              strokeWidth={2.6}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
        <g>
          <circle cx="196" cy="556" r="7" fill="#FBF6EA" />
          <circle cx="196" cy="556" r="3" fill="#E8B84B" />
          <circle cx="1420" cy="566" r="7" fill="#FBF6EA" />
          <circle cx="1420" cy="566" r="3" fill="#E8B84B" />
          <circle cx="860" cy="592" r="6.5" fill="#E07A5F" />
          <circle cx="860" cy="592" r="2.6" fill="#FBF6EA" />
          <circle cx="360" cy="580" r="6.5" fill="#80AFFF" />
          <circle cx="360" cy="580" r="2.6" fill="#FBF6EA" />
          <circle cx="1180" cy="590" r="6" fill="#FBF6EA" />
          <circle cx="1180" cy="590" r="2.4" fill="#E8B84B" />
        </g>

        {/* out-of-focus blades right at the camera, for depth */}
        <g opacity="0.55">
          <path d="M40 600 q 10 -50 26 -70" stroke="#4E7A4B" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M120 600 q 6 -40 18 -56" stroke="#568A42" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M1512 600 q -8 -46 -24 -64" stroke="#4E7A4B" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M1584 600 q -6 -38 -18 -52" stroke="#568A42" strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>

        {/* ---------------- paper fibre over everything ---------------- */}
        <rect
          width={W}
          height={H}
          filter="url(#ks-grain)"
          opacity="0.13"
          style={{ mixBlendMode: 'multiply' }}
        />
      </svg>
    </div>
  );
}
