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
  /** Total seconds for the arc (default 10). Now LOAD-BEARING — drives arc fraction. */
  totalSeconds?: number;
  /** Called when user clicks ACCEPT. */
  onAccept: () => void;
  /** Called when user clicks DECLINE. */
  onDecline: () => void;
  /** e.g. "Summoner's Rift • Ranked • 5v5" — shown below the title */
  subtitle?: string;
  /** Circular keyart image URL; falls back to bg-linear-to-b from-blue-6 to-blue-7 disc when absent */
  keyartSrc?: string;
}

// ---------------------------------------------------------------------------
// HexCrest — local, not exported
// ---------------------------------------------------------------------------

function HexCrest({ gradientId }: { gradientId: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-4)" />
          <stop offset="100%" stopColor="var(--color-gold-3)" />
        </linearGradient>
      </defs>
      <polygon
        points="24,2 44,13 44,35 24,46 4,35 4,13"
        fill={`url(#${gradientId})`}
        stroke="var(--color-gold-2)"
        strokeWidth="1"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MatchFoundModal
// ---------------------------------------------------------------------------

/**
 * MatchFoundModal — circular hi-fi overlay displayed when a match has been found.
 *
 * 480 px circle on a dimmed full-screen backdrop. Contains a countdown arc
 * (parent-driven), ACCEPT and DECLINE buttons. Not dismissible via backdrop click.
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
  subtitle,
  keyartSrc,
}: MatchFoundModalProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const glowId = `${uid}-arc-glow`;
  const crestGradId = `${uid}-crest-grad`;

  if (!open) return null;

  const arcFraction = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsRemaining / totalSeconds)) : 1;

  return (
    <>
      {/* 1. Full-screen backdrop — not dismissible, no onClick */}
      <div aria-hidden="true" className="fixed inset-0 z-50 bg-hextech-black/70" />

      {/* 2. Circle container (the modal) */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] h-[480px]"
      >
        {/* 3. Keyart disc */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {keyartSrc ? (
            <img src={keyartSrc} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-b from-blue-6 to-blue-7" />
          )}
        </div>
        {/* Dark vignette to make content readable */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at center, transparent 40%, color-mix(in srgb, var(--color-hextech-black) 75%, transparent) 100%)" }}
        />

        {/* 4. Double gold ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 480" aria-hidden="true">
          <circle cx="240" cy="240" r="235" fill="none" stroke="var(--color-gold-4)" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="240" cy="240" r="228" fill="none" stroke="var(--color-gold-3)" strokeWidth="1" />
        </svg>

        {/* 5. Countdown arc SVG — rotated -90° so arc starts at top */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 480 480"
          aria-hidden="true"
        >
          <defs>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="240"
            cy="240"
            r="232"
            fill="none"
            stroke="var(--color-blue-2)"
            strokeWidth="6"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={100 - arcFraction * 100}
            strokeLinecap="round"
            filter={`url(#${glowId})`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* 6. Content stack */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
          <HexCrest gradientId={crestGradId} />
          <h2 id={titleId} className="font-display text-2xl uppercase tracking-widest text-gold-1 text-center">
            MATCH FOUND
          </h2>
          {subtitle && (
            <p className="font-body text-xs text-gold-2 text-center">{subtitle}</p>
          )}
          <p
            aria-live="polite"
            aria-atomic="true"
            className={`font-body text-sm tabular-nums ${secondsRemaining <= 2 ? "text-gold-3" : "text-grey-1"}`}
          >
            {secondsRemaining}s
          </p>
          <div className="flex flex-col items-center gap-3 mt-2">
            <HextechButton variant="primary" size="large" onClick={onAccept}>
              Accept!
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
