/**
 * WildRiftLogo — League of Legends Wild Rift logo variants (white / branded, inline).
 *
 * Two variants:
 *   "wordmark" (default) — "LEAGUE OF LEGENDS / WILD RIFT" text lockup; tiles.
 *   "emblem"             — compact golden crescent/rift mark; launcher rail.
 *
 * currentColor fill. SVG ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface WildRiftLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  /** "wordmark" = full text lockup; "emblem" = compact crescent mark. */
  variant?: "wordmark" | "emblem";
  className?: string;
}

/** Compact Wild Rift crescent/arc emblem. */
function WildRiftEmblem({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="League of Legends: Wild Rift"
      className={className}
    >
      {/* Circular base */}
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Crescent arc — inner arc offset to form crescent shape */}
      <path
        d="M12 14 Q20 6 28 14 Q20 22 12 14Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Bottom speed-line / rift */}
      <path
        d="M10 26 Q20 30 30 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

export function WildRiftLogo({ size = 80, variant = "wordmark", className }: WildRiftLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  if (variant === "emblem") {
    return <WildRiftEmblem size={size} className={className} />;
  }

  const height = Math.round(size * 0.55);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 160 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="League of Legends Wild Rift"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="160" height="88" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill="currentColor">
        {/* LEAGUE OF LEGENDS */}
        <text
          x="0"
          y="26"
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="2"
          fill="currentColor"
        >
          LEAGUE OF LEGENDS
        </text>
        {/* WILD RIFT large */}
        <text
          x="0"
          y="68"
          fontSize="38"
          fontWeight="900"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="1"
          fill="currentColor"
        >
          WILD RIFT
        </text>
      </g>
    </svg>
  );
}
