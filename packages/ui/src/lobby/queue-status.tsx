"use client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Layout variant for QueueStatus. Defaults to "strip". */
export type QueueStatusLayout = "strip" | "panel";

export interface QueueStatusProps {
  /** Elapsed seconds in queue — the PARENT owns the ticking interval. */
  elapsedSeconds: number;
  /**
   * Expected wait in seconds. When provided, shows "ESTIMATED: m:ss".
   * When elapsedSeconds exceeds this, the elapsed display turns
   * text-gold-3 to indicate the estimate has been passed.
   */
  estimatedSeconds?: number;
  /** Called when the user clicks the ✕ cancel button. */
  onCancel: () => void;
  /**
   * Layout variant.
   * - "strip" (default): horizontal ~380×64 bar, used in the bottom control strip.
   * - "panel": vertical ~200×96 compact box, used in the top-right sidebar.
   */
  layout?: QueueStatusLayout;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formats a number of seconds to "m:ss" (e.g. 462 → "7:42").
 * Exported so parents / tests can reuse the same display format.
 */
export function formatQueueTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// QueueStatus
// ---------------------------------------------------------------------------

/**
 * QueueStatus — in-queue status indicator shown while matchmaking.
 *
 * Two layout variants:
 * - **strip** (default): horizontal ~380×64 bar with pulse dot, label, elapsed
 *   timer in center, optional estimated wait + cancel ✕ on the right.
 * - **panel**: vertical ~200×96 compact box with header row (label + pulse +
 *   cancel ✕), large elapsed timer, optional estimated line below.
 *   Styled with blue-4 border and a subtle teal glow.
 *
 * Presentational only — the parent drives `elapsedSeconds` via its own
 * interval. No setInterval inside this component.
 */
export function QueueStatus({
  elapsedSeconds,
  estimatedSeconds,
  onCancel,
  layout = "strip",
}: QueueStatusProps) {
  const overEstimate =
    estimatedSeconds !== undefined && elapsedSeconds > estimatedSeconds;

  const elapsedClass = overEstimate
    ? "text-gold-3 tabular-nums"
    : "text-gold-1 tabular-nums";

  if (layout === "panel") {
    return (
      <div
        className={[
          // Size + layout
          "flex w-[200px] min-h-[96px] flex-col p-3 gap-2",
          // Surface + border + glow
          "bg-blue-7/90 border border-blue-4 shadow-[0_0_8px_var(--color-blue-5)]",
        ].join(" ")}
      >
        {/* ---- Header row: label + pulse + cancel ---- */}
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="block h-2 w-2 shrink-0 rounded-full bg-blue-2 animate-pulse"
          />
          <span className="font-display text-xs uppercase tracking-widest text-gold-2 leading-none flex-1">
            In Queue
          </span>
          <button
            type="button"
            aria-label="Cancel queue"
            onClick={onCancel}
            className={[
              "h-6 w-6 rounded-full border border-gold-5 flex items-center justify-center shrink-0",
              "font-body text-xs leading-none text-grey-1",
              "transition-colors duration-150",
              "hover:border-gold-3 hover:text-gold-1",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ].join(" ")}
          >
            ✕
          </button>
        </div>

        {/* ---- Elapsed timer (large) ---- */}
        <span
          className={`font-body text-2xl leading-none ${elapsedClass}`}
        >
          {formatQueueTime(elapsedSeconds)}
        </span>

        {/* ---- Estimated line (optional) ---- */}
        {estimatedSeconds !== undefined && (
          <span className="font-body text-xs uppercase text-grey-1 leading-none whitespace-nowrap">
            Estimated: {formatQueueTime(estimatedSeconds)}
          </span>
        )}
      </div>
    );
  }

  // ---- Strip layout (default) ----
  return (
    <div
      className={[
        // Size + layout
        "flex w-[380px] h-16 items-center px-4 gap-4",
        // Surface + border
        "bg-blue-6 border border-gold-5",
      ].join(" ")}
    >
      {/* ---- Left: pulse indicator ---- */}
      <div className="shrink-0 flex items-center justify-center w-6">
        <span
          aria-hidden="true"
          className="block h-2.5 w-2.5 rounded-full bg-blue-2 animate-pulse"
        />
      </div>

      {/* ---- Center: label + timer ---- */}
      <div className="flex flex-1 flex-col items-center gap-0.5">
        <span className="font-display text-xs uppercase tracking-widest text-gold-2 leading-none">
          In Queue
        </span>
        <span className={`font-body text-2xl leading-none ${elapsedClass}`}>
          {formatQueueTime(elapsedSeconds)}
        </span>
      </div>

      {/* ---- Right: estimate + cancel ---- */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {estimatedSeconds !== undefined && (
          <span className="font-body text-xs uppercase text-grey-1 leading-none whitespace-nowrap">
            Estimated: {formatQueueTime(estimatedSeconds)}
          </span>
        )}
        <button
          type="button"
          aria-label="Cancel queue"
          onClick={onCancel}
          className={[
            "h-6 w-6 rounded-full border border-gold-5 flex items-center justify-center",
            "font-body text-xs leading-none text-grey-1",
            "transition-colors duration-150",
            "hover:border-gold-3 hover:text-gold-1",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          ].join(" ")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
