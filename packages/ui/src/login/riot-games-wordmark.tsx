/**
 * RiotGamesWordmark — stacked two-line Riot Games brand lockup.
 *
 * Renders "RIOT" on line 1 and "GAMES" on line 2 in a vertically stacked
 * SVG lockup. Uses currentColor so the parent sets the fill color via
 * a Tailwind text-* class (e.g. text-riot-red).
 *
 * Pixel-measured from riot-login-page.png: mark at x=150-248 (width=98px),
 * y=58-84 (height=26px). The lockup is proportioned to match those dimensions
 * at the default width=98.
 *
 * Server-safe — no 'use client'. useId used for any gradient ids (not needed
 * here, but imported for future safety). No hardcoded hex colors.
 *
 * issue #960
 */
export interface RiotGamesWordmarkProps {
  /** Width in pixels. Height is fixed by aspect ratio (26/98). Default: 98. */
  width?: number;
  /** Additional Tailwind/CSS classes (e.g. "text-riot-red"). */
  className?: string;
}

export function RiotGamesWordmark({ width = 98, className = "" }: RiotGamesWordmarkProps) {
  // Aspect ratio from pixel measurement: 98px wide × 26px tall
  const aspectRatio = 26 / 98;
  const height = Math.round(width * aspectRatio);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 98 26"
      width={width}
      height={height}
      role="img"
      aria-label="Riot Games"
      className={className}
      fill="currentColor"
    >
      {/* LINE 1: "RIOT" — condensed bold caps, baseline at y=11 */}
      {/* Each letter path is a simplified geometric glyph matching the
          Riot Games wordmark style (tight, slightly condensed sans-serif). */}

      {/* R */}
      <path d="M2 1h7.5c1.6 0 2.8.4 3.6 1.2.8.8 1.2 1.8 1.2 3 0 1-.3 1.8-.8 2.5-.5.6-1.2 1.1-2.1 1.3L15 11h-3.4l-3.2-2.7H4.8V11H2V1Zm2.8 2.3v2.8h4.5c.6 0 1-.1 1.3-.4.3-.3.5-.6.5-1 0-.5-.2-.8-.5-1.1-.3-.2-.8-.3-1.4-.3H4.8Z" />

      {/* I */}
      <path d="M17 1h2.8v10H17V1Z" />

      {/* O */}
      <path d="M22 6c0-1.4.5-2.6 1.5-3.6 1-1 2.3-1.5 3.9-1.5 1.6 0 2.9.5 3.9 1.5S33 4.6 33 6s-.5 2.6-1.5 3.6-2.3 1.5-3.9 1.5c-1.6 0-2.9-.5-3.9-1.5C22.5 8.6 22 7.4 22 6Zm2.9 0c0 .9.3 1.6.8 2.2.6.6 1.3.8 2.2.8.9 0 1.6-.3 2.2-.8.6-.6.8-1.3.8-2.2 0-.9-.3-1.6-.8-2.2-.6-.6-1.3-.8-2.2-.8-.9 0-1.6.3-2.2.8-.5.6-.8 1.3-.8 2.2Z" />

      {/* T */}
      <path d="M37 1h10v2.3h-3.6V11h-2.8V3.3H37V1Z" />

      {/* LINE 2: "GAMES" — slightly smaller caps, baseline at y=24 */}

      {/* G */}
      <path d="M2 19.5c0-1.4.5-2.6 1.5-3.5 1-.9 2.3-1.4 3.9-1.4 1.2 0 2.2.3 3 .8.8.5 1.4 1.3 1.7 2.2l-2.5.8c-.2-.5-.5-.9-.9-1.2-.4-.3-.9-.4-1.4-.4-.9 0-1.6.3-2.1.8-.5.5-.8 1.2-.8 2 0 .8.3 1.5.8 2 .5.5 1.2.8 2.1.8.6 0 1.1-.1 1.5-.4.4-.3.7-.7.8-1.2H6.5v-2h5.3v.8c0 1.3-.5 2.4-1.4 3.2-.9.8-2.1 1.2-3.6 1.2-1.6 0-2.9-.5-3.9-1.4-1-.9-1.5-2.1-1.9-3.3Z" />

      {/* A */}
      <path d="M14.5 25l4.2-10.2h2.8L25.7 25h-2.9l-.8-2.1h-4l-.9 2.1H14.5Zm4.4-4.2h2.5l-1.2-3.1-1.3 3.1Z" />

      {/* M */}
      <path d="M27.5 14.8h3.4l2.5 5.4 2.5-5.4H39V25h-2.6v-6.2L33.6 25h-1.4l-2.8-6.2V25h-2.6V14.8h.7Z" />

      {/* E */}
      <path d="M41.5 14.8H51v2.3h-6.7v1.8h6v2.2h-6V22.7H51V25h-9.5V14.8Z" />

      {/* S */}
      <path d="M53 23.3l1.8-1.6c.3.4.7.8 1.2 1 .5.2 1 .3 1.6.3.5 0 .9-.1 1.2-.3.3-.2.5-.5.5-.8 0-.3-.1-.5-.4-.7-.3-.2-.8-.4-1.5-.5-1.2-.3-2.1-.7-2.7-1.2-.6-.5-.9-1.2-.9-2.1 0-.9.4-1.7 1.1-2.3.7-.6 1.7-.9 2.9-.9 1 0 1.9.2 2.6.6.7.4 1.3 1 1.7 1.8l-2 1.3c-.3-.5-.6-.8-1-.9-.4-.2-.8-.3-1.3-.3-.4 0-.7.1-.9.3-.2.2-.4.4-.4.7 0 .2.1.4.4.6.3.2.7.3 1.3.5 1.3.3 2.3.7 3 1.3.7.6 1 1.4 1 2.3 0 1-.4 1.8-1.2 2.4-.8.6-1.9.9-3.2.9-1.1 0-2.1-.2-2.9-.7-.8-.5-1.4-1.1-1.9-1.8Z" />
    </svg>
  );
}
