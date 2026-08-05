/**
 * TwoXkoLogo — 2XKO wordmark SVG (white, inline).
 *
 * Recreated from the ref screenshot (image-7.png). currentColor fill.
 * SVG ids via useId() to avoid render collisions.
 */

import { useId } from "react";

export interface TwoXkoLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  className?: string;
}

export function TwoXkoLogo({ size = 80, className }: TwoXkoLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;
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
