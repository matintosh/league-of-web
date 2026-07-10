"use client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface QueueStatusProps {
  /** Elapsed seconds in queue — the PARENT owns the ticking interval. */
  elapsedSeconds: number;
  /**
   * Expected wait in seconds. When provided, shows "ESTIMATED: m:ss" on the
   * right. When elapsedSeconds exceeds this, the elapsed display turns
   * text-gold-3 to indicate the estimate has been passed.
   */
  estimatedSeconds?: number;
  /** Called when the user clicks the ✕ cancel button. */
  onCancel: () => void;
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
 * QueueStatus — in-queue status strip shown while matchmaking.
 *
 * Horizontal strip (~380×64) with:
 * - Left: pulsing blue indicator dot (searching animation)
 * - Center: "IN QUEUE" label + elapsed mm:ss timer
 * - Right: optional estimated wait + ✕ cancel button
 *
 * Presentational only — the parent drives `elapsedSeconds` via its own
 * interval. No setInterval inside this component.
 */
export function QueueStatus({
  elapsedSeconds,
  estimatedSeconds,
  onCancel,
}: QueueStatusProps) {
  const overEstimate =
    estimatedSeconds !== undefined && elapsedSeconds > estimatedSeconds;

  const elapsedClass = overEstimate
    ? "text-gold-3 tabular-nums"
    : "text-gold-1 tabular-nums";

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
        <span className={`font-body text-lg leading-none ${elapsedClass}`}>
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
            "font-body text-sm leading-none text-grey-1",
            "transition-colors duration-150",
            "hover:text-gold-1",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          ].join(" ")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
