/**
 * TftLogo — Teamfight Tactics logo variants (white / branded, inline).
 *
 * Two variants:
 *   "wordmark" (default) — "TFT" acronym + subtitle; used on game tiles.
 *   "emblem"             — compact TFT diamond mark; used in the launcher rail.
 *
 * currentColor fill. SVG ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface TftLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  /** "wordmark" = full TFT+subtitle; "emblem" = compact diamond TFT mark. */
  variant?: "wordmark" | "emblem";
  className?: string;
}

/** Compact TFT diamond emblem — orange/gold T mark. */
function TftEmblem({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Teamfight Tactics"
      className={className}
    >
      {/* Outer diamond/octagon shape */}
      <polygon
        points="20,3 37,12 37,28 20,37 3,28 3,12"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.15"
        opacity="0.9"
      />
      {/* Bold T letterform */}
      <text
        x="20"
        y="29"
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
        fill="currentColor"
      >
        T
      </text>
    </svg>
  );
}

export function TftLogo({ size = 80, variant = "wordmark", className }: TftLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  if (variant === "emblem") {
    return <TftEmblem size={size} className={className} />;
  }

  const height = Math.round(size * 0.55);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 120 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Teamfight Tactics"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="120" height="66" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill="currentColor">
        {/* TFT large acronym */}
        <text
          x="0"
          y="38"
          fontSize="38"
          fontWeight="900"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="2"
          fill="currentColor"
        >
          TFT
        </text>
        {/* Teamfight Tactics subtitle */}
        <text
          x="1"
          y="56"
          fontSize="10"
          fontWeight="600"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="1.5"
          fill="currentColor"
          opacity="0.85"
        >
          TEAMFIGHT TACTICS
        </text>
      </g>
    </svg>
  );
}
