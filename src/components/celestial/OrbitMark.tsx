import type { JSX } from "react";

/**
 * OrbitMark (design.md §3.2) — decorative hero/empty-state orbit motif.
 * 320×320 SVG: three concentric rings (outer dashed), one emphasized gold
 * arc, two satellites (gold on r=120, 90s revolution · violet on r=150,
 * 140s) and the pearl "Source point" at center.
 *
 * Satellites are parked at 35° and 210° in the markup itself; rotation is
 * pure CSS on the <g>, so under the global reduced-motion override the
 * animation completes instantly and the satellites simply rest parked —
 * no JS needed. aria-hidden always.
 */

const C = 160; // center
const toXY = (r: number, deg: number): { x: number; y: number } => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C - r * Math.sin(rad) };
};

const SAT_GOLD = toXY(120, 35); // parked position, reduced-motion rest state
const SAT_VIOLET = toXY(150, 210);

export function OrbitMark({
  size = 320,
  className = "",
}: {
  size?: number;
  className?: string;
}): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Rings */}
      <circle cx={C} cy={C} r="90" stroke="var(--line-subtle)" strokeWidth="1" />
      <circle cx={C} cy={C} r="120" stroke="var(--line-subtle)" strokeWidth="1" />
      <circle
        cx={C}
        cy={C}
        r="150"
        stroke="var(--line-subtle)"
        strokeWidth="1"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />

      {/* One emphasized arc on the r=90 ring (gold, 1.5px) */}
      <path
        d="M 232.8 107.1 A 90 90 0 0 0 187.8 74.4"
        stroke="rgba(217,186,133,0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Satellites — rotating groups; parked angles are the markup default */}
      <g className="animate-orbit" style={{ transformOrigin: "160px 160px" }}>
        <circle cx={SAT_GOLD.x.toFixed(1)} cy={SAT_GOLD.y.toFixed(1)} r="2.5" fill="var(--gold)" />
      </g>
      <g className="animate-orbit-slow" style={{ transformOrigin: "160px 160px" }}>
        <circle
          cx={SAT_VIOLET.x.toFixed(1)}
          cy={SAT_VIOLET.y.toFixed(1)}
          r="2.5"
          fill="var(--violet)"
          opacity="0.8"
        />
      </g>

      {/* Source point */}
      <circle cx={C} cy={C} r="3" fill="var(--ink)" opacity="0.9" />
    </svg>
  );
}
