/**
 * LolLogo — League of Legends logo variants (white, inline).
 *
 * Two variants:
 *   "wordmark" (default) — heraldic crest + "LEAGUE / OF LEGENDS" lockup,
 *                          ~2.4:1 aspect ratio; used on the Games tiles.
 *   "emblem"             — compact square crest-only "L" badge; used in the
 *                          launcher rail slots where width is constrained.
 *
 * currentColor fill so it works on any dark background. No hardcoded hex.
 * SVG gradient/clip ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface LolLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  /** "wordmark" = full crest+text lockup; "emblem" = compact square crest. */
  variant?: "wordmark" | "emblem";
  className?: string;
}

/** Aspect ratio of the LoL crest + wordmark lockup: ~2.4 : 1 */
const WORDMARK_ASPECT = 2.4;

/** Compact square "L" crest emblem — fits the 64px rail slot at size=32. */
function LolEmblem({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="League of Legends"
      className={className}
    >
      {/* Outer shield border */}
      <path
        d="M20 3 L37 10 L37 30 L20 38 L3 30 L3 10 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Inner "L" letterform — bold serif-style */}
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
        fill="currentColor"
      >
        L
      </text>
    </svg>
  );
}

export function LolLogo({ size = 80, variant = "wordmark", className }: LolLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  if (variant === "emblem") {
    return <LolEmblem size={size} className={className} />;
  }

  const height = Math.round(size / WORDMARK_ASPECT);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="League of Legends"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="240" height="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill="currentColor">
        {/* Crest shield outline */}
        <path d="M20 10 L40 10 L40 55 L30 65 L20 55 Z" opacity="0.9" />
        {/* Inner crest detail */}
        <path d="M24 16 L36 16 L36 52 L30 60 L24 52 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        {/* "LEAGUE" text */}
        <text
          x="52"
          y="38"
          fontSize="18"
          fontWeight="700"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="3"
          fill="currentColor"
        >
          LEAGUE
        </text>
        {/* "OF LEGENDS" text */}
        <text
          x="52"
          y="62"
          fontSize="18"
          fontWeight="700"
          fontFamily="var(--font-launcher, Inter, system-ui, sans-serif)"
          letterSpacing="3"
          fill="currentColor"
        >
          OF LEGENDS
        </text>
      </g>
    </svg>
  );
}
