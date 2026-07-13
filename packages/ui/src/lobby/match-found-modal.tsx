"use client";

import { useId } from "react";
import { HextechButton } from "../chrome/hextech-button";
import { MapCrestImg } from "../chrome/map-crest-img";

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
  /**
   * URL for the game-mode/map crest displayed in the modal center (from gameModeMapUrl).
   * Renders as the lit (active) atlas frame inside a gold ornamental double-border square.
   * Falls back to the generic HexCrest placeholder when absent.
   */
  crestSrc?: string;
}

// ---------------------------------------------------------------------------
// HexCrest — fallback placeholder when crestSrc is absent, not exported
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
// MapCrestFrame — crestSrc wrapped in gold ornamental double-border square.
// Matches the reference (client-match-found-crest.png): thin outer gold-4
// border + thin inner gold-3 border with a 2px gap between them, 4px inset
// from the outer edge. Image fills the inner content area.
// ---------------------------------------------------------------------------

function MapCrestFrame({ src }: { src: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex items-center justify-center"
      style={{
        // Outer border — gold-4
        border: "1px solid var(--color-gold-4)",
        padding: 3,
        background: "transparent",
      }}
    >
      {/* Inner border — gold-3 */}
      <div
        style={{
          border: "1px solid var(--color-gold-3)",
          padding: 2,
        }}
      >
        <MapCrestImg src={src} frame="active" size={48} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AcceptTrapezoid — ACCEPT! button, trapezoid + curved-bottom arc silhouette.
//
// Same clip-path technique as LockInButton (objectBoundingBox, scales with
// container). Colors differ: dark teal/navy fill (blue-5) with teal-ring border
// — matches the reference ACCEPT inside the circle (RGB 51–57, 81–85 background,
// teal border). Hover brightens to blue-4; active dims further.
//
// Slope and arc geometry match the LockInButton reference proportions so the
// Hextech trapezoid language is consistent across both CTAs.
// ---------------------------------------------------------------------------

const ACCEPT_SLOPE = 0.12;
const ACCEPT_ARC_PAD = 0.22;
const ACCEPT_Y_BODY = 1 / (1 + ACCEPT_ARC_PAD); // ≈ 0.8197
const ACCEPT_BORDER_PX = 2;

function acceptTrapPath(): string {
  const yb = ACCEPT_Y_BODY.toFixed(6);
  return `M 0,0 L 1,0 L ${(1 - ACCEPT_SLOPE).toFixed(6)},${yb} Q 0.5,1 ${ACCEPT_SLOPE.toFixed(6)},${yb} Z`;
}
const ACCEPT_PATH_D = acceptTrapPath();

function AcceptTrapClipDefs({ id }: { id: string }) {
  return (
    <svg
      width={0}
      height={0}
      aria-hidden="true"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={ACCEPT_PATH_D} />
        </clipPath>
      </defs>
    </svg>
  );
}

function AcceptTrapezoid({ onClick, clipId }: { onClick: () => void; clipId: string }) {
  const clipRef = `url(#${clipId})`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex w-full items-center justify-center",
        // Teal glow following the clipped silhouette
        "[filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-blue-2)_60%,transparent))]",
        "pt-3 cursor-pointer",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-2 focus-visible:outline-offset-2",
      ].join(" ")}
      style={{
        paddingBottom: `calc(12px + 44px * ${ACCEPT_ARC_PAD})`,
      }}
    >
      <AcceptTrapClipDefs id={clipId} />

      {/* Border shell — teal-ring color */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: clipRef,
          background: "var(--color-teal-ring)",
          transition: "background 150ms",
        }}
      />

      {/* Fill layer — dark teal (blue-5) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute group-hover:!bg-[var(--color-blue-4)]"
        style={{
          inset: ACCEPT_BORDER_PX,
          clipPath: clipRef,
          background: "var(--color-blue-5)",
          transition: "background 150ms",
        }}
      />

      {/* Active press overlay — slightly darker */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0 group-active:opacity-100 transition-opacity duration-75"
        style={{
          inset: ACCEPT_BORDER_PX,
          clipPath: clipRef,
          background: "var(--color-teal-grad-press-a)",
        }}
      />

      <span
        className="relative z-10 font-display text-sm tracking-[0.2em] uppercase select-none text-gold-1 group-hover:text-gold-2 group-active:text-gold-2"
        style={{ transition: "color 150ms" }}
      >
        Accept!
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// MatchFoundModal
// ---------------------------------------------------------------------------

/**
 * MatchFoundModal — circular hi-fi overlay displayed when a match has been found.
 *
 * 480 px circle on a dimmed full-screen backdrop. Contains a countdown arc
 * (parent-driven), ACCEPT trapezoid inside the circle bottom, and DECLINE
 * rectangle below the circle. The arc is the sole visual timer — countdown
 * text is sr-only for accessibility.
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
  crestSrc,
}: MatchFoundModalProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const glowId = `${uid}-arc-glow`;
  const crestGradId = `${uid}-crest-grad`;
  const acceptClipId = `${uid}-accept-trap`;

  if (!open) return null;

  const arcFraction = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsRemaining / totalSeconds)) : 1;

  return (
    <>
      {/* 1. Full-screen backdrop — not dismissible, no onClick */}
      <div aria-hidden="true" className="fixed inset-0 z-50 bg-hextech-black/70" />

      {/* 2. Outer wrapper — centers the circle + the DECLINE below it */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">

        {/* 3. Circle container (the modal) */}
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative w-[480px] h-[480px]"
        >
          {/* 4. Keyart disc */}
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

          {/* 5. Double gold ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 480" aria-hidden="true">
            <circle cx="240" cy="240" r="235" fill="none" stroke="var(--color-gold-4)" strokeWidth="1" strokeDasharray="6 3" />
            <circle cx="240" cy="240" r="228" fill="none" stroke="var(--color-gold-3)" strokeWidth="1" />
          </svg>

          {/* 6. Countdown arc SVG — rotated -90° so arc starts at top */}
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

          {/* 7. Content stack — crest, title, subtitle, sr-only countdown */}
          <div className="absolute inset-0 flex flex-col items-center px-8" style={{ paddingTop: "80px", paddingBottom: "120px" }}>
            {crestSrc ? (
              <MapCrestFrame src={crestSrc} />
            ) : (
              <HexCrest gradientId={crestGradId} />
            )}
            <h2 id={titleId} className="font-display text-2xl uppercase tracking-widest text-gold-1 text-center mt-4">
              MATCH FOUND
            </h2>
            {subtitle && (
              <p className="font-body text-xs text-gold-2 text-center mt-1">{subtitle}</p>
            )}
            {/* sr-only countdown: arc is the sole visual timer; text kept for screen readers */}
            <p
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {secondsRemaining} seconds remaining
            </p>
          </div>

          {/* 8. ACCEPT trapezoid — absolutely anchored to the circle bottom interior */}
          {/* Positioned 24px above the circle bottom, centered, ~280px wide */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: "24px", width: "280px" }}
          >
            <AcceptTrapezoid onClick={onAccept} clipId={acceptClipId} />
          </div>
        </div>

        {/* 9. DECLINE — outside and below the circle, small compact rectangle */}
        <div className="mt-3">
          <HextechButton variant="secondary" onClick={onDecline}>
            Decline
          </HextechButton>
        </div>
      </div>
    </>
  );
}
