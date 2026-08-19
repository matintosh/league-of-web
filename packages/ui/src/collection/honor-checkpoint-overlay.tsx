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
 * blocked, or suppressed under reduced motion.
 *
 * Best-effort hand-drawn approximation (no CDragon asset reachable — 9 candidate
 * paths all 404'd). Mirrors the reference emblem
 * (docs/reference/client-honor-checkpoint-celebration.png): a unified arch-wreath
 * medallion — a rounded shield/medallion outline with a continuous wreath arch
 * framing the silhouette + a center gem, forming one connected shape (NOT 3
 * detached stroke blades). The wreath reads as a series of leaf pairs arching
 * from base to crown, enclosing a center sigil gem, with a bottom base bar set
 * with three honor gems.
 */
function HonorCrestGlyph({ uid }: { uid: string }) {
  const goldGrad = `${uid}-gold`;
  const gemGrad = `${uid}-gem`;
  const shieldClip = `${uid}-shield-clip`;
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
        {/* Clip path for the unified medallion silhouette — rounded shield outline
            that narrows to a pointed base. All wreath detail is clipped to this shape
            so the glyph reads as one connected medallion, not separate pieces. */}
        <clipPath id={shieldClip}>
          <path d="M60 8 C34 8 20 22 20 44 C20 72 36 92 60 112 C84 92 100 72 100 44 C100 22 86 8 60 8 Z" />
        </clipPath>
      </defs>

      {/* ── Medallion outline (the continuous arch-wreath cartouche) ──────────── */}
      {/* Outer shield border — the single connected wreath-medallion silhouette. */}
      <path
        d="M60 8 C34 8 20 22 20 44 C20 72 36 92 60 112 C84 92 100 72 100 44 C100 22 86 8 60 8 Z"
        fill="none"
        stroke={`url(#${goldGrad})`}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Inner outline — tighter offset gives a wreath-frame double-line feel. */}
      <path
        d="M60 14 C38 14 26 26 26 44 C26 70 40 89 60 107 C80 89 94 70 94 44 C94 26 82 14 60 14 Z"
        fill="none"
        stroke={`url(#${goldGrad})`}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* ── Wreath leaf pairs arching up the sides ──────────────────────────── */}
      {/* Each leaf pair is a mirrored bezier lobe — left and right — climbing the
          flanks of the medallion, giving the impression of a continuous wreath
          encircling the center sigil. Tokens-only stroke (gold gradient). */}
      <g fill="none" stroke={`url(#${goldGrad})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Bottom pair — widest, near the base */}
        <path d="M34 82 C28 74 26 64 30 56 C36 62 38 72 34 82 Z" fill={`url(#${goldGrad})`} opacity="0.7" />
        <path d="M86 82 C92 74 94 64 90 56 C84 62 82 72 86 82 Z" fill={`url(#${goldGrad})`} opacity="0.7" />
        {/* Middle pair */}
        <path d="M30 56 C24 46 25 36 30 28 C36 34 37 46 30 56 Z" fill={`url(#${goldGrad})`} opacity="0.65" />
        <path d="M90 56 C96 46 95 36 90 28 C84 34 83 46 90 56 Z" fill={`url(#${goldGrad})`} opacity="0.65" />
        {/* Upper pair — narrower, near the crown */}
        <path d="M30 28 C28 20 34 14 42 12 C44 20 40 28 30 28 Z" fill={`url(#${goldGrad})`} opacity="0.6" />
        <path d="M90 28 C92 20 86 14 78 12 C76 20 80 28 90 28 Z" fill={`url(#${goldGrad})`} opacity="0.6" />
      </g>

      {/* ── Center sigil fill ────────────────────────────────────────────────── */}
      {/* Dark interior behind the center gem so it reads against the wreath. */}
      <path
        d="M60 20 C44 20 36 30 36 44 C36 60 46 74 60 86 C74 74 84 60 84 44 C84 30 76 20 60 20 Z"
        fill="var(--color-hextech-black)"
        opacity="0.75"
      />
      {/* Inner cartouche outline — echoes the shield shape inside the wreath. */}
      <path
        d="M60 20 C44 20 36 30 36 44 C36 60 46 74 60 86 C74 74 84 60 84 44 C84 30 76 20 60 20 Z"
        fill="none"
        stroke={`url(#${goldGrad})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* ── Crown gem — top of the center sigil ─────────────────────────────── */}
      <circle cx="60" cy="30" r="7" fill={`url(#${gemGrad})`} stroke={`url(#${goldGrad})`} strokeWidth="2" />
      {/* Crown gem highlight glint */}
      <circle cx="57.5" cy="27.5" r="2" fill="var(--color-honor-green-bright)" opacity="0.7" />

      {/* Center accent — a smaller gem midpoint of the cartouche. */}
      <circle cx="60" cy="56" r="4.5" fill={`url(#${gemGrad})`} stroke={`url(#${goldGrad})`} strokeWidth="1.5" opacity="0.85" />

      {/* ── Base bar with three honor gems ──────────────────────────────────── */}
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
// Honor orb — small inline icon for the reward count in the dismiss button
// ---------------------------------------------------------------------------

/**
 * Tiny honor-orb icon rendered inline inside the OK button when a `reward` is
 * supplied. A filled circle + inner highlight glint in `--color-honor-green`,
 * matching the honor gems in the crest. Sized to the surrounding text baseline.
 */
function HonorOrbIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="inline-block h-[0.9em] w-[0.9em] align-middle"
    >
      <circle cx="7" cy="7" r="6.5" fill="var(--color-honor-green)" />
      <circle cx="5.5" cy="5" r="2" fill="var(--color-honor-green-bright)" opacity="0.6" />
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
  /**
   * Optional honor reward count to display in the dismiss button alongside the
   * label. When provided (>0), the button renders: the label text, then a small
   * green honor-orb icon and `+{reward}` count in `--color-honor-green`. This
   * matches the "OK +3" CTA shown in the reference (docs/reference/client-honor-
   * checkpoint-celebration.png). Omit (or pass 0) to show the label alone.
   */
  reward?: number;
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
 * The `reward` prop (optional) appends a small honor-orb icon + `+{reward}` count
 * in honor-green inside the dismiss button, e.g. "OK ● +3" — matching the
 * reference CTA in docs/reference/client-honor-checkpoint-celebration.png.
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
  reward,
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
            it is the same idempotent dismiss path, not a double-trigger.
            When `reward` > 0, appends a small honor-orb icon + "+{reward}" count
            in honor-green, matching the "OK +3" CTA in the reference screenshot. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            requestDismiss();
          }}
          className="flex items-center gap-1.5 rounded-sm border border-gold-2 bg-hextech-black/60 px-8 py-1.5 font-display text-sm uppercase tracking-[0.15em] text-gold-cream transition-colors hover:bg-gold-2/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-2"
        >
          {dismissLabel}
          {reward != null && reward > 0 && (
            <span
              className="flex items-center gap-1 normal-case tracking-normal"
              style={{ color: "var(--color-honor-green)" }}
            >
              <HonorOrbIcon />
              +{reward}
            </span>
          )}
        </button>

        {/* Bottom hairline rule. */}
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-gold-4 to-transparent" />
      </div>
    </div>
  );
}
