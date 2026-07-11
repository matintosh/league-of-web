// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CountdownHeaderProps {
  /** Phase label text. Rendered natural-case in JSX; uppercased via CSS. */
  title: string;
  /** Seconds remaining in the current phase. Parent owns the interval. */
  secondsRemaining: number;
  /** Total seconds in the phase — drives the bar width fraction. */
  totalSeconds: number;
}

// ---------------------------------------------------------------------------
// CountdownHeader
// ---------------------------------------------------------------------------

/**
 * CountdownHeader — centered phase header for champion select.
 *
 * Renders a title (display font, uppercase, gold-1), a large seconds counter
 * below it (display, text-4xl, gold-1), and a thin teal/blue-2 progress bar
 * that drains left-to-right as seconds tick down. Gold-4 hairline ornaments
 * flank the title using the CrestDivider fading-line pattern (inlined).
 *
 * Pure presentational — no intervals. Parent supplies `secondsRemaining` and
 * calls setState each second. The bar fraction is clamped to [0, 1] to defend
 * against negative or overshot values.
 *
 * @param title            Phase label, e.g. "Choose Your Loadout!"
 * @param secondsRemaining Current seconds left — drives the displayed number and bar.
 * @param totalSeconds     Full phase duration — denominator for the bar fraction.
 */
export function CountdownHeader({
  title,
  secondsRemaining,
  totalSeconds,
}: CountdownHeaderProps) {
  // Clamp fraction to [0, 1] — defend against negative remaining or overshoot.
  const fraction = Math.min(1, Math.max(0, secondsRemaining / totalSeconds));
  const barWidthPct = `${(fraction * 100).toFixed(2)}%`;

  return (
    <div className="flex flex-col items-center gap-1 w-full select-none">
      {/* Title row: flanking hairline ornaments + phase label */}
      <div className="flex w-full items-center gap-3">
        {/* Left hairline — fades from transparent to gold-4 toward center */}
        <div className="flex-1 h-px bg-linear-to-r from-transparent to-gold-4" />

        {/* Phase title */}
        <span
          className="font-display text-2xl tracking-widest uppercase text-gold-1 shrink-0"
        >
          {title}
        </span>

        {/* Right hairline — mirror: fades from gold-4 toward center to transparent */}
        <div className="flex-1 h-px bg-linear-to-r from-gold-4 to-transparent" />
      </div>

      {/* Progress bar: grey-3 track, teal/blue-2 fill draining left-to-right */}
      <div
        role="progressbar"
        aria-valuenow={secondsRemaining}
        aria-valuemin={0}
        aria-valuemax={totalSeconds}
        className="relative w-full h-[3px] bg-grey-3 overflow-visible"
      >
        {/* Teal fill — shrinks from right as seconds drain */}
        <div
          className="absolute inset-y-0 left-0 bg-blue-2 transition-[width] duration-1000 linear"
          style={{ width: barWidthPct }}
        />

        {/* End-cap at the leading edge of the fill (right side of fill) — simple gold-4 angled tab */}
        {fraction > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[7px] bg-gold-4"
            style={{ left: barWidthPct, transform: "translateX(-50%) translateY(-50%) rotate(15deg)" }}
          />
        )}
      </div>

      {/* Big seconds number */}
      <span className="font-display text-4xl text-gold-1 leading-none mt-1">
        {secondsRemaining}
      </span>
    </div>
  );
}
