"use client";

import { useId } from "react";
import { HextechButton } from "../chrome/hextech-button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MatchFoundModalProps {
  /** Whether the modal is visible. When false, renders nothing. */
  open: boolean;
  /** Remaining seconds — PARENT owns the countdown. Zero timers inside this component. */
  secondsRemaining: number;
  /** Total seconds for context (default 10). */
  totalSeconds?: number;
  /** Called when user clicks ACCEPT. */
  onAccept: () => void;
  /** Called when user clicks DECLINE. */
  onDecline: () => void;
}

// ---------------------------------------------------------------------------
// MatchFoundModal
// ---------------------------------------------------------------------------

/**
 * MatchFoundModal — overlay displayed when a match has been found.
 *
 * Shows a countdown (parent-driven), ACCEPT and DECLINE buttons.
 * Not dismissible via backdrop click — no onClick on backdrop, no ✕ button.
 *
 * Presentational only — the parent drives `secondsRemaining` via its own
 * interval. No setInterval inside this component.
 */
export function MatchFoundModal({
  open,
  secondsRemaining,
  totalSeconds = 10,
  onAccept,
  onDecline,
}: MatchFoundModalProps) {
  const titleId = useId();

  if (!open) return null;

  const countdownClass =
    secondsRemaining <= 2
      ? "font-display text-5xl text-gold-3"
      : "font-display text-5xl text-blue-2";

  return (
    <>
      {/* Backdrop — not dismissible, no onClick */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-hextech-black/70"
      />

      {/* Panel */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "z-50 w-[420px]",
          "bg-blue-7 border border-gold-4 ring-1 ring-gold-5",
        ].join(" ")}
      >
        <div className="flex flex-col items-center px-8 py-10 gap-6">
          {/* Top: heading */}
          <h2
            id={titleId}
            className="font-display text-2xl uppercase tracking-widest text-gold-1 text-center"
          >
            MATCH FOUND
          </h2>

          {/* Middle: countdown */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`${countdownClass} text-center tabular-nums`}
          >
            {secondsRemaining}
          </div>

          {/* Bottom: action buttons */}
          <div className="flex items-center gap-4">
            <HextechButton variant="primary" size="large" onClick={onAccept}>
              Accept
            </HextechButton>
            <HextechButton variant="secondary" onClick={onDecline}>
              Decline
            </HextechButton>
          </div>
        </div>
      </div>
    </>
  );
}
