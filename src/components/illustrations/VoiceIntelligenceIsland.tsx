import './VoiceIntelligenceIsland.css';

// Paper-cut style island: an office, an airport check-in queue and a park
// scene sharing one small "world", with a pond spilling over the island's
// edge — together standing for the everyday places Voice Intelligence
// listens in.
export function VoiceIntelligenceIsland() {
  return (
    <div className="voice-island">
      <svg
        viewBox="0 0 480 360"
        className="voice-island-svg"
        role="img"
        aria-label="Illustration of an office, an airport check-in queue and a park sharing one small floating world, representing Voice Intelligence"
      >
        <defs>
          <filter id="vi-soft-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#12123a" floodOpacity="0.16" />
          </filter>
          <filter id="vi-tiny-shadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#12123a" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* ground contact shadow */}
        <ellipse cx="240" cy="300" rx="150" ry="16" fill="#12123a" opacity="0.08" />

        {/* waterfall spilling off the left edge, behind the island */}
        <g className="vi-waterfall">
          <path d="M60 196 C 54 226, 50 250, 46 284 C 44 296, 60 296, 62 284 C 66 250, 68 226, 74 198 Z" fill="#9FCBEA" />
          <path d="M60 196 C 56 222, 53 248, 49 278 C 48 288, 57 288, 58 278 C 61 248, 64 222, 68 198 Z" fill="#CDE9F7" opacity="0.8" />
          <circle cx="52" cy="300" r="3.4" fill="#9FCBEA" />
          <circle cx="66" cy="308" r="2.6" fill="#9FCBEA" />
          <circle cx="58" cy="314" r="2" fill="#CDE9F7" />
        </g>

        {/* island edge (paper thickness) */}
        <ellipse cx="240" cy="196" rx="212" ry="78" fill="#E9C97D" />
        {/* island top */}
        <ellipse cx="240" cy="184" rx="212" ry="78" fill="#FFF3D9" filter="url(#vi-soft-shadow)" />

        {/* zone tints */}
        <ellipse cx="118" cy="176" rx="78" ry="40" fill="#DCEFC9" opacity="0.9" />
        <ellipse cx="248" cy="164" rx="72" ry="38" fill="#E4E9FB" opacity="0.9" />
        <ellipse cx="372" cy="178" rx="80" ry="40" fill="#FCE3DD" opacity="0.85" />

        {/* ---------------- PARK (left) ---------------- */}
        <g className="vi-scene">
          {/* tree */}
          <rect x="72" y="140" width="6" height="20" rx="2" fill="#B98354" />
          <circle cx="75" cy="130" r="16" fill="#8FBF6B" />
          <circle cx="63" cy="138" r="11" fill="#A3CD82" />
          <circle cx="88" cy="138" r="11" fill="#A3CD82" />

          {/* pond + bridge */}
          <ellipse cx="108" cy="182" rx="30" ry="12" fill="#BFE3F0" />
          <ellipse cx="112" cy="184" rx="18" ry="6" fill="#DBF1F8" />
          <path d="M92 176 Q108 162 124 176" fill="none" stroke="#B98354" strokeWidth="3.5" strokeLinecap="round" />

          {/* bench with two figures */}
          <ellipse cx="168" cy="205" rx="26" ry="4" fill="#12123a" opacity="0.1" />
          <rect x="146" y="188" width="44" height="6" rx="2" fill="#B98354" />
          <rect x="150" y="176" width="4" height="12" fill="#B98354" />
          <rect x="182" y="176" width="4" height="12" fill="#B98354" />

          <g>
            <circle cx="158" cy="172" r="7" fill="#F0B27A" />
            <path d="M150 190 Q158 176 166 190 Z" fill="#F37A65" />
          </g>
          <g>
            <circle cx="176" cy="170" r="7" fill="#E6A968" />
            <path d="M168 188 Q176 174 184 188 Z" fill="#1C2FB0" />
          </g>
        </g>

        {/* ---------------- OFFICE (middle) ---------------- */}
        <g className="vi-scene">
          {/* plant */}
          <rect x="206" y="160" width="10" height="10" rx="2" fill="#B98354" />
          <circle cx="211" cy="150" r="10" fill="#8FBF6B" />

          {/* desk */}
          <ellipse cx="252" cy="192" rx="34" ry="5" fill="#12123a" opacity="0.1" />
          <rect x="228" y="168" width="48" height="8" rx="2.5" fill="#80AFFF" />
          <rect x="234" y="176" width="6" height="14" fill="#5D8CDB" />
          <rect x="264" y="176" width="6" height="14" fill="#5D8CDB" />

          {/* monitor with mic/soundwave */}
          <rect x="236" y="140" width="32" height="24" rx="4" fill="#1C2FB0" />
          <rect x="240" y="144" width="24" height="16" rx="2" fill="#E4E9FB" />
          <circle cx="248" cy="152" r="3.2" fill="#1C2FB0" />
          <g className="vi-soundwave">
            <rect className="vi-bar vi-bar-1" x="253" y="149" width="2" height="6" rx="1" fill="#1C2FB0" />
            <rect className="vi-bar vi-bar-2" x="257" y="147" width="2" height="10" rx="1" fill="#1C2FB0" />
            <rect className="vi-bar vi-bar-3" x="261" y="150" width="2" height="4" rx="1" fill="#1C2FB0" />
          </g>

          {/* seated figure */}
          <circle cx="252" cy="126" r="8" fill="#E6A968" />
          <path d="M242 146 Q252 128 262 146 Z" fill="#80AFFF" />
        </g>

        {/* floating speech bubble above the office, the "voice" signal */}
        <g className="vi-bubble" filter="url(#vi-tiny-shadow)">
          <path
            d="M204 96 h56 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-30 l-10 10 v-10 h-16 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8 Z"
            fill="#FFFFFF"
          />
          <g className="vi-soundwave">
            <rect className="vi-bar vi-bar-2" x="216" y="106" width="4" height="14" rx="2" fill="#1C2FB0" />
            <rect className="vi-bar vi-bar-3" x="226" y="102" width="4" height="22" rx="2" fill="#F37A65" />
            <rect className="vi-bar vi-bar-1" x="236" y="108" width="4" height="10" rx="2" fill="#1C2FB0" />
            <rect className="vi-bar vi-bar-2" x="246" y="104" width="4" height="18" rx="2" fill="#80AFFF" />
          </g>
        </g>

        {/* ---------------- CHECK-IN (right) ---------------- */}
        <g className="vi-scene">
          {/* gate poles + flag */}
          <rect x="416" y="118" width="3" height="34" fill="#B98354" />
          <rect x="436" y="122" width="3" height="30" fill="#B98354" />
          <path d="M419 122 L432 126 L419 130 Z" fill="#F37A65" />

          {/* small plane */}
          <g className="vi-plane">
            <path
              d="M356 118 l26 6 l10 -3 l4 3 l-4 4 l-10 -1 l-22 9 l-8 -2 l10 -8 l-8 -3 z"
              fill="#1C2FB0"
            />
          </g>

          {/* counter */}
          <ellipse cx="366" cy="214" rx="40" ry="5" fill="#12123a" opacity="0.1" />
          <rect x="336" y="188" width="60" height="22" rx="3" fill="#1C2FB0" />
          <rect x="336" y="184" width="60" height="8" rx="3" fill="#80AFFF" />

          {/* person behind counter */}
          <circle cx="348" cy="176" r="7" fill="#F0B27A" />
          <path d="M340 190 Q348 178 356 190 Z" fill="#FFF3D9" />

          {/* queue of three */}
          <g>
            <circle cx="404" cy="182" r="6.5" fill="#E6A968" />
            <path d="M397 198 Q404 184 411 198 Z" fill="#F37A65" />
          </g>
          <g>
            <circle cx="420" cy="184" r="6.5" fill="#F0B27A" />
            <path d="M413 200 Q420 186 427 200 Z" fill="#80AFFF" />
          </g>
          <g>
            <circle cx="436" cy="182" r="6.5" fill="#E6A968" />
            <path d="M429 198 Q436 184 443 198 Z" fill="#1C2FB0" />
          </g>
        </g>

        {/* ambient clouds */}
        <g className="vi-cloud vi-cloud-a" opacity="0.8">
          <ellipse cx="70" cy="60" rx="20" ry="9" fill="#FFFFFF" />
          <ellipse cx="86" cy="56" rx="14" ry="8" fill="#FFFFFF" />
        </g>
        <g className="vi-cloud vi-cloud-b" opacity="0.7">
          <ellipse cx="410" cy="76" rx="18" ry="8" fill="#FFFFFF" />
          <ellipse cx="424" cy="72" rx="12" ry="7" fill="#FFFFFF" />
        </g>

        {/* brand accent cube */}
        <g transform="translate(90,236)">
          <path d="M0 6 L10 0 L20 6 L10 12 Z" fill="#FFB27A" />
          <path d="M0 6 L10 12 L10 22 L0 16 Z" fill="#F37A65" />
          <path d="M20 6 L10 12 L10 22 L20 16 Z" fill="#E0654F" />
        </g>
      </svg>
    </div>
  );
}
