"use client";

import { useId, useState } from "react";
import { HextechButton } from "../chrome/hextech-button";
import { MapCrestImg } from "../chrome/map-crest-img";
import { TrapezoidButton, TRAP_BORDER_PX, type TrapLayer } from "../chrome/trapezoid-button";

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
  /**
   * WAD ready-check countdown video (the draining teal ring, 552×554 with a real
   * alpha channel). Rendered as a transparent overlay registered to the gold ring
   * of the circle; plays forward from mount. PRESENTATIONAL sync only — the video
   * never drives `secondsRemaining` (the parent still owns the countdown number).
   * When absent (or under `prefers-reduced-motion`) the CSS ring sweep from #299
   * is the sole visual timer, unchanged.
   */
  countdownVideoSrc?: string;
  /**
   * WAD post-accept intro video (~1.5s, the ring settling into the accepted look).
   * Played once when `accepted` flips true, then crossfades into the idle loop.
   * Requires `acceptedIdleVideoSrc` to loop after it; on its own it plays and holds
   * the final frame. Only meaningful alongside `countdownVideoSrc`.
   */
  acceptedIntroVideoSrc?: string;
  /**
   * WAD post-accept idle loop video (~5s, the resting accepted ring). Loops after
   * `acceptedIntroVideoSrc` finishes (or immediately if no intro is supplied) while
   * `accepted` stays true.
   */
  acceptedIdleVideoSrc?: string;
  /**
   * When true, the video overlay swaps from the countdown ring to the accepted
   * state (intro → idle loop). Presentational: the consumer sets it after ACCEPT
   * if it keeps the modal mounted long enough to show the accepted ring. Defaults
   * to false; existing consumers that navigate away on accept can ignore it.
   * @default false
   */
  accepted?: boolean;
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
// AcceptTrapezoid — ACCEPT! button.
//
// The trapezoid + curved-bottom-arc silhouette is the shared TrapezoidButton
// primitive (../chrome/trapezoid-button) — the SAME shape as FIND MATCH / LOCK IN
// (#331 unification). This wrapper supplies only the ACCEPT palette + entrance
// pulse overlay. Colors: dark teal/navy fill (blue-5) with teal-ring border —
// matches the reference ACCEPT inside the circle (RGB 51–57, 81–85 background,
// teal border). Hover brightens to blue-4; active dims further.
// ---------------------------------------------------------------------------

function AcceptTrapezoid({
  onClick,
  pulseClass,
}: {
  onClick: () => void;
  /** Instance-scoped entrance-pulse class applied to the glow overlay on mount. */
  pulseClass: string;
}) {
  const layers: TrapLayer[] = [
    {
      // Border shell — teal-ring color
      key: "shell",
      inset: 0,
      style: { background: "var(--color-teal-ring)", transition: "background 150ms" },
    },
    {
      // Fill layer — dark teal (blue-5)
      key: "fill",
      inset: TRAP_BORDER_PX,
      className: "group-hover:!bg-[var(--color-blue-4)]",
      style: { background: "var(--color-blue-5)", transition: "background 150ms" },
    },
    {
      // Active press overlay — slightly darker
      key: "press",
      inset: TRAP_BORDER_PX,
      className: "opacity-0 group-active:opacity-100 transition-opacity duration-75",
      style: { background: "var(--color-teal-grad-press-a)" },
    },
  ];

  return (
    <TrapezoidButton
      onClick={onClick}
      layers={layers}
      className={[
        // Teal glow following the clipped silhouette
        "[filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-blue-2)_60%,transparent))]",
        "cursor-pointer",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-2 focus-visible:outline-offset-2",
      ].join(" ")}
      // Entrance glow pulse — a clipped teal wash over the fill that brightens
      // twice on mount to draw attention, then rests invisible (base opacity 0;
      // the persistent glow is the button's drop-shadow). Disabled under
      // prefers-reduced-motion. Purely decorative.
      overlay={({ clipRef }) => (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute opacity-0 ${pulseClass}`}
          style={{
            inset: TRAP_BORDER_PX,
            clipPath: clipRef,
            background: "color-mix(in srgb, var(--color-blue-2) 40%, transparent)",
          }}
        />
      )}
      labelClassName="font-display text-sm tracking-[0.2em] uppercase text-gold-1 group-hover:text-gold-2 group-active:text-gold-2"
      labelStyle={{ transition: "color 150ms" }}
    >
      Accept!
    </TrapezoidButton>
  );
}

// ---------------------------------------------------------------------------
// TimerVideoOverlay — the WAD ready-check ring videos composited over the circle.
//
// The source videos are 552×554 with a genuine alpha channel (the teal ring on
// transparent), so they overlay STRAIGHT (no blend mode) directly over the gold
// ring. The ring core sits at ~444px inside the 552px frame; sizing the video to
// 120% of the 480px circle (≈577px) and centering it lands the video ring exactly
// on the modal's gold ring — verified against docs/reference/client-match-found-crest.png.
//
// State machine (presentational only — never touches `secondsRemaining`):
//   mount               → countdown video plays forward once
//   accepted flips true  → accepted-intro plays once, then crossfades to
//                          accepted-idle which loops
// Layers crossfade via opacity over var(--motion-crossfade). The whole layer is
// pointer-events-none + aria-hidden (the sr-only countdown stays the a11y timer)
// and `motion-reduce:hidden` so reduced-motion users get the #299 CSS ring only.
//
// Registration constant: the video is 120% of the circle, centered. If the source
// framing ever changes, re-run the overlay check in the PR description.
// ---------------------------------------------------------------------------

const VIDEO_RING_SCALE = "120%"; // video ring core → modal gold ring (see overlay check)

function TimerVideoOverlay({
  countdownSrc,
  acceptedIntroSrc,
  acceptedIdleSrc,
  accepted,
}: {
  countdownSrc: string;
  acceptedIntroSrc?: string;
  acceptedIdleSrc?: string;
  accepted: boolean;
}) {
  // Which accepted clip is currently showing. `intro` plays once then `onEnded`
  // advances to `idle`. This sequences video playback only — it derives nothing
  // about game state and adds no timers.
  const [acceptedPhase, setAcceptedPhase] = useState<"intro" | "idle">(
    acceptedIntroSrc ? "intro" : "idle",
  );

  const showAcceptedIntro = accepted && !!acceptedIntroSrc && acceptedPhase === "intro";
  const showAcceptedIdle =
    accepted && !!acceptedIdleSrc && (acceptedPhase === "idle" || !acceptedIntroSrc);
  // Countdown fades out the moment ACCEPT swaps us into the accepted state.
  const showCountdown = !accepted;

  const layerBase =
    "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto object-contain";
  const fade = { transition: "opacity var(--motion-crossfade)" } as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] overflow-visible motion-reduce:hidden"
    >
      {/* Countdown ring — straight alpha overlay, plays forward once from mount */}
      <video
        src={countdownSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        className={layerBase}
        style={{ ...fade, width: VIDEO_RING_SCALE, opacity: showCountdown ? 1 : 0 }}
      />

      {/* Accepted intro — mounts only once accepted so it starts from frame 0 */}
      {accepted && acceptedIntroSrc && (
        <video
          src={acceptedIntroSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setAcceptedPhase("idle")}
          className={layerBase}
          style={{ ...fade, width: VIDEO_RING_SCALE, opacity: showAcceptedIntro ? 1 : 0 }}
        />
      )}

      {/* Accepted idle loop — the resting accepted ring */}
      {accepted && acceptedIdleSrc && (
        <video
          src={acceptedIdleSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={layerBase}
          style={{ ...fade, width: VIDEO_RING_SCALE, opacity: showAcceptedIdle ? 1 : 0 }}
        />
      )}
    </div>
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
 *
 * When `countdownVideoSrc` is supplied, the WAD ready-check ring videos overlay
 * the circle (registered to the gold ring) as the visual timer: countdown ring
 * on mount, swapping to the accepted intro→idle loop when `accepted` flips true.
 * The video is a straight-alpha overlay, `pointer-events-none`, and hidden under
 * `prefers-reduced-motion` — in which case the #299 CSS ring sweep remains. The
 * video is decorative sync only and NEVER drives `secondsRemaining`.
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
  countdownVideoSrc,
  acceptedIntroVideoSrc,
  acceptedIdleVideoSrc,
  accepted = false,
}: MatchFoundModalProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const glowId = `${uid}-arc-glow`;
  const crestGradId = `${uid}-crest-grad`;

  if (!open) return null;

  const arcFraction = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsRemaining / totalSeconds)) : 1;

  // Entrance keyframe names are scoped to this instance's useId so multiple
  // mounted modals (or showcase remounts) never collide. `sweep` draws the teal
  // arc around the ring on mount; `enter` scales+fades the modal in with snap
  // easing; `pulse` gives ACCEPT a subtle attention glow. All timing/easing
  // comes from the Hextech motion tokens — zero ad-hoc bezier/duration literals.
  const scope = uid.replace(/[^a-zA-Z0-9-]/g, "");
  const kfSweep = `mfm-sweep-${scope}`;
  const kfEnter = `mfm-enter-${scope}`;
  const kfPulse = `mfm-pulse-${scope}`;

  return (
    <>
      {/* Instance-scoped entrance keyframes. prefers-reduced-motion disables all
          three so the modal appears instantly, fully visible (no sweep/scale). */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes ${kfEnter} {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes ${kfSweep} {
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
}
@keyframes ${kfPulse} {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}
.mfm-enter-${scope} {
  animation: ${kfEnter} var(--motion-snap) both;
}
.mfm-sweep-${scope} {
  animation: ${kfSweep} var(--motion-soft) backwards;
}
.mfm-pulse-${scope} {
  animation: ${kfPulse} var(--motion-crossfade) 2;
}
@media (prefers-reduced-motion: reduce) {
  .mfm-enter-${scope},
  .mfm-sweep-${scope},
  .mfm-pulse-${scope} {
    animation: none;
  }
}
`,
        }}
      />

      {/* 1. Full-screen backdrop — not dismissible, no onClick */}
      <div aria-hidden="true" className="fixed inset-0 z-50 bg-hextech-black/70" />

      {/* 2. Outer wrapper — centers the circle + the DECLINE below it */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">

        {/* 3. Circle container (the modal) */}
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`relative w-[480px] h-[480px] mfm-enter-${scope}`}
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

          {/* 6. Countdown arc SVG — rotated -90° so arc starts at top.
              When a countdown video is supplied it becomes the visual ring, so the
              CSS arc is hidden under motion-safe (no double ring) but stays visible
              under prefers-reduced-motion (where the video layer is hidden). Without
              a video, the CSS arc is always the timer, unchanged from #299. */}
          <svg
            className={`absolute inset-0 w-full h-full -rotate-90${
              countdownVideoSrc ? " motion-safe:hidden" : ""
            }`}
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
              className={`mfm-sweep-${scope}`}
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

          {/* 6b. Timer video overlay — WAD ready-check ring videos registered to
              the gold ring. Additive: renders only when a countdown video URL is
              supplied, and hides itself under prefers-reduced-motion so the CSS
              ring above stays the fallback. Presentational sync only. */}
          {countdownVideoSrc && (
            <TimerVideoOverlay
              countdownSrc={countdownVideoSrc}
              acceptedIntroSrc={acceptedIntroVideoSrc}
              acceptedIdleSrc={acceptedIdleVideoSrc}
              accepted={accepted}
            />
          )}

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
            <AcceptTrapezoid onClick={onAccept} pulseClass={`mfm-pulse-${scope}`} />
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
