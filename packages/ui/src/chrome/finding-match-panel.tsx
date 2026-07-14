"use client";

import { AmbientVideoLayer } from "./ambient-video-layer";
import { MapCrestImg } from "./map-crest-img";

// ---------------------------------------------------------------------------
// FindingMatchPanel — queue indicator rail widget (issue #173)
//
// Renders at the top of the social rail (below ProfileChip) when the player
// is in queue. Structure (top → bottom):
//   1. Header row — "FINDING MATCH" label (display xs, uppercase) + ✕ cancel button
//   2. Body band — slightly translucent dark panel:
//        left: crest chip (~36px, optional)
//        center: large elapsed timer (display ~27px, gold-cream)
//        below timer: "Estimated: X:XX" in blue-2 (hidden when estimatedLabel absent)
//
// The parent owns the ticker: elapsedLabel is passed in pre-formatted as "m:ss"
// or "h:mm:ss". The component is purely presentational (no intervals, no state).
// 'use client' is required because onCancel is a click callback (WindowFrame precedent).
//
// aria: region labeled "Finding match", cancel button aria-label "Cancel queue",
//       timer aria-live="off" (decorative — parent owns ticking, screen readers
//       would be spammy if it were polite; the label text is always visible).
// ---------------------------------------------------------------------------

export interface FindingMatchPanelProps {
  /** Pre-formatted elapsed time string, e.g. "20:03" or "1:23:45". Parent owns the tick. */
  elapsedLabel: string;
  /** Optional estimated wait, e.g. "Estimated: 5:02". Hidden when absent. */
  estimatedLabel?: string;
  /** URL for the game-mode/map crest image at the left of the body band. Omit to hide. */
  crestSrc?: string;
  /**
   * Optional ambient "magic" loop webm shown subtly behind the panel — the
   * client's animated queue backdrop (supply `partiesBgLoopUrl("queue-delay")`
   * from @low/fixtures). Additive: when omitted the flat `bg-blue-7` panel is
   * unchanged. Hidden under `prefers-reduced-motion`.
   */
  ambientVideoSrc?: string;
  /** Called when the user clicks the ✕ cancel button in the header. */
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// CancelIcon — inline ✕ SVG, aria-hidden
// ---------------------------------------------------------------------------

function CancelIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M1 1L9 9M9 1L1 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// FindingMatchPanel
// ---------------------------------------------------------------------------

/**
 * FindingMatchPanel — queue indicator rail widget for the social rail.
 *
 * Appears below ProfileChip while the player is searching for a match.
 * The parent page owns the ticking timer; this component renders the
 * pre-formatted `elapsedLabel` string only.
 *
 * Width: inherits parent (200px rail). No internal width is set.
 */
export function FindingMatchPanel({
  elapsedLabel,
  estimatedLabel,
  crestSrc,
  ambientVideoSrc,
  onCancel,
}: FindingMatchPanelProps) {
  return (
    <div
      data-shot="finding-match-panel"
      role="region"
      aria-label="Finding match"
      className="relative w-full overflow-hidden border-b border-gold-5 bg-blue-7"
    >
      {/* Ambient "magic" backdrop — subtle animated Hextech loop behind the
          panel. Additive over bg-blue-7; hidden under reduced-motion. */}
      <AmbientVideoLayer src={ambientVideoSrc} opacity={0.4} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. Header row — "FINDING MATCH" label + ✕ cancel button            */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 flex items-center justify-between px-3 py-1.5">
        <span className="font-display text-xs uppercase tracking-widest text-grey-1">
          Finding Match
        </span>
        <button
          type="button"
          aria-label="Cancel queue"
          onClick={onCancel}
          className="flex items-center justify-center text-blue-2 transition-opacity duration-150 hover:opacity-70"
        >
          <CancelIcon />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Body band — slightly translucent dark panel                      */}
      {/* crest chip overlaps the left edge; timer + estimate centred right  */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 flex items-center"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 60%, transparent)",
          minHeight: 52,
          paddingLeft: crestSrc ? 48 : 12,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {/* Crest chip — absolute left, centred vertically, drop-shadow glow */}
        {crestSrc && (
          <div
            className="absolute"
            style={{
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              filter: "drop-shadow(0 0 4px var(--color-blue-2))",
              zIndex: 1,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <MapCrestImg src={crestSrc} frame="active" size={36} />
          </div>
        )}

        {/* Timer + estimate column */}
        <div className="flex flex-col">
          {/* Elapsed timer — large display font, gold-cream */}
          <span
            aria-live="off"
            className="font-display leading-none text-gold-cream"
            style={{ fontSize: 27 }}
          >
            {elapsedLabel}
          </span>

          {/* Estimated wait line — blue-2 teal, hidden when prop absent */}
          {estimatedLabel && (
            <span
              className="mt-0.5 font-body text-xs text-blue-2"
              style={{ fontSize: 11 }}
            >
              {estimatedLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
