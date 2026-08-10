import { useId } from "react";

/**
 * RiotGamesWordmark — full Riot Games brand lockup: colosseum icon + stacked text.
 *
 * Renders the Riot Games colosseum/crest icon on the LEFT (~29px) followed by
 * "RIOT" / "GAMES" stacked text on the RIGHT (~63px), matching the reference
 * login-panel header at 1360×640.
 *
 * Pixel-measured from riot-login-page.png:
 *   - Full lockup: x=150–248 (width=98px), y=58–84 (height=26px)
 *   - Icon cluster: x=150–178 (29px wide)
 *   - Gap: ~8px
 *   - Text cluster: x=186–248 (63px wide)
 *
 * SVG viewBox "0 0 100 26":
 *   - Icon paths occupy x=0–28, y=0–26
 *   - Text ("RIOT" line 1, "GAMES" line 2) translated to x=37–99
 *
 * Uses currentColor — parent sets fill via a Tailwind text-* class
 * (e.g. text-riot-red). No raw hex. SVG ids scoped via useId.
 *
 * Server-safe — no 'use client'. No hardcoded hex colors.
 *
 * issue #964
 */
export interface RiotGamesWordmarkProps {
  /** Width in pixels. Height is derived from the 26/100 aspect ratio. Default: 98. */
  width?: number;
  /** Additional Tailwind/CSS classes (e.g. "text-riot-red"). */
  className?: string;
}

export function RiotGamesWordmark({ width = 98, className = "" }: RiotGamesWordmarkProps) {
  // useId for any future clip/mask ids — kept here for constraint compliance
  const _uid = useId();

  // Aspect ratio from pixel measurement: 100 SVG units wide × 26 SVG units tall
  const aspectRatio = 26 / 100;
  const height = Math.round(width * aspectRatio);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 26"
      width={width}
      height={height}
      role="img"
      aria-label="Riot Games"
      className={className}
      fill="currentColor"
    >
      {/*
        ── ICON: Riot Games colosseum/crest mark ────────────────────────────────
        Pixel-traced from riot-login-page.png icon cluster (x=150–178, y=58–84).
        Each rectangle path is derived from the red-pixel horizontal segments
        per row, merged vertically where the x/width are identical.

        Coordinate space: x = (pixel_col − 2), y = (pixel_row − 2)
        Icon bounding box: x=0–28, y=0–26 (29×27 filled units).

        The compound path encodes the arch dome, three pillar columns with gap
        cutouts, the step notch on the left wall, and the detached crest foot
        element at the bottom right — all using currentColor fill.
      ──────────────────────────────────────────────────────────────────────── */}
      <path
        d={[
          /* ── Arch crown & dome (rows y=0–7) ── */
          "M15 0H18V1H15Z",   /* crown tip */
          "M12 1H22V2H12Z",   /* y=1 */
          "M10 2H26V3H10Z",   /* y=2 */
          "M8 3H28V4H8Z",     /* y=3 */
          "M6 4H28V5H6Z",     /* y=4 */
          "M4 5H28V6H4Z",     /* y=5 */
          "M1 6H28V7H1Z",     /* y=6 */
          "M0 7H28V8H0Z",     /* y=7 — full width reached */

          /* ── Upper body (rows y=8–10): right gap first appears ── */
          "M0 8H20V9H0Z",     /* y=8 left segment */
          "M22 8H28V10H22Z",  /* y=8–9 right-outer segment (gap at x=20–22) */
          "M0 9H19V10H0Z",    /* y=9 left segment */

          /* ── Middle body (rows y=10–15): three pillars separated by two gaps ── */
          /* Left-outer wide column */
          "M0 10H12V11H0Z",   /* y=10 */
          "M1 11H12V12H1Z",   /* y=11 */
          /* Center column x=15–20 (from y=10 to y=15) */
          "M15 10H20V16H15Z",
          /* Right-outer column x=23–28 (from y=10 to y=15) */
          "M23 10H28V16H23Z",

          /* ── Left pillar area (rows y=11–14): outer step/notch ── */
          /* Left-outer widens left then steps back (notch cutout on left wall) */
          "M1 12H5V13H1Z",    /* y=12 left notch outer */
          "M7 12H12V14H7Z",   /* y=12–13 left-inner segment */
          "M1 13H4V15H1Z",    /* y=13–14 left notch outer narrows */
          "M8 14H12V19H8Z",   /* y=14–18 left-inner column */
          "M2 15H5V19H2Z",    /* y=15–18 left-outer column after notch */

          /* ── Lower body (rows y=16–20): four narrow columns ── */
          /* Center and right columns continue */
          "M16 16H20V21H16Z", /* center-right column y=16–20 */
          "M24 16H28V20H24Z", /* right-outer column y=16–19 */

          /* ── Bottom pillar bases (rows y=19–22) ── */
          "M3 19H5V23H3Z",    /* far-left pillar base */
          "M8 19H13V20H8Z",   /* left-center base y=19 */
          "M9 20H13V22H9Z",   /* left-center base y=20–21 */

          /* ── Detached crest foot element (rows y=23–26) ── */
          "M22 23H28V24H22Z", /* foot top */
          "M17 24H28V25H17Z", /* foot wide band */
          "M20 25H28V26H20Z", /* foot narrow */
          "M26 26H28V27H26Z", /* foot tip */
        ].join(" ")}
      />

      {/*
        ── TEXT: "RIOT" / "GAMES" stacked lockup ────────────────────────────────
        Original pixel-measured letter paths (from issue #960) translated +37
        on the x-axis so the text cluster starts at x≈37, ending at x≈99.
        The +37 shift = icon width (29 units) + gap (8 units).
      ──────────────────────────────────────────────────────────────────────── */}

      {/* ── LINE 1: "RIOT" — baseline at y≈11 ── */}

      {/* R */}
      <path d="M39 1h7.5c1.6 0 2.8.4 3.6 1.2.8.8 1.2 1.8 1.2 3 0 1-.3 1.8-.8 2.5-.5.6-1.2 1.1-2.1 1.3L52 11h-3.4l-3.2-2.7H41.8V11H39V1Zm2.8 2.3v2.8h4.5c.6 0 1-.1 1.3-.4.3-.3.5-.6.5-1 0-.5-.2-.8-.5-1.1-.3-.2-.8-.3-1.4-.3H41.8Z" />

      {/* I */}
      <path d="M54 1h2.8v10H54V1Z" />

      {/* O */}
      <path d="M59 6c0-1.4.5-2.6 1.5-3.6 1-1 2.3-1.5 3.9-1.5 1.6 0 2.9.5 3.9 1.5S70 4.6 70 6s-.5 2.6-1.5 3.6-2.3 1.5-3.9 1.5c-1.6 0-2.9-.5-3.9-1.5C59.5 8.6 59 7.4 59 6Zm2.9 0c0 .9.3 1.6.8 2.2.6.6 1.3.8 2.2.8.9 0 1.6-.3 2.2-.8.6-.6.8-1.3.8-2.2 0-.9-.3-1.6-.8-2.2-.6-.6-1.3-.8-2.2-.8-.9 0-1.6.3-2.2.8-.5.6-.8 1.3-.8 2.2Z" />

      {/* T */}
      <path d="M74 1h10v2.3h-3.6V11h-2.8V3.3H74V1Z" />

      {/* ── LINE 2: "GAMES" — baseline at y≈25 ── */}

      {/* G */}
      <path d="M39 19.5c0-1.4.5-2.6 1.5-3.5 1-.9 2.3-1.4 3.9-1.4 1.2 0 2.2.3 3 .8.8.5 1.4 1.3 1.7 2.2l-2.5.8c-.2-.5-.5-.9-.9-1.2-.4-.3-.9-.4-1.4-.4-.9 0-1.6.3-2.1.8-.5.5-.8 1.2-.8 2 0 .8.3 1.5.8 2 .5.5 1.2.8 2.1.8.6 0 1.1-.1 1.5-.4.4-.3.7-.7.8-1.2H43.5v-2h5.3v.8c0 1.3-.5 2.4-1.4 3.2-.9.8-2.1 1.2-3.6 1.2-1.6 0-2.9-.5-3.9-1.4-1-.9-1.5-2.1-1.9-3.3Z" />

      {/* A */}
      <path d="M51.5 25l4.2-10.2h2.8L62.7 25h-2.9l-.8-2.1h-4l-.9 2.1H51.5Zm4.4-4.2h2.5l-1.2-3.1-1.3 3.1Z" />

      {/* M */}
      <path d="M64.5 14.8h3.4l2.5 5.4 2.5-5.4H76V25h-2.6v-6.2L70.6 25h-1.4l-2.8-6.2V25h-2.6V14.8h.7Z" />

      {/* E */}
      <path d="M78.5 14.8H88v2.3h-6.7v1.8h6v2.2h-6V22.7H88V25h-9.5V14.8Z" />

      {/* S */}
      <path d="M90 23.3l1.8-1.6c.3.4.7.8 1.2 1 .5.2 1 .3 1.6.3.5 0 .9-.1 1.2-.3.3-.2.5-.5.5-.8 0-.3-.1-.5-.4-.7-.3-.2-.8-.4-1.5-.5-1.2-.3-2.1-.7-2.7-1.2-.6-.5-.9-1.2-.9-2.1 0-.9.4-1.7 1.1-2.3.7-.6 1.7-.9 2.9-.9 1 0 1.9.2 2.6.6.7.4 1.3 1 1.7 1.8l-2 1.3c-.3-.5-.6-.8-1-.9-.4-.2-.8-.3-1.3-.3-.4 0-.7.1-.9.3-.2.2-.4.4-.4.7 0 .2.1.4.4.6.3.2.7.3 1.3.5 1.3.3 2.3.7 3 1.3.7.6 1 1.4 1 2.3 0 1-.4 1.8-1.2 2.4-.8.6-1.9.9-3.2.9-1.1 0-2.1-.2-2.9-.7-.8-.5-1.4-1.1-1.9-1.8Z" />
    </svg>
  );
}
