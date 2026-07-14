"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// Video-state crossfade. The real client sequences its magic-layer video states
// with ~250ms crossfades (docs/reference/HEXTECH-UI-NOTES.md); we reuse the
// shared Hextech motion token --motion-crossfade (authored for exactly this
// video-state-machine use in packages/tokens/src/theme.css) so timing/easing
// stays centralized rather than ad-hoc per component.
const VIDEO_CROSSFADE = "opacity var(--motion-crossfade)";

// ---------------------------------------------------------------------------
// Video sources
// ---------------------------------------------------------------------------

/**
 * Real-client Your Shop navbar-icon magic videos (issue #317), one URL per
 * state. All optional — a state's video only layers when its URL is supplied,
 * and the static CSS/SVG glyph always renders beneath, so a missing or broken
 * clip never regresses the static look. Pages/showcase supply URLs from
 * `@low/fixtures` (`yourShopIconVideoUrl(...)`); NO fetching happens in
 * `@low/ui`.
 */
export interface YourShopIconVideoSources {
  /** One-shot attention reveal — gold glyph bursts in with radial rays; hands off to `ctaLoop`. */
  ctaIntro?: string;
  /** Ambient attention loop — gentle gold shimmer/pulse that idles to draw the eye. */
  ctaLoop?: string;
  /** One-shot activate burst — bright white flash fired once when the icon is clicked. */
  click?: string;
}

// ---------------------------------------------------------------------------
// Static glyph — always-rendered fallback beneath the video layer
// ---------------------------------------------------------------------------

/**
 * Static Hextech "shop" glyph — the always-visible fallback under the CTA video
 * layer. A gold hexagonal badge with a stylised shopping-bag mark, so the icon
 * reads correctly when videos are absent, still loading, blocked, or suppressed
 * under reduced motion.
 */
function ShopGlyph({ uid }: { uid: string }) {
  const badgeGrad = `${uid}-badge`;
  const bagGrad = `${uid}-bag`;
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-full w-full"
      style={{ filter: "drop-shadow(0 0 4px color-mix(in srgb, var(--color-gold-2) 45%, transparent))" }}
    >
      <defs>
        <linearGradient id={badgeGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-3)" />
          <stop offset="100%" stopColor="var(--color-gold-5)" />
        </linearGradient>
        <linearGradient id={bagGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-cream)" />
          <stop offset="100%" stopColor="var(--color-gold-2)" />
        </linearGradient>
      </defs>

      {/* Hex badge plate */}
      <polygon
        points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
        fill="var(--color-hextech-black)"
        stroke={`url(#${badgeGrad})`}
        strokeWidth="2"
      />

      {/* Shopping-bag mark: rounded body + handle */}
      <path
        d="M17 21h14l-1.4 12.5a2 2 0 0 1-2 1.8H20.4a2 2 0 0 1-2-1.8L17 21z"
        fill="none"
        stroke={`url(#${bagGrad})`}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 21v-2.5a4 4 0 0 1 8 0V21"
        fill="none"
        stroke={`url(#${bagGrad})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CTA video layer — intro → loop attention state machine
// ---------------------------------------------------------------------------

type CtaVideoState = "ctaIntro" | "ctaLoop" | "click" | "idle";

function YourShopIconVideoLayer({
  sources,
  clickTick,
}: {
  sources: YourShopIconVideoSources;
  /** Bumped on every activation to (re)fire the one-shot click burst. */
  clickTick: number;
}) {
  // introDone flips once the CTA intro one-shot finishes (or immediately when
  // there is no intro clip), handing the resting state to the loop.
  const [introDone, setIntroDone] = useState(!sources.ctaIntro);
  // clickPlaying plays the one-shot click burst; it never blocks the trigger.
  const [clickPlaying, setClickPlaying] = useState(false);
  const seenClickTick = useRef(clickTick);

  // Detect a new click tick → fire the click burst one-shot (fire-and-proceed;
  // the parent's onActivate already ran, so this is purely a visual accent).
  useEffect(() => {
    if (clickTick !== seenClickTick.current) {
      seenClickTick.current = clickTick;
      if (sources.click) setClickPlaying(true);
    }
  }, [clickTick, sources.click]);

  // Resolve the single active state, in priority order: click burst wins, then
  // the one-shot intro, then the ambient loop.
  let state: CtaVideoState;
  if (clickPlaying && sources.click) {
    state = "click";
  } else if (!introDone && sources.ctaIntro) {
    state = "ctaIntro";
  } else if (sources.ctaLoop || sources.ctaIntro) {
    state = sources.ctaLoop ? "ctaLoop" : "ctaIntro";
  } else {
    state = "idle";
  }

  // Stacked layers, each at its own opacity; only `state` is opaque. Keeping all
  // decoders warm avoids the remount stalls a single swapping <video src> hits.
  const layers: {
    key: CtaVideoState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    { key: "ctaLoop", src: sources.ctaLoop, loop: true },
    { key: "ctaIntro", src: sources.ctaIntro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "click", src: sources.click, loop: false, onEnded: () => setClickPlaying(false) },
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

export interface YourShopIconProps {
  /**
   * Called when the icon is activated (click / Enter / Space). Fires
   * immediately so navigation is never gated on the video — the click burst
   * plays as a fire-and-proceed accent afterwards.
   */
  onActivate?: () => void;
  /**
   * Real-client Your Shop navbar-icon magic videos (issue #317). When provided,
   * the matching webm layers over the static glyph as an attention CTA:
   * `ctaIntro` plays once on mount → `ctaLoop` idles to draw the eye; `click`
   * fires once on activation without blocking. Omit entirely (or per-state) to
   * keep the pure static glyph. Videos are additive — pointer-events-none, sit
   * over the static glyph (which shows through their alpha), and are fully
   * suppressed under `prefers-reduced-motion: reduce`.
   *
   * Pages supply these from `@low/fixtures` (`yourShopIconVideoUrl`).
   */
  videoSources?: YourShopIconVideoSources;
  /**
   * Accessible label for the trigger.
   * @default "Your Shop"
   */
  label?: string;
  /**
   * Rendered box size in px (square). The real navbar icon is small (~40px);
   * the CTA videos are authored at 120×120 and scale down via object-contain.
   * @default 40
   */
  size?: number;
  /** Extra classes appended to the trigger button. */
  className?: string;
}

/**
 * YourShopIcon — the top-nav "Your Shop" entry-point icon with the real-client
 * attention CTA (issue #317).
 *
 * Live-client entry-point gap: the app currently has no navbar/store trigger
 * that opens `YourShopScreen` (it is showcase-only), so per the issue this CTA
 * icon is added as the store-screen entry point — `YourShopScreen` renders it
 * in its header and forwards `onActivate`. It is also independently browsable in
 * the showcase.
 *
 * Behaviour: a static gold Hextech shop glyph always renders. When
 * `videoSources` are supplied, the CTA video state machine layers over it —
 * `ctaIntro` plays once, then `ctaLoop` idles as an attention loop; on
 * activation `onActivate` fires immediately (navigation is never gated on the
 * video) and the `click` burst plays as a fire-and-proceed accent. The video
 * layer is `pointer-events-none` so the button stays clickable, and is hidden
 * entirely under `prefers-reduced-motion: reduce` (the static glyph remains).
 */
export function YourShopIcon({
  onActivate,
  videoSources,
  label = "Your Shop",
  size = 40,
  className,
}: YourShopIconProps) {
  const uid = useId();

  // Only mount the video layer when at least one source is supplied — the static
  // glyph always renders beneath, so dropping the layer leaves the exact static
  // look (also the reduced-motion / JS-off fallback).
  const hasVideo = !!videoSources && Object.values(videoSources).some(Boolean);

  // Bumped on each activation to (re)fire the one-shot click burst. The video is
  // a pure accent; onActivate has already run by the time this changes.
  const [clickTick, setClickTick] = useState(0);

  const handleActivate = useCallback(() => {
    // Fire-and-proceed: run the callback first so navigation never waits on the
    // video, then bump the tick to play the click burst as a visual accent.
    onActivate?.();
    if (hasVideo) setClickTick((t) => t + 1);
  }, [onActivate, hasVideo]);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleActivate}
      className={[
        "relative inline-flex shrink-0 items-center justify-center",
        "cursor-pointer transition-transform duration-150",
        "hover:scale-105 active:scale-95",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
    >
      {/* Static glyph — always rendered; shows through the CTA video's alpha and
          is the sole content under reduced motion / when videos are absent. */}
      <ShopGlyph uid={uid} />

      {/* Real-client CTA video state machine (issue #317). pointer-events-none +
          motion-reduce:hidden inside the layer, so it never affects the hit area
          and vanishes under reduced motion. */}
      {hasVideo && videoSources && (
        <YourShopIconVideoLayer sources={videoSources} clickTick={clickTick} />
      )}
    </button>
  );
}
