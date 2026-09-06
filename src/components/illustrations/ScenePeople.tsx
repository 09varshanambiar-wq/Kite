/*
 * The people in the hero scene.
 *
 * One parameterised figure keeps proportion and shading consistent
 * across the whole crowd — the reference's people all share a build,
 * and hand-drawing each one loses that. Every figure is lit from the
 * upper left to match the faceted forms around them: the left of each
 * body is the lit tone, the right the shade tone.
 */

export interface PersonProps {
  x: number;
  y: number;
  /** 1 = roughly 86 units tall. */
  s?: number;
  skin: string;
  skinShade: string;
  hair: string;
  /** [lit, shade] */
  shirt: [string, string];
  pants: [string, string];
  pose?: 'stand' | 'sit' | 'run' | 'point' | 'walk';
  flip?: boolean;
  className?: string;
}

export function Person({
  x,
  y,
  s = 1,
  skin,
  skinShade,
  hair,
  shirt,
  pants,
  pose = 'stand',
  flip = false,
  className,
}: PersonProps) {
  const [shirtLit, shirtShade] = shirt;
  const [pantsLit, pantsShade] = pants;

  const head = (cy: number) => (
    <g>
      <circle cx="0" cy={cy} r="11.5" fill={skin} />
      <path
        d={`M4 ${cy - 10.8} a 11.5 11.5 0 0 1 0 21.6 a 11.5 11.5 0 0 0 0 -21.6 Z`}
        fill={skinShade}
      />
      {/* hair sits as a folded cap, with a darker underside */}
      <path
        d={`M-11.5 ${cy - 1} a 11.5 11.5 0 0 1 23 0 q -11.5 -7 -23 0 Z`}
        fill={hair}
      />
      <path d={`M6 ${cy - 9.4} a 11.5 11.5 0 0 1 5.5 8.4 q -4 -2.4 -8 -3.4 Z`} fill={hair} opacity="0.75" />
    </g>
  );

  let body: React.ReactNode;

  if (pose === 'sit') {
    body = (
      <g>
        {/* thigh forward, shin folded down */}
        <path d="M-2 -8 L20 -6" stroke={pantsShade} strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M20 -6 L24 4" stroke={pantsLit} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-11 -40 L11 -40 L13 -6 L-13 -6 Z" fill={shirtLit} />
        <path d="M3 -40 L11 -40 L13 -6 L5 -6 Z" fill={shirtShade} />
        <path d="M9 -34 L20 -18" stroke={skin} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        <path d="M-9 -34 L-16 -20" stroke={skinShade} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        {head(-52)}
      </g>
    );
  } else if (pose === 'run') {
    body = (
      <g>
        <path d="M-4 -30 L-16 -4" stroke={pantsShade} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M6 -30 L18 -12" stroke={pantsLit} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-17 -3 L-23 -2" stroke="#3A2E22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M19 -11 L25 -8" stroke="#3A2E22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-11 -64 L11 -64 L13 -28 L-13 -28 Z" fill={shirtLit} />
        <path d="M3 -64 L11 -64 L13 -28 L5 -28 Z" fill={shirtShade} />
        {/* one arm up the kite line, one swinging back */}
        <path d="M9 -58 L22 -76" stroke={skin} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        <path d="M-10 -58 L-21 -44" stroke={skinShade} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        {head(-76)}
      </g>
    );
  } else if (pose === 'point') {
    body = (
      <g>
        <path d="M-6 -30 L-7 -3" stroke={pantsShade} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M6 -30 L8 -3" stroke={pantsLit} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-11 -64 L11 -64 L13 -28 L-13 -28 Z" fill={shirtLit} />
        <path d="M3 -64 L11 -64 L13 -28 L5 -28 Z" fill={shirtShade} />
        <path d="M10 -58 L24 -70" stroke={skin} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        <path d="M-10 -58 L-14 -38" stroke={skinShade} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        {head(-76)}
      </g>
    );
  } else if (pose === 'walk') {
    body = (
      <g>
        <path d="M-5 -30 L-11 -3" stroke={pantsShade} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M6 -30 L11 -3" stroke={pantsLit} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-12 -2 L-17 -1" stroke="#3A2E22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M12 -2 L17 -1" stroke="#3A2E22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-11 -64 L11 -64 L13 -28 L-13 -28 Z" fill={shirtLit} />
        <path d="M3 -64 L11 -64 L13 -28 L5 -28 Z" fill={shirtShade} />
        <path d="M10 -58 L15 -40" stroke={skin} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        <path d="M-10 -58 L-15 -40" stroke={skinShade} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        {head(-76)}
      </g>
    );
  } else {
    body = (
      <g>
        <path d="M-6 -30 L-7 -3" stroke={pantsShade} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M6 -30 L8 -3" stroke={pantsLit} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-8 -2 L-13 -1" stroke="#3A2E22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M9 -2 L14 -1" stroke="#3A2E22" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-11 -64 L11 -64 L13 -28 L-13 -28 Z" fill={shirtLit} />
        <path d="M3 -64 L11 -64 L13 -28 L5 -28 Z" fill={shirtShade} />
        <path d="M11 -58 L16 -36" stroke={skin} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        <path d="M-11 -58 L-16 -36" stroke={skinShade} strokeWidth="7.5" strokeLinecap="round" fill="none" />
        {head(-76)}
      </g>
    );
  }

  /* The positioning transform and the animation class must live on
     different nodes: a CSS transform on the same element would
     override this transform attribute outright and snap the figure
     back to the origin. */
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="2" rx="17" ry="4.5" fill="#2F4A2A" opacity="0.17" />
      <g className={className}>{body}</g>
    </g>
  );
}
