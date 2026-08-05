/**
 * TftLogo — Teamfight Tactics wordmark SVG (white, inline).
 *
 * Recreated from the ref screenshot (image-7.png). currentColor fill.
 * SVG ids via useId() to avoid render collisions.
 */

import { useId } from "react";

export interface TftLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  className?: string;
}

export function TftLogo({ size = 80, className }: TftLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;
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
