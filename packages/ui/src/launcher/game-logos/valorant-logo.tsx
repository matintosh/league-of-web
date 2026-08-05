/**
 * ValorantLogo — VALORANT logo variants (white / branded, inline).
 *
 * Two variants:
 *   "wordmark" (default) — V slash marks + VALORANT text lockup; used on tiles.
 *   "emblem"             — compact V chevron-only; used in the launcher rail.
 *
 * currentColor fill for the wordmark variant.
 * "emblem" uses the brand crimson (#FF4655) as a documented brand-color
 * exception per the Launcher constraints (brand emblem SVGs may carry brand
 * color; see CLAUDE.md). SVG ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface ValorantLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  /** "wordmark" = full V+text lockup; "emblem" = compact red V mark. */
  variant?: "wordmark" | "emblem";
  className?: string;
}

/** Compact V chevron emblem — Valorant brand crimson (#FF4655). */
function ValorantEmblem({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VALORANT"
      className={className}
    >
      {/* Valorant-style V — two overlapping angular strokes */}
      <path
        d="M8 8 L20 32 L32 8"
        stroke="#FF4655"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* Left diagonal slash accent */}
      <line x1="6" y1="6" x2="14" y2="22" stroke="#FF4655" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ValorantLogo({ size = 80, variant = "wordmark", className }: ValorantLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  if (variant === "emblem") {
    return <ValorantEmblem size={size} className={className} />;
  }

  const height = Math.round(size * 0.35);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 200 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VALORANT"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="200" height="70" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill="currentColor">
        {/* V slash mark */}
        <polygon points="0,0 16,0 8,20 0,20" opacity="0.95" />
        <polygon points="10,0 26,0 18,20 2,20" opacity="0.6" />
        {/* VALORANT wordmark */}
        <text
          x="30"
          y="52"
          fontSize="36"
          fontWeight="900"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="4"
          fill="currentColor"
        >
          VALORANT
        </text>
      </g>
    </svg>
  );
}
