"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Static mastery crest glyph — always-rendered fallback beneath the video layer
// ---------------------------------------------------------------------------

/**
 * Static mastery crest glyph — the always-visible fallback under the crest video
 * layer, so the overlay reads correctly when the video is absent, still loading,
 * blocked, or suppressed under reduced motion. Mirrors the resting pose of the
 * real celebration crests (see the probe frames in the PR): a bronze-gold shield
 * cartouche flanked by two swept wings, cradling a central gem whose colour warms
 * from green through gold as the level climbs (a props-free approximation — the
 * live clips carry the exact per-level art).
 */
function MasteryCrestGlyph({ uid }: { uid: string }) {
  const goldGrad = `${uid}-gold`;
  const gemGrad = `${uid}-gem`;
  return (
    <svg
      viewBox="0 0 200 160"
      aria-hidden="true"
      className="h-full w-full"
      style={{
        filter:
          "drop-shadow(0 0 14px color-mix(in srgb, var(--color-gold-3) 45%, transparent))",
      }}
    >
      <defs>
        <linearGradient id={goldGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-cream)" />
          <stop offset="55%" stopColor="var(--color-gold-3)" />
          <stop offset="100%" stopColor="var(--color-gold-4)" />
        </linearGradient>
        <radialGradient id={gemGrad} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="var(--color-honor-green-bright)" />
          <stop offset="100%" stopColor="var(--color-honor-green)" />
        </radialGradient>
      </defs>

      {/* Swept wings — three tapering blades either side of the central shield. */}
      <g fill={`url(#${goldGrad})`} stroke="var(--color-hextech-black)" strokeWidth="1.5">
        <path d="M78 66 L40 54 L58 66 Z" />
        <path d="M78 78 L34 72 L58 78 Z" />
        <path d="M78 90 L40 92 L60 88 Z" />
        <path d="M122 66 L160 54 L142 66 Z" />
        <path d="M122 78 L166 72 L142 78 Z" />
        <path d="M122 90 L160 92 L140 88 Z" />
      </g>

      {/* Central shield cartouche cradling the gem. */}
      <path
        d="M84 52 C84 48 88 46 92 46 H108 C112 46 116 48 116 52 V96 C116 108 108 118 100 124 C92 118 84 108 84 96 Z"
        fill={`url(#${goldGrad})`}
        stroke="var(--color-hextech-black)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Recessed inner well behind the gem. */}
      <path
        d="M90 58 H110 V94 C110 103 105 110 100 114 C95 110 90 103 90 94 Z"
        fill="var(--color-hextech-black)"
        opacity="0.55"
      />
      {/* Mastery gem. */}
      <circle cx="100" cy="86" r="11" fill={`url(#${gemGrad})`} stroke={`url(#${goldGrad})`} strokeWidth="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Crest video layer — one-shot reveal that end-holds on its resting pose
// ---------------------------------------------------------------------------

/**
 * The mastery crest celebration clip. Unlike the honor crest (a straight-alpha
 * intro → loop → outro machine), the mastery level clips are a single opaque
 * one-shot on a BLACK field: the crest reveals, flares an aurora burst, and
 * settles on a stable resting pose it holds on its last frame. So there is no
 * loop or outro to sequence — the clip plays once and `<video>` naturally freezes
 * on the final frame (`loop` off), giving the resting-crest end-hold for free.
 *
 * Composited with `mix-blend-mode: screen` so the black field drops out and only
 * the crest adds over the starfield backdrop. Hidden under reduced motion — the
 * static crest glyph swaps in to carry the surface.
 */
function MasteryCrestVideoLayer({ src }: { src: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] motion-reduce:hidden"
    >
      <video
        key={src}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

export interface MasteryCelebrationOverlayProps {
  /**
   * Mastery level reached (1–10), used to build the default title
   * "MASTERY LEVEL {level}". Purely presentational — the caller supplies the
   * matching `crestVideo` URL from `@low/fixtures` (`masteryCelebrationVideoUrl`).
   */
  level: number;
  /**
   * Center crest celebration video URL, supplied by pages/showcase from
   * `@low/fixtures` (`masteryCelebrationVideoUrl(level)`). Optional — when omitted
   * (or under reduced motion) the static SVG crest glyph swaps in, so the surface
   * still reads correctly. NO fetching in `@low/ui`.
   */
  crestVideo?: string;
  /**
   * Optional full-frame backdrop video URL (`masteryCelebrationBackgroundUrl()`),
   * an opaque starfield loop layered full-frame behind the crest. Because it is
   * opaque it fully replaces the gradient backdrop when supplied. Omit for the
   * gradient-only backdrop.
   */
  backdropVideo?: string;
  /**
   * Called exactly once when the celebration is dismissed — the user clicked OK,
   * clicked/tapped the backdrop, or pressed Escape. Fires after the ~300ms
   * fade-out. The dismiss starts the fade IMMEDIATELY; it never waits for the
   * crest clip to finish. Under `prefers-reduced-motion` it still only fires on
   * an explicit dismiss (the overlay has an OK button — it never auto-closes).
   * The consumer owns visibility: it should stop rendering the overlay here.
   */
  onFinished: () => void;
  /**
   * Overrides the default "MASTERY LEVEL {level}" title (rendered in
   * `font-display`, `text-gold-cream`).
   */
  title?: string;
  /**
   * Optional one-line subtitle beneath the title (muted grey-gold), e.g. the
   * champion name — "You've mastered Ahri".
   */
  subtitle?: string;
  /**
   * Label for the dismiss button.
   * @default "OK"
   */
  dismissLabel?: string;
  /**
   * Accessible label for the celebration dialog.
   * @default "Mastery celebration"
   */
  ariaLabel?: string;
}

/** Fade-out duration (ms) before onFinished is called on dismiss. */
const FADE_MS = 300;

/**
 * MasteryCelebrationOverlay renders the champion-mastery level-up celebration
 * full-screen: a deep-blue Hextech starfield backdrop, top/bottom gold hairline
 * rules, a `font-display` uppercase "MASTERY LEVEL {N}" title, an optional muted
 * subtitle, a centered animated mastery crest, and a gold OK button.
 *
 * NO CHROME REFERENCE. No public screenshot of the real mastery level-up overlay
 * chrome exists (four dry hunts — see issue #370). The layout is CONVENTION-BASED,
 * following the honor-checkpoint-overlay (#365) precedent, not a measured
 * reference — refine when a reference lands. The video assets, by contrast, ARE
 * the real client's (champion-mastery/cm-celebration-*.webm), so the crest and
 * backdrop motion are faithful; only the surrounding frame is best-effort.
 *
 * Crest video is a single opaque one-shot (probe-informed, issue #370): the
 * mastery clips reveal the crest, flare an aurora, then settle on a resting pose
 * they hold on the last frame — so the layer just plays once (no loop, no outro)
 * and `<video>` freezes on that final frame. It composites `mix-blend-mode:
 * screen` over the starfield (black field drops out). When no crest video is
 * supplied — or under reduced motion — the static SVG mastery crest glyph swaps
 * in over the backdrop (they are not stacked: the opaque screen-blended clip and
 * a differently-posed glyph would double the crest, so it is one or the other).
 *
 * Dismiss is a single idempotent path: OK button, backdrop click, or Escape all
 * start the fade-out IMMEDIATELY (they never wait for the crest clip to finish),
 * then fire `onFinished` once after ~300ms (a second Escape/click can't double-fire).
 *
 * Reduced motion: this surface has an OK button the user must press, so under
 * `prefers-reduced-motion: reduce` it still renders in full — just the static
 * crest glyph + backdrop, no crest video — and waits for an explicit dismiss. It
 * never auto-closes.
 *
 * Purely presentational: there is no live mastery trigger in the clone
 * (showcase-driven today); the consumer owns whether it mounts and stops
 * rendering it in response to `onFinished`.
 *
 * a11y: `role="dialog"`, `aria-modal`, labelled by `ariaLabel`. The crest/backdrop
 * videos are decorative (`aria-hidden`). The OK button is a real focusable button.
 */
export function MasteryCelebrationOverlay({
  level,
  crestVideo,
  backdropVideo,
  onFinished,
  title,
  subtitle,
  dismissLabel = "OK",
  ariaLabel = "Mastery celebration",
}: MasteryCelebrationOverlayProps) {
  const uid = useId();
  // fading drives the panel opacity transition; once true it never resets.
  const [fading, setFading] = useState(false);
  // Guards onFinished against firing twice (e.g. OK click + a second Escape).
  const finishedRef = useRef(false);

  const resolvedTitle = title ?? `MASTERY LEVEL ${level}`;

  // Single idempotent dismiss path: start the fade IMMEDIATELY (no waiting for
  // the crest clip), then hand off once after the fade.
  const requestDismiss = useCallback(() => {
    if (finishedRef.current) return;
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
        // Deep-blue Hextech radial over the base — the gradient fallback when no
        // starfield backdrop video is supplied (or under reduced motion the video
        // still plays; the gradient sits beneath it). Tokens only.
        backgroundColor: "var(--color-hextech-black)",
        backgroundImage:
          "radial-gradient(120% 90% at 50% 42%, color-mix(in srgb, var(--color-blue-6) 70%, transparent) 0%, color-mix(in srgb, var(--color-blue-7) 55%, transparent) 42%, var(--color-hextech-black) 80%)",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      {/* Full-frame starfield backdrop video (optional, opaque), behind everything. */}
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
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover motion-reduce:hidden"
        />
      )}

      {/* Centered content column, above the backdrop video. */}
      <div className="relative z-10 flex w-full max-w-[1100px] flex-col items-center px-8">
        {/* Top hairline rule. */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-4 to-transparent" />

        {/* Title + optional subtitle. */}
        <h2 className="mt-6 text-center font-display text-3xl uppercase tracking-[0.22em] text-gold-cream">
          {resolvedTitle}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center font-body text-sm tracking-wide text-grey-1">
            {subtitle}
          </p>
        )}

        {/* Center crest slot. The static glyph is the fallback: it always renders
            when no crest video is supplied, but when one IS supplied it is hidden
            (except under reduced motion, where the video layer hides and the glyph
            carries the surface). Unlike the honor crest's straight-alpha clip, the
            mastery clips are opaque black-field crests screen-blended over the
            backdrop — a differently scaled/posed glyph beneath would double the
            crest, so we swap rather than stack. */}
        <div className="relative my-8 h-[320px] w-[420px]">
          {crestVideo ? (
            <>
              {/* Reduced-motion fallback: the video layer is hidden, so show the glyph. */}
              <div className="absolute inset-0 hidden motion-reduce:block">
                <MasteryCrestGlyph uid={uid} />
              </div>
              <MasteryCrestVideoLayer src={crestVideo} />
            </>
          ) : (
            <MasteryCrestGlyph uid={uid} />
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
