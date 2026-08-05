/**
 * ValorantLogo — VALORANT wordmark SVG (white, inline).
 *
 * Recreated from the ref screenshot (image-7.png). currentColor fill.
 * SVG ids via useId() to avoid render collisions.
 */

import { useId } from "react";

export interface ValorantLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  className?: string;
}

export function ValorantLogo({ size = 80, className }: ValorantLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;
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
