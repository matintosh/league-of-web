/**
 * RiotShieldLogo — Riot Games "R" shield compact emblem SVG (white, inline).
 *
 * Renders a bold "R" letter centred in an angular shield outline.
 * Used as the bottom-pinned utility slot in the launcher rail.
 * currentColor fill, no hardcoded hex. SVG ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface RiotShieldLogoProps {
  /** Rendered width in px. Square. Default 32. */
  size?: number;
  className?: string;
}

export function RiotShieldLogo({ size = 32, className }: RiotShieldLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Riot Games"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="40" height="40" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* Shield outline — angular Riot-style */}
        <path
          d="M20 3 L36 9 L36 26 L20 38 L4 26 L4 9 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="currentColor"
          fillOpacity="0.12"
          strokeLinejoin="round"
        />
        {/* Bold "R" letterform */}
        <text
          x="20"
          y="28"
          textAnchor="middle"
          fontSize="20"
          fontWeight="900"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          fill="currentColor"
        >
          R
        </text>
      </g>
    </svg>
  );
}
