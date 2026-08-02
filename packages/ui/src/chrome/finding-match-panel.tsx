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
//   3. Progress bar strip (optional, issue #559) — the official layered webm loops
//        composited as straight-alpha overlays (border-loop / main-loop / tip-loop).
//        Gate behind prefers-reduced-motion with the CSS bar strip as fallback.
//
// The parent owns the ticker: elapsedLabel is passed in pre-formatted as "m:ss"
// or "h:mm:ss". The component is purely presentational (no intervals, no state).
// 'use client' is required because onCancel is a click callback (WindowFrame precedent).
//
// aria: region labeled "Finding match", cancel button aria-label "Cancel queue",
//       timer aria-live="off" (decorative — parent owns ticking, screen readers
//       would be spammy if it were polite; the label text is always visible).
// ---------------------------------------------------------------------------

/**
 * Optional progress-bar webm layer URLs (issue #559). Supply the three straight-alpha
 * loop clips from staticVideoUrl — the bar is composited border → main → tip.
 * Omit the object entirely to suppress the bar strip; when present the CSS fallback
 * bar is shown under prefers-reduced-motion and when any URL errors.
 */
export interface ProgressBarVideoSrcs {
  /** Border layer (the outer glow/frame of the bar). */
  borderSrc: string;
  /** Main fill layer (the animated progress fill). */
  mainSrc: string;
  /** Tip particle layer (the travelling highlight at the bar's leading edge). */
  tipSrc: string;
}

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
  /**
   * Optional progress-bar webm layer URLs (issue #559). Supply via
   * `staticVideoUrl("long-progress-bar-{border,main,tip}-loop.webm")`. When
   * present, the three straight-alpha webm loops are composited as the animated
   * loading bar; a static CSS bar strip is the fallback under
   * `prefers-reduced-motion` and when the object is absent.
   */
  progressBarVideoSrcs?: ProgressBarVideoSrcs;
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
  progressBarVideoSrcs,
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
          paddingBottom: progressBarVideoSrcs ? 4 : 8,
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

      {/* ------------------------------------------------------------------ */}
      {/* 3. Progress bar strip — issue #559                                  */}
      {/*                                                                     */}
      {/* Official layered webm loops: border → main → tip, all straight-     */}
      {/* alpha. Composited pointer-events-none + aria-hidden over the CSS    */}
      {/* fallback bar strip. Gate behind prefers-reduced-motion via the       */}
      {/* motion-reduce:hidden class on the video wrapper (the CSS bar         */}
      {/* strip stays visible at all times as the base layer).                */}
      {/* When progressBarVideoSrcs is absent the section is entirely hidden. */}
      {/* ------------------------------------------------------------------ */}
      {progressBarVideoSrcs && (
        <div
          className="relative z-10 w-full"
          style={{ height: 18 }}
        >
          {/* CSS fallback bar — always visible; sits as the base under the video layers */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, var(--color-blue-3), var(--color-blue-2))`,
              opacity: 0.45,
            }}
          />
          {/* Webm video layer stack — straight-alpha overlays, hidden under reduced-motion */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 motion-reduce:hidden"
          >
            {/* Border loop — outermost glow/frame layer */}
            <video
              src={progressBarVideoSrcs.borderSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-fill"
            />
            {/* Main loop — animated progress fill */}
            <video
              src={progressBarVideoSrcs.mainSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-fill"
            />
            {/* Tip loop — travelling highlight at the bar's leading edge */}
            <video
              src={progressBarVideoSrcs.tipSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-fill"
            />
          </div>
        </div>
      )}
    </div>
  );
}
