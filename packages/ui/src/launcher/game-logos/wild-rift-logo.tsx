/**
 * WildRiftLogo — League of Legends Wild Rift wordmark SVG (white, inline).
 *
 * Recreated from the ref screenshot (image-7.png). currentColor fill.
 * SVG ids via useId() to avoid render collisions.
 */

import { useId } from "react";

export interface WildRiftLogoProps {
  /** Rendered width in px. Height scales proportionally. Default 80. */
  size?: number;
  className?: string;
}

export function WildRiftLogo({ size = 80, className }: WildRiftLogoProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;
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
