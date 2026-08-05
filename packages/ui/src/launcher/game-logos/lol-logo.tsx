/**
 * LolLogo — League of Legends wordmark SVG (white, inline).
 *
 * Recreated from the ref screenshot (image-7.png). Rendered as currentColor /
 * white fill so it works on any dark background. No hardcoded hex.
 * SVG gradient/clip ids via useId() to avoid collisions when rendered multiple times.
 */

import { useId } from "react";

export interface LolLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  className?: string;
}

/** Aspect ratio of the LoL crest + wordmark lockup: ~2.4 : 1 */
const ASPECT = 2.4;

export function LolLogo({ size = 80, className }: LolLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;
  const height = Math.round(size / ASPECT);

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
