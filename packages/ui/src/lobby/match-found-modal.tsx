"use client";

import { useId, useState } from "react";

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
   * URL for the game-mode/map crest displayed in the modal center.
   * NOTE: As of the fidelity pass (#564), the component no longer renders
   * this as a framed map crest — a bare gold "blind pick" overlapping-cards
   * glyph (inline SVG) is rendered instead. This prop is kept for API
   * compatibility; the passed value is not used. Pass undefined or any value.
   * @deprecated The crest is now an inline SVG glyph; this prop is ignored.
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
   * `accepted` wins if both `accepted` and `declined` are true.
   * @default false
   */
  accepted?: boolean;
  /**
   * WAD declined ring video (timer-declined.webm — the ring in its declined / red
   * state). Played once when `declined` flips true, holding the final frame.
   * `declined` and `accepted` are mutually exclusive; `accepted` wins if both are
   * set. Only meaningful alongside `countdownVideoSrc`.
   */
  declinedVideoSrc?: string;
  /**
   * When true, the video overlay swaps from the countdown ring to the declined
   * state (plays once, holds final frame). Presentational: the consumer sets it
   * when DECLINE fires and the modal remains mounted. `accepted` wins if both are
   * set. Defaults to false.
   * @default false
   */
  declined?: boolean;
}

// ---------------------------------------------------------------------------
// BlindPickGlyph — bare gold line-art "blind pick" overlapping-cards glyph.
//
// Two overlapping rounded-square card outlines with a diagonal slash through
// them — the real client's blind-pick mode icon, rendered as an inline SVG
// in gold-3/gold-4 strokes at ~55px (scaled via viewBox to fill the given size).
// NO square frame around it. SVG gradient id is passed in from parent useId.
// ---------------------------------------------------------------------------

function BlindPickGlyph({ gradientId, size = 55 }: { gradientId: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 55 55"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-3)" />
          <stop offset="100%" stopColor="var(--color-gold-4)" />
        </linearGradient>
      </defs>
      {/* Back card — offset up-left, rounded rect */}
      <rect
        x="5"
        y="5"
        width="33"
        height="33"
        rx="5"
        ry="5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.6"
      />
      {/* Front card — offset down-right, rounded rect */}
      <rect
        x="17"
        y="17"
        width="33"
        height="33"
        rx="5"
        ry="5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.6"
      />
      {/* Diagonal slash across the front card */}
      <line
        x1="17"
        y1="50"
        x2="50"
        y2="17"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AcceptRoundedRect — ACCEPT! button.
//
// Ref (#565): a wide rounded-rectangle inside the circle bottom — dark navy fill,
// bright glowing CYAN top border (dimmer teal sides/bottom), gold-cream "ACCEPT!"
// caps centered, subtle slightly-tapered ends. ~200px wide, ~44px tall.
// Keeps entrance pulse + hover brighten + onAccept + focus-visible + sr-only/a11y.
// ---------------------------------------------------------------------------

function AcceptRoundedRect({
  onClick,
  pulseClass,
}: {
  onClick: () => void;
  /** Instance-scoped entrance-pulse class applied to the glow overlay on mount. */
  pulseClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group",
        "relative",
        "inline-flex items-center justify-center",
        "rounded-[6px]",
        "cursor-pointer",
        // Focus ring (a11y)
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-blue-2)] focus-visible:outline-offset-2",
        // Drop shadow glow matching the cyan top edge
        "[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-cyan-1)_45%,transparent))]",
        "hover:[filter:drop-shadow(0_0_14px_color-mix(in_srgb,var(--color-cyan-1)_70%,transparent))]",
        "transition-[filter] duration-150",
      ].join(" ")}
      style={{ width: 200, height: 44 }}
    >
      {/* Dark navy fill */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[6px]"
        style={{
          background: "color-mix(in srgb, var(--color-navy-swirl) 80%, var(--color-blue-6) 20%)",
        }}
      />
      {/* Bright cyan top border — 2px thick, dimmer teal on sides/bottom */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[6px] pointer-events-none"
        style={{
          // Top edge bright cyan, sides/bottom dimmer teal
          boxShadow: [
            "inset 0 2px 0 color-mix(in srgb, var(--color-cyan-1) 90%, transparent)",
            "inset 0 -1px 0 color-mix(in srgb, var(--color-teal-ring) 60%, transparent)",
            "inset 1px 0 0 color-mix(in srgb, var(--color-teal-ring) 50%, transparent)",
            "inset -1px 0 0 color-mix(in srgb, var(--color-teal-ring) 50%, transparent)",
          ].join(", "),
        }}
      />
      {/* Hover brighten overlay */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{
          background: "color-mix(in srgb, var(--color-blue-2) 12%, transparent)",
        }}
      />
      {/* Active press overlay */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-[6px] opacity-0 group-active:opacity-100 transition-opacity duration-75"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 20%, transparent)",
        }}
      />
      {/* Entrance pulse glow overlay */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-[6px] opacity-0 ${pulseClass}`}
        style={{
          background: "color-mix(in srgb, var(--color-blue-2) 35%, transparent)",
        }}
      />
      {/* Label */}
      <span
        className="relative font-display text-sm tracking-[0.2em] uppercase text-gold-1 group-hover:text-gold-2 group-active:text-gold-2 transition-colors duration-150"
        style={{ letterSpacing: "0.2em" }}
      >
        Accept!
      </span>
    </button>
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
  declinedSrc,
  declined,
}: {
  countdownSrc: string;
  acceptedIntroSrc?: string;
  acceptedIdleSrc?: string;
  accepted: boolean;
  declinedSrc?: string;
  /** `accepted` wins if both are true. */
  declined: boolean;
}) {
  // Which accepted clip is currently showing. `intro` plays once then `onEnded`
  // advances to `idle`. This sequences video playback only — it derives nothing
  // about game state and adds no timers.
  const [acceptedPhase, setAcceptedPhase] = useState<"intro" | "idle">(
    acceptedIntroSrc ? "intro" : "idle",
  );

  // `accepted` wins if both flags are set.
  const effectiveAccepted = accepted;
  const effectiveDeclined = declined && !accepted;

  const showAcceptedIntro = effectiveAccepted && !!acceptedIntroSrc && acceptedPhase === "intro";
  const showAcceptedIdle =
    effectiveAccepted && !!acceptedIdleSrc && (acceptedPhase === "idle" || !acceptedIntroSrc);
  // Declined ring — plays once, holds final frame; fades in when declined, out when accepted.
  const showDeclined = effectiveDeclined && !!declinedSrc;
  // Countdown fades out the moment ACCEPT or DECLINE swaps us into another state.
  const showCountdown = !effectiveAccepted && !effectiveDeclined;

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

      {/* Declined ring — mounts only once declined so it starts from frame 0;
          plays once and holds the final frame (no loop). */}
      {effectiveDeclined && declinedSrc && (
        <video
          src={declinedSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={layerBase}
          style={{ ...fade, width: VIDEO_RING_SCALE, opacity: showDeclined ? 1 : 0 }}
        />
      )}

      {/* Accepted intro — mounts only once accepted so it starts from frame 0 */}
      {effectiveAccepted && acceptedIntroSrc && (
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
      {effectiveAccepted && acceptedIdleSrc && (
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
 * (parent-driven), ACCEPT rounded-rect inside the circle bottom, and DECLINE
 * tab on the circle's bottom bezel. The arc is the sole visual timer — countdown
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
 *
 * Frame (#564): Dark outer BEZEL band → bright cyan countdown arc (WAD video) →
 * thin complete solid GOLD ring → keyart disc. Crest is a bare gold "blind pick"
 * overlapping-cards glyph (inline SVG, no square frame). Title "MATCH FOUND!"
 * at text-3xl; subtitle uppercase + letter-spaced in component.
 *
 * Actions (#565): ACCEPT! is a rounded-rect with bright cyan top edge + glow,
 * dark navy fill, gold label. DECLINE is a compact tab on the circle's bottom
 * bezel — inside the 480px box, NOT floating below the circle.
 */
export function MatchFoundModal({
  open,
  secondsRemaining,
  totalSeconds = 10,
  onAccept,
  onDecline,
  subtitle,
  keyartSrc,
  countdownVideoSrc,
  acceptedIntroVideoSrc,
  acceptedIdleVideoSrc,
  accepted = false,
  declinedVideoSrc,
  declined = false,
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

      {/* 2. Outer wrapper — centers the circle; DECLINE now lives inside the circle */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">

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

          {/* 5. Ring system — outer bezel + thin solid gold ring.
              The bright cyan arc is the WAD video (TimerVideoOverlay below).
              Outer ring (r235): dark navy BEZEL band (stroke-width 10, dark fill).
              Inner gold ring (r224): thin complete solid gold-3 circle just inside. */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 480" aria-hidden="true">
            {/* Dark outer BEZEL band — sits between the circle edge and the cyan arc video */}
            <circle
              cx="240"
              cy="240"
              r="235"
              fill="none"
              stroke="color-mix(in srgb, var(--color-blue-6) 70%, var(--color-hextech-black) 30%)"
              strokeWidth="10"
            />
            {/* Thin complete solid GOLD ring — sits just inside the cyan arc.
                r=218: outer edge 218.75 < arc inner edge 223.5, so the ring
                is visually distinct from the teal arc (gap ≈ 4.75 px). */}
            <circle
              cx="240"
              cy="240"
              r="218"
              fill="none"
              stroke="var(--color-gold-3)"
              strokeWidth="1.5"
            />
          </svg>

          {/* 6. Countdown arc SVG — reduced-motion CSS fallback only.
              When a countdown video is supplied it becomes the visual ring, so the
              CSS arc is hidden under motion-safe (no double ring) but stays visible
              under prefers-reduced-motion (where the video layer is hidden). Without
              a video, the CSS arc is always the timer, unchanged from #299.
              Fallback arc is bright cyan (blue-2) with glow to match the video's
              bright cyan appearance as closely as possible. */}
          <svg
            className={`absolute inset-0 w-full h-full -rotate-90${
              countdownVideoSrc ? " motion-safe:hidden" : ""
            }`}
            viewBox="0 0 480 480"
            aria-hidden="true"
          >
            <defs>
              <filter id={glowId}>
                <feGaussianBlur stdDeviation="5" result="blur" />
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
              r="228"
              fill="none"
              stroke="var(--color-blue-2)"
              strokeWidth="9"
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
              declinedSrc={declinedVideoSrc}
              declined={declined}
            />
          )}

          {/* 7. Content stack — crest, title, subtitle, sr-only countdown */}
          <div className="absolute inset-0 flex flex-col items-center px-8" style={{ paddingTop: "80px", paddingBottom: "130px" }}>
            {/* Bare gold "blind pick" glyph — two overlapping rounded-square cards
                with a diagonal slash, no frame. Replaces the old MapCrestFrame/HexCrest. */}
            <BlindPickGlyph gradientId={crestGradId} size={55} />
            <h2
              id={titleId}
              className="font-display text-3xl uppercase text-gold-1 text-center mt-4"
              style={{ letterSpacing: "0.15em" }}
            >
              MATCH FOUND!
            </h2>
            {subtitle && (
              <p
                className="font-body text-xs text-gold-2 text-center mt-1 uppercase"
                style={{ letterSpacing: "0.12em" }}
              >
                {subtitle}
              </p>
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

          {/* 8. ACCEPT! rounded-rect — anchored inside the circle bottom (~78% down).
              Ref: ~200px wide, ~44px tall, dark navy fill, bright cyan top edge+glow,
              gold "ACCEPT!" centered. Replaces the old AcceptTrapezoid. */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ bottom: "52px" }}
          >
            <AcceptRoundedRect onClick={onAccept} pulseClass={`mfm-pulse-${scope}`} />
          </div>

          {/* 9. DECLINE tab — on the circle's bottom bezel (~96% down), inside the
              480px box. Compact gold-lined tab: thin gold-4/gold-5 top+bottom hairlines,
              dark fill, muted gold-1 label brightening on hover. NOT floating below. */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ bottom: "8px" }}
          >
            <button
              type="button"
              onClick={onDecline}
              className={[
                "relative",
                "inline-flex items-center justify-center",
                "px-5 py-1",
                "font-display text-[11px] uppercase tracking-[0.15em] leading-none",
                "cursor-pointer transition-colors duration-150",
                // Dark fill
                "bg-[color-mix(in_srgb,var(--color-hextech-black)_85%,var(--color-blue-6)_15%)]",
                // Thin gold hairlines top+bottom only
                "border-y border-[color-mix(in_srgb,var(--color-gold-5)_80%,var(--color-gold-4)_20%)]",
                // No side borders (matching the bezel tab look)
                "border-x-0",
                // Hover: hairlines brighten, fill lightens slightly
                "hover:border-[color-mix(in_srgb,var(--color-gold-4)_70%,var(--color-gold-3)_30%)]",
                "hover:bg-[color-mix(in_srgb,var(--color-hextech-black)_70%,var(--color-grey-4)_30%)]",
                // Label: muted gold, brightens on hover
                "text-[color-mix(in_srgb,var(--color-gold-1)_65%,var(--color-grey-1)_35%)]",
                "hover:text-gold-1",
                // Focus ring (a11y)
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3 focus-visible:outline-offset-2",
              ].join(" ")}
            >
              DECLINE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
