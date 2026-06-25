
const R = "var(--brand-red)"; // oklch(0.60 0.25 25.0)
const R_HEX = "#e02020"; // approximate hex for inline SVG
const CARD_BG = "rgba(255,255,255,0.04)";


export const NinjaIllustration = () => (
  <svg
    viewBox="0 0 320 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[300px] mx-auto drop-shadow-2xl"
    aria-hidden="true"
  >
    {/* Glow orb behind ninja */}
    <ellipse
      cx="160"
      cy="210"
      rx="100"
      ry="100"
      fill={R_HEX}
      fillOpacity="0.12"
    />
    <ellipse
      cx="160"
      cy="210"
      rx="70"
      ry="70"
      fill={R_HEX}
      fillOpacity="0.10"
    />

    {/* Red circle background */}
    <circle cx="160" cy="210" r="58" fill={R_HEX} fillOpacity="0.25" />
    <circle
      cx="160"
      cy="210"
      r="52"
      fill={R_HEX}
      fillOpacity="0.15"
      stroke={R_HEX}
      strokeWidth="1.5"
      strokeOpacity="0.4"
    />

    {/* ── Body ── */}
    <ellipse cx="160" cy="240" rx="32" ry="40" fill="#1a1a1a" />
    {/* Belt */}
    <rect
      x="130"
      y="248"
      width="60"
      height="10"
      rx="5"
      fill={R_HEX}
      fillOpacity="0.9"
    />

    {/* ── Head ── */}
    <circle cx="160" cy="185" r="30" fill="#1a1a1a" />
    {/* Mask cloth */}
    <path
      d="M133 190 Q160 178 187 190 L187 205 Q160 198 133 205 Z"
      fill="#111"
    />
    {/* Red headband */}
    <rect x="130" y="178" width="60" height="10" rx="5" fill={R_HEX} />
    {/* Headband knot tails */}
    <path
      d="M188 183 L202 172 M188 185 L200 196"
      stroke={R_HEX}
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Eyes — fierce squint */}
    <path
      d="M145 187 L155 184"
      stroke="#e2e8f0"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M165 184 L175 187"
      stroke="#e2e8f0"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* ── Left arm raised (holding brush/pen) ── */}
    <line
      x1="132"
      y1="225"
      x2="96"
      y2="175"
      stroke="#1a1a1a"
      strokeWidth="14"
      strokeLinecap="round"
    />
    {/* Hand */}
    <circle cx="93" cy="172" r="9" fill="#2a2a2a" />
    {/* Brush / pen tool */}
    <line
      x1="93"
      y1="163"
      x2="82"
      y2="138"
      stroke="#e2e8f0"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="80" cy="135" r="5" fill={R_HEX} />
    <line
      x1="80"
      y1="130"
      x2="76"
      y2="120"
      stroke={R_HEX}
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* ── Right arm (holding katana/pen nib) ── */}
    <line
      x1="188"
      y1="225"
      x2="218"
      y2="180"
      stroke="#1a1a1a"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <circle cx="221" cy="177" r="9" fill="#2a2a2a" />
    {/* Nib */}
    <path d="M226 173 L240 155 L228 165 Z" fill="#94a3b8" />
    <line
      x1="233"
      y1="164"
      x2="244"
      y2="148"
      stroke="#94a3b8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* ── Legs / scarf flowing ── */}
    <path
      d="M145 275 Q135 300 128 325"
      stroke="#111"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M175 275 Q182 300 188 325"
      stroke="#111"
      strokeWidth="12"
      strokeLinecap="round"
    />
    {/* Scarf */}
    <path
      d="M155 250 Q140 265 130 280 Q120 295 125 310"
      stroke="#333"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M165 250 Q155 268 148 285"
      stroke="#222"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />

    {/* ── Left curly bracket { ── */}
    <path
      d="M60 100 Q46 100 46 116 L46 178 Q46 192 32 198 Q46 204 46 218 L46 280 Q46 296 60 296"
      stroke={R_HEX}
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* ── Right curly bracket } ── */}
    <path
      d="M260 100 Q274 100 274 116 L274 178 Q274 192 288 198 Q274 204 274 218 L274 280 Q274 296 260 296"
      stroke={R_HEX}
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* ── "AlgoNinja" text at bottom ── */}
    <text
      x="160"
      y="348"
      textAnchor="middle"
      fontSize="22"
      fontWeight="700"
      fill="#e2e8f0"
      style={{
        fontFamily: "'ARP Display', sans-serif",
        letterSpacing: "0.5px",
      }}
    >
      AlgoNinja
    </text>
    <text
      x="160"
      y="368"
      textAnchor="middle"
      fontSize="11"
      fill={R_HEX}
      style={{ fontFamily: "'Satoshi', sans-serif", letterSpacing: "3px" }}
    >
      CODE · SOLVE · CONQUER
    </text>
  </svg>
);