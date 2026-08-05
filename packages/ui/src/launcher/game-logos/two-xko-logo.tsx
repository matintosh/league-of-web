/**
 * TwoXkoLogo — 2XKO logo variants (white / branded, inline).
 *
 * Two variants:
 *   "wordmark" (default) — "2XKO" text lockup; used on game tiles.
 *   "emblem"             — compact fist-crest mark with green badge; rail.
 *
 * For the emblem variant, the green badge (#3fd174) is a documented brand-color
 * exception per Launcher constraints (brand emblem SVGs may carry brand color).
 * SVG ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface TwoXkoLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  /** "wordmark" = full 2XKO text lockup; "emblem" = compact crest + badge. */
  variant?: "wordmark" | "emblem";
  className?: string;
}

/** Compact 2XKO crest emblem with green corner badge (brand colors documented exception). */
function TwoXkoEmblem({ size, uid, className }: { size: number; uid: string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="2XKO"
      className={className}
    >
      {/* Outer rounded-square crest */}
      <rect x="3" y="3" width="34" height="34" rx="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      {/* "2" numeral — large, centred */}
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
        fill="currentColor"
      >
        2
      </text>
      {/* Green "XKO" badge — top-right corner. Brand green (#3fd174) documented exception */}
      <circle cx="31" cy="10" r="7" fill="#3fd174" />
      <text
        x="31"
        y="13.5"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="900"
        fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
        fill="#000"
      >
        XKO
      </text>
    </svg>
  );
}

export function TwoXkoLogo({ size = 80, variant = "wordmark", className }: TwoXkoLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  if (variant === "emblem") {
    return <TwoXkoEmblem size={size} uid={uid} className={className} />;
  }

  const height = Math.round(size * 0.45);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 120 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="2XKO"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="120" height="54" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill="currentColor">
        {/* 2XKO wordmark */}
        <text
          x="0"
          y="44"
          fontSize="48"
          fontWeight="900"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="1"
          fill="currentColor"
        >
          2XKO
        </text>
      </g>
    </svg>
  );
}
