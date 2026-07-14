// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CountdownHeaderProps {
  /** Phase label text. Rendered natural-case in JSX; uppercased via CSS. */
  title: string;
  /** Seconds remaining in the current phase. Parent owns the interval. */
  secondsRemaining: number;
  /** Total seconds in the phase — drives the bar fill fraction. */
  totalSeconds: number;
}

// ---------------------------------------------------------------------------
// Filigree bracket terminal
// ---------------------------------------------------------------------------

/**
 * FiligreeTerminal — the descending-sweep terminus that caps the inner
 * (title-facing) end of each flanking hairline in the champ-select header
 * ornament.
 *
 * Traced from docs/reference/client-champ-select-header-ornament.png (988×35,
 * two mirrored halves). The left half carries a long OUTER hairline (center
 * y≈1.5) with a shorter parallel INNER hairline (y≈6) a few px below it. Near
 * the title both lines sweep smoothly DOWN in a quarter-circle arc, bottom out
 * into a short horizontal FOOT (y≈30), and close with a tiny terminal TICK
 * rising at the very end (reference x 340→407). Coordinates below map that curl
 * zone into a 60×35 viewBox: the two lines enter horizontally from the left and
 * the arc + foot + tick occupy the right.
 *
 * The stroke is gold-4 (the measured line body, rgb(120,90,40)) with a gold-5
 * underlay (rgb(70,55,20)) offset a hair down to reproduce the darker outer
 * anti-alias edge seen in the reference. Rendered at natural pixel size so it
 * aligns seam-to-seam with the CSS hairlines it terminates.
 */
function FiligreeTerminal({ className }: { className?: string }) {
  // Outer hairline: horizontal at y≈2, arcing down to the foot at y≈30.
  // Inner hairline: horizontal at y≈6 (starts partway in), arcing down parallel
  // and merging into the foot just inside the outer. Foot + terminal tick close
  // the sweep at the bottom-right.
  const outer = "M0 2 H28 C36 2 38 5 40 11 L46 26 C47 28.5 48.5 30 51 30 H58";
  const inner = "M9 6 H29 C35 6 36.5 8.5 38 13.5 L43 26 C43.9 28.2 45 29.4 47 29.6 H54";
  const tick = "M58 30 V34.5";

  return (
    <svg
      viewBox="0 0 60 36"
      width="60"
      height="36"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* gold-5 darker underlay — offset a hair down for the outer edge */}
      <g
        stroke="var(--color-gold-5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={outer} transform="translate(0,0.7)" />
        <path d={inner} transform="translate(0,0.7)" />
        <path d={tick} transform="translate(0,0.7)" />
      </g>
      {/* gold-4 line body */}
      <g
        stroke="var(--color-gold-4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={outer} />
        <path d={inner} />
        <path d={tick} />
      </g>
    </svg>
  );
}

/**
 * HeaderOrnament — one flanking bracket: a long gold hairline (stretches to fill
 * available width) terminating in a {@link FiligreeTerminal} scroll at the inner
 * (title-facing) end. `side="left"` renders line-then-terminal; `side="right"`
 * mirrors the whole group via scaleX(-1) so the two brackets face each other.
 */
function HeaderOrnament({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="flex-1 flex items-start min-w-0 h-9"
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Long outer hairline — fades in from the far edge, meeting the SVG's
          outer entry (viewBox y≈2 → 2px from the top of this 36px-tall row). */}
      <div className="flex-1 min-w-0 mt-[2px] h-px bg-linear-to-r from-transparent to-gold-4" />
      <FiligreeTerminal className="shrink-0 -ml-px" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Split countdown bars
// ---------------------------------------------------------------------------

/**
 * CountdownBar — one half of the split progress pair. A dark track with a hairline
 * gold baseline carries a bright teal fill that is anchored at the OUTER end and
 * drains toward it (shrinks outward from the number) as `fraction` falls.
 *
 * The fill ramps from a dark teal at the inner edge to a bright teal cap at the
 * outer end, matching the reference (brightest at the outer cap). `side="left"`
 * anchors the fill on the right (inner) growing left; `side="right"` mirrors.
 */
function CountdownBar({
  fraction,
  side,
}: {
  fraction: number;
  side: "left" | "right";
}) {
  const fillPct = `${(fraction * 100).toFixed(2)}%`;
  // Outer end holds the bright cap. Left bar: outer = left edge; right bar: outer = right edge.
  const anchorOuter = side === "left" ? "left-0" : "right-0";
  // Bright cap sits at the outer end; ramp to dark teal toward the inner (number) side.
  const gradient =
    side === "left"
      ? "bg-linear-to-l from-blue-4 to-blue-1"
      : "bg-linear-to-r from-blue-4 to-blue-1";

  return (
    <div className="relative flex-1 h-[3px] bg-blue-6/60 overflow-hidden">
      {/* gold hairline baseline under the track (full width) */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-4/70" />
      {/* teal fill — anchored at outer end, width = fraction, drains outward */}
      <div
        className={`absolute inset-y-0 ${anchorOuter} ${gradient} transition-[width] duration-1000 ease-linear`}
        style={{ width: fillPct }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CountdownHeader
// ---------------------------------------------------------------------------

/**
 * CountdownHeader — centered phase header for champion select.
 *
 * Renders a display-font title (uppercase, gold-1) flanked by filigree scroll
 * brackets, and below it a row with the large seconds counter centered between
 * two symmetric teal progress bars. Both bars share one `fraction` and drain
 * OUTWARD from the number as seconds tick down (fill anchored at the outer caps).
 *
 * Pure presentational — no intervals. Parent supplies `secondsRemaining` and
 * calls setState each second. The fraction is clamped to [0, 1] to defend
 * against negative or overshot values. `totalSeconds <= 0` yields an empty bar.
 *
 * @param title            Phase label, e.g. "Choose Your Loadout!"
 * @param secondsRemaining Current seconds left — drives the number and both bars.
 * @param totalSeconds     Full phase duration — denominator for the bar fraction.
 */
export function CountdownHeader({
  title,
  secondsRemaining,
  totalSeconds,
}: CountdownHeaderProps) {
  // Clamp fraction to [0, 1] — defend against negative remaining or overshoot.
  const fraction =
    totalSeconds > 0
      ? Math.min(1, Math.max(0, secondsRemaining / totalSeconds))
      : 0;

  return (
    <div className="flex flex-col items-center gap-2 w-full select-none">
      {/* Title row: flanking filigree brackets + phase label */}
      <div className="flex w-full items-center gap-3">
        <HeaderOrnament side="left" />

        <span className="font-display text-2xl tracking-widest uppercase text-gold-1 shrink-0">
          {title}
        </span>

        <HeaderOrnament side="right" />
      </div>

      {/* Countdown row: split bars flanking the centered seconds number */}
      <div
        role="progressbar"
        aria-valuenow={secondsRemaining}
        aria-valuemin={0}
        aria-valuemax={totalSeconds}
        className="flex w-full items-center gap-4"
      >
        <CountdownBar fraction={fraction} side="left" />

        <span className="font-display text-4xl text-gold-1 leading-none shrink-0 min-w-[1.5ch] text-center">
          {secondsRemaining}
        </span>

        <CountdownBar fraction={fraction} side="right" />
      </div>
    </div>
  );
}
