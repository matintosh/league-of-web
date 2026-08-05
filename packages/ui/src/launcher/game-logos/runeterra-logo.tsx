/**
 * RuneterraLogo — Legends of Runeterra compact emblem SVG (white, inline).
 *
 * Compact emblem only — used in the launcher rail. Renders a stylised map/compass
 * rose mark that evokes the Runeterra crest. currentColor fill, no hardcoded hex.
 * SVG ids via useId() to avoid collisions.
 */

import { useId } from "react";

export interface RuneterraLogoProps {
  /** Rendered width in px. Square. Default 32. */
  size?: number;
  className?: string;
}

export function RuneterraLogo({ size = 32, className }: RuneterraLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Legends of Runeterra"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="40" height="40" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* Outer circle border */}
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
        {/* Compass cross */}
        <line x1="20" y1="5" x2="20" y2="35" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        {/* North arrow point */}
        <polygon points="20,5 23,13 17,13" fill="currentColor" opacity="0.9" />
        {/* Center diamond */}
        <polygon points="20,15 24,20 20,25 16,20" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  );
}
