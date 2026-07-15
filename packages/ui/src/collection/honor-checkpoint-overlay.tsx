"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// Video-state crossfade. The real client sequences its magic-layer video states
// with ~250ms crossfades (docs/reference/HEXTECH-UI-NOTES.md); reuse the shared
// Hextech motion token --motion-crossfade so timing/easing stays centralized.
const VIDEO_CROSSFADE = "opacity var(--motion-crossfade)";

// ---------------------------------------------------------------------------
// Video sources
// ---------------------------------------------------------------------------

/**
 * Intro → loop → outro crest video URLs for the celebration's center emblem, all
 * supplied by pages/showcase from `@low/fixtures` (`honorCheckpointVideoUrl(...)`,
 * `honorLevelUpVideoUrl(...)`, `honorUnlockVideoUrl(...)`). All optional — the
 * static crest glyph always renders beneath, so a missing/broken/slow clip (or
 * reduced motion) never regresses the static look. NO fetching in `@low/ui`.
 */
export interface HonorCheckpointCrestVideo {
  /** One-shot reveal (600×650 / 450×419 straight-alpha webm); hands off to `loop`. */
  intro?: string;
  /** Idle loop (~14.5s) that rests while the overlay is open. */
  loop?: string;
  /** One-shot dismiss clip played on the way out (only some variants ship one). */
  outro?: string;
}

// ---------------------------------------------------------------------------
// Static crest glyph — always-rendered fallback beneath the video layer
// ---------------------------------------------------------------------------

/**
 * Static Honor crest glyph — the always-visible fallback under the crest video
 * layer, so the overlay reads correctly when videos are absent, still loading,
 * blocked, or suppressed under reduced motion. Mirrors the reference emblem
 * (docs/reference/client-honor-checkpoint-celebration.png): a bronze wreath —
 * a fan of gold petals cradling a green gem up top, a central gold cartouche,
 * and a base bar set with three green honor gems.
 */
function HonorCrestGlyph({ uid }: { uid: string }) {
  const goldGrad = `${uid}-gold`;
  const gemGrad = `${uid}-gem`;
  return (
    <svg
      viewBox="0 0 120 130"
      aria-hidden="true"
      className="h-full w-full"
      style={{
        filter:
          "drop-shadow(0 0 10px color-mix(in srgb, var(--color-honor-green) 40%, transparent))",
      }}
    >
      <defs>
        <linearGradient id={goldGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-cream)" />
          <stop offset="55%" stopColor="var(--color-gold-3)" />
          <stop offset="100%" stopColor="var(--color-gold-4)" />
        </linearGradient>
        <radialGradient id={gemGrad} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--color-honor-green-bright)" />
          <stop offset="100%" stopColor="var(--color-honor-green)" />
        </radialGradient>
      </defs>

      {/* Top petal fan — three gold blades sweeping up around the crown gem. */}
      <g fill="none" stroke={`url(#${goldGrad})`} strokeWidth="4" strokeLinecap="round">
        <path d="M60 44 C60 26 60 18 60 12" />
        <path d="M60 44 C44 34 36 28 30 20" />
        <path d="M60 44 C76 34 84 28 90 20" />
      </g>
      {/* Crown gem cradled by the fan. */}
      <circle cx="60" cy="40" r="6.5" fill={`url(#${gemGrad})`} stroke={`url(#${goldGrad})`} strokeWidth="2" />

      {/* Central cartouche — the stylised honor sigil under the crown. */}
      <path
        d="M46 52 C46 66 50 78 60 88 C70 78 74 66 74 52 C68 58 62 60 60 60 C58 60 52 58 46 52 Z"
        fill="none"
        stroke={`url(#${goldGrad})`}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Base bar with three honor gems. */}
      <path
        d="M30 100 C30 96 34 94 40 94 H80 C86 94 90 96 90 100 C90 108 82 114 60 116 C38 114 30 108 30 100 Z"
        fill="var(--color-hextech-black)"
        stroke={`url(#${goldGrad})`}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="103" r="5" fill={`url(#${gemGrad})`} />
      <circle cx="60" cy="104" r="6" fill={`url(#${gemGrad})`} />
      <circle cx="76" cy="103" r="5" fill={`url(#${gemGrad})`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Crest video layer — intro → loop → outro state machine
// ---------------------------------------------------------------------------

type CrestState = "intro" | "loop" | "outro" | "idle";

function CrestVideoLayer({
  video,
  dismissing,
}: {
  video: HonorCheckpointCrestVideo;
  /** True once the user has dismissed — advances the machine to the outro clip. */
  dismissing: boolean;
}) {
  // introDone flips once the intro one-shot ends (or immediately with no intro),
  // handing the resting state to the loop.
  const [introDone, setIntroDone] = useState(!video.intro);

  // Resolve the single active state, in priority order: outro (on dismiss) wins,
  // then the one-shot intro, then the ambient loop.
  let state: CrestState;
  if (dismissing && video.outro) {
    state = "outro";
  } else if (!introDone && video.intro) {
    state = "intro";
  } else if (video.loop || video.intro) {
    state = video.loop ? "loop" : "intro";
  } else {
    state = "idle";
  }

  // Stacked layers, each at its own opacity; only `state` is opaque. Keeping all
  // decoders warm avoids the remount stalls a single swapping <video src> hits.
  const layers: {
    key: CrestState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    { key: "loop", src: video.loop, loop: true },
    { key: "intro", src: video.intro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "outro", src: video.outro, loop: false },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] motion-reduce:hidden"
    >
      {layers.map(({ key, src, loop, onEnded }) =>
        src ? (
          <video
            key={key}
            src={src}
            autoPlay
            loop={loop}
            muted
            playsInline
            preload="auto"
            onEnded={onEnded}
            className="absolute inset-0 h-full w-full"
            style={{
              objectFit: "contain",
              opacity: state === key ? 1 : 0,
              transition: VIDEO_CROSSFADE,
            }}
          />
        ) : null,
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

export interface HonorCheckpointOverlayProps {
  /**
   * Uppercase celebration title, rendered in `font-display` (`text-gold-cream`).
   * e.g. "CHECKPOINT REACHED" | "HONOR LEVEL UP" | "HONOR UNLOCKED".
   */
  title: string;
  /**
   * One-line subtitle beneath the title (muted grey-gold), e.g.
   * "You've reached the last checkpoint before Honor level 3".
   */
  subtitle: string;
  /**
   * Intro → loop → outro crest video URLs for the center emblem, supplied by
   * pages from `@low/fixtures`. All optional; the static crest glyph renders
   * beneath so the overlay is correct without any video.
   */
  crestVideo?: HonorCheckpointCrestVideo;
  /**
   * Optional full-frame ambient/transition video URL (e.g.
   * `honorTransitionVideoUrl()` or `honorVotingBgVideoUrl()`), layered full-frame
   * behind the crest. Omit for the gradient-only backdrop.
   */
  backdropVideo?: string;
  /**
   * Called exactly once when the celebration is dismissed — the user clicked OK,
   * clicked/tapped the backdrop, or pressed Escape. Fires after the ~300ms
   * fade-out. The dismiss starts the fade IMMEDIATELY; the crest outro (if any)
   * plays underneath during the fade but never delays onFinished. Under
   * `prefers-reduced-motion` it still only fires on an explicit dismiss (the
   * overlay has an OK button — it never auto-closes). The consumer owns
   * visibility: it should stop rendering the overlay here.
   */
  onFinished: () => void;
  /**
   * Label for the dismiss button.
   * @default "OK"
   */
  dismissLabel?: string;
  /**
   * Accessible label for the celebration dialog.
   * @default "Honor celebration"
   */
  ariaLabel?: string;
}

/** Fade-out duration (ms) before onFinished is called on dismiss. */
const FADE_MS = 300;

/**
 * HonorCheckpointOverlay renders the in-client Honor celebration full-screen:
 * an atmospheric dark-forest backdrop, top/bottom hairline rules, a `font-display`
 * uppercase title, a muted subtitle, a centered animated honor crest, and a gold
 * OK button. Covers the "CHECKPOINT REACHED", "HONOR LEVEL UP", and "HONOR
 * UNLOCKED" surfaces (all the same layout, different title/crest video).
 *
 * Purely presentational: the consumer owns whether it mounts (there is no live
 * honor trigger in the clone — showcase-driven today) and stops rendering it in
 * response to `onFinished`.
 *
 * Crest video is a state machine: `crestVideo.intro` plays once → `loop` idles →
 * on dismiss, `outro` plays once (if supplied) underneath the fade. `backdropVideo`
 * (transition_green / voting_bg) layers full-frame behind. All clips composite
 * over the gradient backdrop, so any missing/broken clip leaves the static crest
 * glyph + gradient intact.
 *
 * Dismiss is a single idempotent path: OK button, backdrop click, or Escape all
 * start the fade-out IMMEDIATELY (the crest advances to its outro and plays
 * underneath during the ~300ms fade, but never delays the handoff), then fire
 * `onFinished` once after the fade (a second Escape/click can't double-fire).
 *
 * Reduced motion: unlike a skip-on-mount celebration, this surface has an OK
 * button the user must press, so under `prefers-reduced-motion: reduce` it still
 * renders in full — just the static crest glyph + gradient, no video — and waits
 * for an explicit dismiss. It never auto-closes.
 *
 * a11y: `role="dialog"`, `aria-modal`, labelled by `ariaLabel`. The crest/backdrop
 * videos are decorative (`aria-hidden`). The OK button is a real focusable button.
 */
export function HonorCheckpointOverlay({
  title,
  subtitle,
  crestVideo,
  backdropVideo,
  onFinished,
  dismissLabel = "OK",
  ariaLabel = "Honor celebration",
}: HonorCheckpointOverlayProps) {
  const uid = useId();
  // dismissing flips on the first dismiss request; it advances the crest machine
  // to its outro, which plays underneath the fade (it never gates the handoff).
  const [dismissing, setDismissing] = useState(false);
  // fading drives the panel opacity transition; once true it never resets.
  const [fading, setFading] = useState(false);
  // Guards onFinished against firing twice (e.g. OK click + a second Escape).
  const finishedRef = useRef(false);

  // Single idempotent dismiss path: advance the crest to its outro AND start the
  // fade IMMEDIATELY (no waiting for the outro to finish), then hand off once.
  const requestDismiss = useCallback(() => {
    if (finishedRef.current) return;
    setDismissing(true);
    setFading(true);
    window.setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinished();
    }, FADE_MS);
  }, [onFinished]);

  // Escape dismisses (same idempotent path as OK / backdrop click).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestDismiss]);

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      aria-modal="true"
      onClick={requestDismiss}
      className="fixed inset-0 z-[100] flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{
        // Dark forest ambience — deep green-black radial over the hextech base,
        // per the known-divergence gradient rule (CDragon-unavailable forest art;
        // the crest/backdrop webms are the real motion). Tokens only.
        backgroundColor: "var(--color-hextech-black)",
        backgroundImage:
          "radial-gradient(120% 90% at 50% 42%, color-mix(in srgb, var(--color-honor-forest) 92%, transparent) 0%, color-mix(in srgb, var(--color-honor-forest) 55%, transparent) 40%, var(--color-hextech-black) 78%)",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      {/* Full-frame ambient/transition backdrop video (optional), behind everything. */}
      {backdropVideo && (
        <video
          aria-hidden="true"
          key={backdropVideo}
          src={backdropVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-60 motion-reduce:hidden"
        />
      )}

      {/* Centered content column, above the backdrop video. */}
      <div className="relative z-10 flex w-full max-w-[1100px] flex-col items-center px-8">
        {/* Top hairline rule. */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-4 to-transparent" />

        {/* Title + subtitle. */}
        <h2 className="mt-6 text-center font-display text-3xl uppercase tracking-[0.22em] text-gold-cream">
          {title}
        </h2>
        <p className="mt-2 text-center font-body text-sm tracking-wide text-grey-1">
          {subtitle}
        </p>

        {/* Center crest slot — static glyph with the video machine layered over. */}
        <div className="relative my-8 h-[300px] w-[280px]">
          <HonorCrestGlyph uid={uid} />
          {crestVideo && (crestVideo.intro || crestVideo.loop || crestVideo.outro) && (
            <CrestVideoLayer video={crestVideo} dismissing={dismissing} />
          )}
        </div>

        {/* OK button — gold-2 border + gold text pill. Stops the backdrop click so
            it is the same idempotent dismiss path, not a double-trigger. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            requestDismiss();
          }}
          className="rounded-sm border border-gold-2 bg-hextech-black/60 px-8 py-1.5 font-display text-sm uppercase tracking-[0.15em] text-gold-cream transition-colors hover:bg-gold-2/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-2"
        >
          {dismissLabel}
        </button>

        {/* Bottom hairline rule. */}
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-gold-4 to-transparent" />
      </div>
    </div>
  );
}
