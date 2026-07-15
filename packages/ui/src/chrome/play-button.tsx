"use client";

import React, { useId, useState, useCallback, useEffect, useRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { usePausedVideo } from "./use-paused-video";

// Video-state crossfade. The real client sequences its magic-button video
// states with ~250ms crossfades (docs/reference/HEXTECH-UI-NOTES.md); we use the
// shared Hextech motion token --motion-crossfade (authored for exactly this
// video-state-machine use in packages/tokens/src/theme.css) so timing/easing
// stays centralized rather than ad-hoc per component.
const VIDEO_CROSSFADE = "opacity var(--motion-crossfade)";

// ---------------------------------------------------------------------------
// Size map
//
// v4 geometry: XAML path M 0,0 L 103,0 L 118,14 L 103,28 L 0,28 C 10,14 0,0 Z
// Button 165×38. GoldLine starts at x=10. GreenLine margin 50 4 4 4 (from GoldLine).
// Arrow path margin 40 5 4 -5 (relative to GoldLine; so x=40 from GoldLine, y=5).
// Medallion (logo) height=38, sits at x=0, overlaps the GoldLine/GreenLine.
//
// Layout approach: fixed-width stack. Outer frame (GoldLine) has a fixed
// calculated width. Medallion is pulled left via negative margin on the row.
// Bar SVG fills the inner content area absolutely.
// ---------------------------------------------------------------------------

export type PlayButtonSize = "default" | "hero";

interface SizeConfig {
  /** Medallion outer diameter (px) */
  medallion: number;
  /** Socket circle diameter (px) — default state (v3 compat) */
  socket: number;
  /** Socket diameter when pressed */
  socketPressed: number;
  /** Arrow bar height from XAML (px) */
  bar: number;
  /** Arrow bar width = 118 scaled (px) */
  barWidth: number;
  /** x where bar starts narrowing into tip */
  tipNarrowX: number;
  /** y of tip point = bar/2 */
  tipY: number;
  /** bezier control x for concave left edge */
  concaveX: number;
  /** Total button height (XAML ToggleButton height=38, scaled) */
  totalH: number;
  /** Outer frame (GoldLine) width (px) */
  outerW: number;
  /** Left margin of outer frame (XAML: GoldLine margin-left=10, scaled) */
  outerMarginLeft: number;
  /** GreenLine left inset from GoldLine left edge (XAML: margin-left=50, scaled) */
  greenLeft: number;
  /** GreenLine margin on top/right/bottom (XAML: 4px, scaled) */
  greenMargin: number;
  /** Arrow SVG left offset from GoldLine left (XAML: Arrow margin-left=40, scaled) */
  arrowLeft: number;
  /** Arrow SVG top offset from GoldLine top (XAML: Arrow margin-top=5, scaled) */
  arrowTop: number;
  /** Text left padding inside bar = XAML TextBlock margin-left=30 (scaled) */
  textLeft: number;
  /**
   * Dark GoldLine backing plate that extends PAST the chevron tip (px).
   * The hi-res reference (docs/reference/play-button-hires-full.png) keeps ~0.26×
   * bar-height of bronze frame to the right of the teal chevron before the frame
   * ends; the raw XAML had almost none. This lengthens the outer frame's right run
   * only — it does NOT move the chevron tip, the fill region, or the PLAY text —
   * so it corrects the frame's right proportion (and closes the #357 width-
   * normalized PLAY-cx residual) without disturbing fill-region centering.
   */
  backingExtend: number;
  /** Label font size (px) */
  fontSize: number;
  /** Corner leg length (px) */
  cornerLeg: number;
  /** Corner inset (px) */
  cornerInset: number;
  /** Press extend (px) */
  pressExtend: number;
}

function sc(v: number, s: number) { return Math.round(v * s); }

function makeSize(barH: number, extra: {
  medallion: number; socket: number; socketPressed: number;
  fontSize: number; cornerLeg: number; cornerInset: number; pressExtend: number;
}): SizeConfig {
  const s = barH / 28; // scale from XAML 1× (bar=28)
  // v7: the hi-res reference teal frame is wider than the raw XAML frame
  // (outerW-greenLeft ≈ 3.75:1 vs ref 5.42:1). `dx` lengthens only the straight
  // middle of the bar (chevron angle + concave-left edge + medallion overlap
  // unchanged) to nudge the frame toward the reference aspect without shrinking
  // the PLAY cap-height match. Modest value: over-widening scales the whole
  // button down in the width-normalized composite and undercuts cap-height.
  const dx = sc(14, s);
  // v9 (#357): backing plate past the chevron tip. Measured on the hi-res
  // reference the outer bronze GoldLine frame runs ~0.26× bar-height PAST the teal
  // chevron tip before it ends; the raw XAML backing was ~5px. Because the PLAY
  // label is centered in the FILL region (medallion inner edge → chevron
  // narrowing) and this only extends the frame to the RIGHT of the tip, growing
  // it lengthens the outer frame (widening the button box) WITHOUT moving the
  // chevron, the fill region, or the text — which is exactly the lever that pulls
  // the width-normalized PLAY center left toward the reference (cx≈504) that pure
  // straight-run `dx` widening could not (fill-centering drags the text right in
  // lockstep with the frame, leaving normalized-cx near-invariant). Empirically
  // tuned against tools/compare-ref.mjs; see #357.
  const bx = sc(30, s);
  return {
    ...extra,
    bar: barH,
    barWidth: sc(118, s) + dx,
    tipNarrowX: sc(103, s) + dx,
    tipY: Math.round(barH / 2),
    concaveX: sc(10, s),
    totalH: sc(38, s),
    outerW: sc(155, s) + dx + bx,   // XAML 165 - 10 left margin, + straight run (dx) + backing plate (bx)
    outerMarginLeft: sc(10, s),
    greenLeft: sc(50, s),
    greenMargin: sc(4, s),
    arrowLeft: sc(40, s),
    arrowTop: sc(5, s),
    textLeft: sc(30, s),
    backingExtend: bx,
  };
}

const SIZE_MAP: Record<PlayButtonSize, SizeConfig> = {
  default: makeSize(28, {
    // v7: cap height ≈ 38% of teal-bar height (was ~25%). Inter cap-height ratio
    // ≈ 0.73; fontSize ≈ 0.38·barH / 0.73. Fine-tuned to 15 vs composite (18 ran tall).
    // Medallion: reference gold-L is ~1.26× bar height and extends above AND below
    // the bar (was flush-to-bar at 44 → 1.57× but read small because the glyph only
    // filled 0.65×). Enlarged to 52 so the emblem reads at reference proportions.
    medallion: 52, socket: 52, socketPressed: 47,
    fontSize: 15, cornerLeg: 8, cornerInset: 3, pressExtend: 1.3,
  }),
  hero: makeSize(46, {
    medallion: 86, socket: 86, socketPressed: 78,
    fontSize: 25, cornerLeg: 13, cornerInset: 5, pressExtend: 2.2,
  }),
};

// ---------------------------------------------------------------------------
// SVG path builder
// ---------------------------------------------------------------------------

function barPath(cfg: SizeConfig): string {
  const { barWidth: bw, bar: bh, tipNarrowX: tx, tipY: ty, concaveX: ci } = cfg;
  return `M 0,0 L ${tx},0 L ${bw},${ty} L ${tx},${bh} L 0,${bh} C ${ci},${ty} 0,0 0,0 Z`;
}

// ---------------------------------------------------------------------------
// SVG gradient defs (per-instance, injected in a hidden 0×0 SVG)
// ---------------------------------------------------------------------------

interface GradDefsProps {
  dsId: string; // default stroke
  hsId: string; // hover stroke
  hfId: string; // hover fill
  glowId: string; // hover radial glow
}

function GradDefs({ dsId, hsId, hfId, glowId }: GradDefsProps) {
  return (
    <defs>
      {/* Default stroke: 3-stop 80%-alpha cyan — XAML #CC3FE7FF → #CC006D7D → #CC0493A7 */}
      <linearGradient id={dsId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="var(--color-cyan-1)"      stopOpacity="0.8" />
        <stop offset="50%"  stopColor="var(--color-teal-grad-b)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--color-teal-grad-a)" stopOpacity="0.8" />
      </linearGradient>
      {/* Hover stroke: 3-stop full-alpha bright cyan — XAML #AFF5FF → #46E6FF → #00ADD4 */}
      <linearGradient id={hsId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="var(--color-cyan-2)" stopOpacity="1" />
        <stop offset="50%"  stopColor="var(--color-cyan-3)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-cyan-4)" stopOpacity="1" />
      </linearGradient>
      {/* Hover fill: 2-stop vertical — XAML #1D3B4A → #082734 */}
      <linearGradient id={hfId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="var(--color-pb-hover-fill)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-navy-swirl)" stopOpacity="1" />
      </linearGradient>
      {/* Hover radial glow — magic-button "radial effects" layer (HEXTECH-UI-NOTES.md).
          Bright cyan bloom fading to transparent, drawn behind the frame on hover. */}
      <radialGradient id={glowId} cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stopColor="var(--color-cyan-1)" stopOpacity="0.5" />
        <stop offset="55%"  stopColor="var(--color-cyan-1)" stopOpacity="0.18" />
        <stop offset="100%" stopColor="var(--color-cyan-1)" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

// ---------------------------------------------------------------------------
// LeagueGlyph — 'L' mark SVG (v3-proven)
// ---------------------------------------------------------------------------

function LeagueGlyph({ size, gradId, greyed }: { size: number; gradId: string; greyed?: boolean }) {
  const p = "M5 2h4v13h7.5V18H5V2z M12.5 15h4v3h-4z";
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: size, height: size, overflow: "visible", filter: "drop-shadow(0 0 3px rgba(0,0,0,0.4))" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-gold-5)" />
          <stop offset="100%" stopColor="var(--color-gold-3)" />
        </linearGradient>
      </defs>
      <path d={p} fill={greyed ? "var(--color-grey-3)" : "var(--color-gold-3)"} />
      {!greyed && <path d={p} fill={`url(#${gradId})`} opacity={0.8} />}
      <path d={p} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth={2.25} strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Medallion — v3-proven disc + ring + glyph (or real emblem image)
// ---------------------------------------------------------------------------

function Medallion({ size, greyed, discId, glyphId, swirlId, emblemSrc, emblemHeight }: {
  size: number; greyed?: boolean; discId: string; glyphId: string; swirlId: string;
  /** When set, renders the real LoL emblem image instead of the abstract glyph. */
  emblemSrc?: string;
  /** Rendered height for the emblem image (px). Width scales proportionally via object-contain. */
  emblemHeight?: number;
}) {
  const r = size / 2;
  const sw = size >= 60 ? 2.5 : 1.5;
  // Inner socket radius (inside the ring stroke)
  const innerR = r - sw - 1;
  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="absolute inset-0" overflow="visible">
        <defs>
          {/* Deep background disc gradient */}
          <radialGradient id={discId} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="var(--color-navy-swirl)" stopOpacity="0.8" />
            <stop offset="55%" stopColor="var(--color-navy-swirl)" />
            <stop offset="100%" stopColor="var(--color-grey-4)" />
          </radialGradient>
          {/* Teal energy-swirl socket fill — v5
              Sampled from play-button-hifi-closeup.png:
                wisp center  ≈ #3b8585 (muted teal, maps to teal-ring @ 60% on dark)
                bright wisps ≈ #3fe7ff (cyan-1, visible in the brighter reference wisps)
                deep base    ≈ #024950 (maps to teal-frame)
              Offset radial simulates the wisp positioned at upper-left of socket. */}
          <radialGradient id={swirlId} cx="35%" cy="38%" r="65%">
            <stop offset="0%"   stopColor="var(--color-cyan-1)"     stopOpacity="0.55" />
            <stop offset="20%"  stopColor="var(--color-teal-ring)"  stopOpacity="0.65" />
            <stop offset="50%"  stopColor="var(--color-teal-frame)" stopOpacity="0.80" />
            <stop offset="80%"  stopColor="var(--color-navy-swirl)" stopOpacity="0.90" />
            <stop offset="100%" stopColor="var(--color-grey-4)"     stopOpacity="1" />
          </radialGradient>
          {/* Socket clip — clips swirl to inner circle */}
          <clipPath id={`${swirlId}-clip`}>
            <circle cx={r} cy={r} r={innerR} />
          </clipPath>
        </defs>

        {/* Base disc */}
        <circle cx={r} cy={r} r={r} fill="var(--color-grey-4)" />

        {/* Socket fill: deep disc background */}
        <circle cx={r} cy={r} r={innerR} fill={greyed ? "var(--color-grey-4)" : `url(#${discId})`} />

        {/* Energy swirl layer — clipped to inner socket, hidden in queueing state.
            Two overlapping radial passes to approximate the multi-wisp swirl texture:
            primary (upper-left brighter), secondary (center glow). */}
        {!greyed && (
          <>
            <circle
              cx={r} cy={r} r={innerR}
              fill={`url(#${swirlId})`}
              clipPath={`url(#${swirlId}-clip)`}
              style={{ mixBlendMode: "screen" }}
            />
            {/* Secondary center glow — adds depth to the socket swirl */}
            <circle
              cx={r * 0.85} cy={r * 0.80}
              r={innerR * 0.5}
              fill="var(--color-teal-ring)"
              fillOpacity={0.18}
              clipPath={`url(#${swirlId}-clip)`}
              style={{ mixBlendMode: "screen" }}
            />
          </>
        )}

        {/* Gold ring stroke */}
        <circle
          cx={r} cy={r} r={r - sw / 2}
          fill="none"
          stroke={greyed ? "var(--color-grey-3)" : "var(--color-teal-ring)"}
          strokeWidth={sw}
          style={greyed ? undefined : { mixBlendMode: "color-dodge" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {emblemSrc ? (
          /* Real LoL emblem: explicit dimensions prevent layout shift.
             Source is 497×474 — always downscaling; object-contain preserves ratio. */
          <img
            src={emblemSrc}
            alt=""
            aria-hidden="true"
            width={emblemHeight ?? size}
            height={emblemHeight ?? size}
            style={{ width: emblemHeight ?? size, height: emblemHeight ?? size, objectFit: "contain" }}
          />
        ) : (
          <LeagueGlyph size={Math.round(size * 0.9)} gradId={glyphId} greyed={greyed} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Video magic layers (v8, issue #309)
//
// The WAD corpus ships the REAL client PLAY-button magic videos — the authentic
// "animated border overlay / radial effects" layers (docs/reference/
// HEXTECH-UI-NOTES.md) that the v7 CSS crossfade approximated. All webm carry a
// straight alpha channel, so each <video> composites directly over the CSS
// button: transparent regions let the frame read through, which also means a
// video that fails to load leaves the static look intact. The whole overlay is
// pointer-events-none + aria-hidden and is removed under prefers-reduced-motion
// via motion-reduce:hidden (pure CSS, SSR-safe, no first-frame flash).
//
// Two independent state machines are layered:
//   1. PlayButtonVideoLayer — 146×58 frame videos over the full button box:
//        enabled-intro (once on mount) → [idle: none] ; hover-intro → hover-loop
//        while pointer is over, hover-outro on leave ; release / magic-release
//        one-shots on press-release. Sits below the label so PLAY stays legible.
//   2. MedallionVideoLayer — 64×54 league-logo videos over the medallion socket:
//        intro (once on mount) → loop-idle ; loop-active while hovered/engaged ;
//        magic one-shot accent fired alongside the button intro.
// ---------------------------------------------------------------------------

/**
 * Real-client PLAY-button frame magic videos (issue #309), one URL per state.
 * All optional — a state's video only layers when its URL is supplied, and the
 * pure-CSS v7 button always renders beneath regardless, so a missing or broken
 * clip never regresses the static look. Pages/showcase supply URLs from
 * `@low/fixtures` (`playButtonVideoUrl(...)`, `buttonParticlesVideoUrl(...)`);
 * NO fetching happens in `@low/ui`.
 */
export interface PlayButtonVideoSources {
  /** One-shot particle-burst reveal played once when the button mounts enabled. */
  enabledIntro?: string;
  /** One-shot hover-in — cyan border trace ramps up; crossfades to `hoverLoop`. */
  hoverIntro?: string;
  /** Ambient hover loop — bright cyan frame + travelling border shimmer. */
  hoverLoop?: string;
  /** One-shot hover-out — border trace fades down on pointer-leave. */
  hoverOutro?: string;
  /** One-shot press-release magic burst — cyan energy flare. */
  magicRelease?: string;
  /** One-shot press-release — restrained particle pop. */
  release?: string;
  /** Ambient generic particle-drift loop behind the frame (buttons/particles-default). */
  particles?: string;
}

/**
 * Real-client League "L" medallion-socket magic videos (issue #309, absorbed
 * from #316). All optional; the CSS medallion renders beneath regardless. Pages
 * supply URLs from `@low/fixtures` (`leagueLogoVideoUrl(...)`).
 */
export interface PlayButtonMedallionVideoSources {
  /** One-shot bronze→gold+teal reveal played once on mount; hands off to `loopIdle`. */
  intro?: string;
  /** Calm teal energy-swirl loop — the resting socket state. */
  loopIdle?: string;
  /** Energetic teal swirl — crossfades in while the button is hovered/engaged. */
  loopActive?: string;
  /** One-shot gold-rim + cyan flash accent, fired alongside the button intro. */
  magic?: string;
}

// The frame videos are authored at 146×58 centered on the whole button (medallion
// + bar). Their glow bleeds slightly past the frame, so the overlay box is inset
// by a small negative fraction to let that bleed extend past the button bounds
// without being clipped. Visual-only overflow: the layer is pointer-events-none
// and absolutely positioned, so it never changes the hit area or the flow.
const VIDEO_BLEED_FRAC = 0.08;

// One crossfade <video> layer whose decoder pauses while hidden (#358). Only the
// active (opaque) layer decodes; the rest sit paused at opacity 0, still mounted
// so their resume is seamless under var(--motion-crossfade). Shared by both the
// frame and medallion state machines below (they differ only in object-fit).
function CrossfadeVideo({
  src,
  visible,
  loop,
  onEnded,
  objectFit,
}: {
  src: string;
  visible: boolean;
  loop: boolean;
  onEnded?: () => void;
  objectFit: "contain" | "cover";
}) {
  const ref = usePausedVideo(visible);
  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop={loop}
      muted
      playsInline
      preload="auto"
      onEnded={onEnded}
      className="absolute inset-0 h-full w-full"
      style={{ objectFit, opacity: visible ? 1 : 0, transition: VIDEO_CROSSFADE }}
    />
  );
}

// ---------------------------------------------------------------------------
// PlayButtonVideoLayer — the frame video state machine (146×58).
// ---------------------------------------------------------------------------

type FrameVideoState =
  | "enabledIntro"
  | "hoverIntro"
  | "hoverLoop"
  | "hoverOutro"
  | "release"
  | "magicRelease"
  | "idle";

function PlayButtonVideoLayer({
  sources,
  hovered,
  releaseTick,
}: {
  sources: PlayButtonVideoSources;
  hovered: boolean;
  /** Bumped on every press-release to (re)fire the one-shot release clip. */
  releaseTick: number;
}) {
  // introDone flips once the enabled-intro one-shot finishes (or immediately when
  // there is no intro clip), leaving the resting state to idle/hover.
  const [introDone, setIntroDone] = useState(!sources.enabledIntro);
  // hoverOutroActive plays the one-shot hover-out clip after the pointer leaves.
  const [hoverOutroActive, setHoverOutroActive] = useState(false);
  // hoverIntroDone flips once the one-shot hover-in finishes, handing off to the
  // hover loop; it resets on every fresh hover-enter so the lead-in replays.
  const [hoverIntroDone, setHoverIntroDone] = useState(false);
  // Which one-shot release clip to fire (magic preferred), keyed by releaseTick.
  const [releasePlaying, setReleasePlaying] = useState(false);
  const prevHovered = useRef(hovered);
  const seenReleaseTick = useRef(releaseTick);

  // Hover edge detection: rising edge resets the hover-intro one-shot; falling
  // edge fires the hover-outro one-shot (if provided).
  useEffect(() => {
    if (hovered && !prevHovered.current) {
      setHoverIntroDone(false);
      setHoverOutroActive(false);
    }
    if (!hovered && prevHovered.current && sources.hoverOutro) {
      setHoverOutroActive(true);
    }
    prevHovered.current = hovered;
  }, [hovered, sources.hoverOutro]);

  // Detect a new release tick → fire the release/magic-release one-shot.
  useEffect(() => {
    if (releaseTick !== seenReleaseTick.current) {
      seenReleaseTick.current = releaseTick;
      if (sources.magicRelease || sources.release) setReleasePlaying(true);
    }
  }, [releaseTick, sources.magicRelease, sources.release]);

  // Resolve the single active frame state, in priority order.
  let state: FrameVideoState;
  if (releasePlaying && (sources.magicRelease || sources.release)) {
    state = sources.magicRelease ? "magicRelease" : "release";
  } else if (!introDone && sources.enabledIntro) {
    state = "enabledIntro";
  } else if (hovered && !hoverIntroDone && sources.hoverIntro) {
    // One-shot hover-in leads before the loop takes over.
    state = "hoverIntro";
  } else if (hovered && (sources.hoverLoop || sources.hoverIntro)) {
    state = sources.hoverLoop ? "hoverLoop" : "hoverIntro";
  } else if (hoverOutroActive && sources.hoverOutro) {
    state = "hoverOutro";
  } else {
    state = "idle";
  }

  // Stacked layers, each at its own opacity; only `state` is opaque. Keeping all
  // decoders warm avoids the remount stalls a single swapping <video src> hits.
  const layers: {
    key: FrameVideoState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    { key: "hoverLoop", src: sources.hoverLoop, loop: true },
    { key: "hoverIntro", src: sources.hoverIntro, loop: false, onEnded: () => setHoverIntroDone(true) },
    { key: "hoverOutro", src: sources.hoverOutro, loop: false, onEnded: () => setHoverOutroActive(false) },
    { key: "enabledIntro", src: sources.enabledIntro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "release", src: sources.release, loop: false, onEnded: () => setReleasePlaying(false) },
    { key: "magicRelease", src: sources.magicRelease, loop: false, onEnded: () => setReleasePlaying(false) },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[2] overflow-visible motion-reduce:hidden"
      style={{ inset: `${-VIDEO_BLEED_FRAC * 100}%` }}
    >
      {/* Ambient particle drift — always-on subtle loop beneath the frame states. */}
      {sources.particles ? (
        <video
          key="particles"
          src={sources.particles}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: "contain", opacity: 0.7 }}
        />
      ) : null}
      {layers.map(({ key, src, loop, onEnded }) =>
        src ? (
          <CrossfadeVideo
            key={key}
            src={src}
            visible={state === key}
            loop={loop}
            onEnded={onEnded}
            objectFit="contain"
          />
        ) : null,
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MedallionVideoLayer — the league-logo socket state machine (64×54).
// Absolutely fills the medallion box; clipped to the circle by the caller's
// overflow-hidden socket shell so the swirl stays inside the ring.
// ---------------------------------------------------------------------------

type MedallionVideoState = "intro" | "loopIdle" | "loopActive" | "magic";

function MedallionVideoLayer({
  sources,
  active,
  magicTick,
}: {
  sources: PlayButtonMedallionVideoSources;
  /** True while the button is hovered/engaged → energetic loop-active swirl. */
  active: boolean;
  /** Bumped to (re)fire the one-shot magic accent (e.g. alongside the intro). */
  magicTick: number;
}) {
  const [introDone, setIntroDone] = useState(!sources.intro);
  const [magicPlaying, setMagicPlaying] = useState(false);
  const seenMagicTick = useRef(magicTick);

  useEffect(() => {
    if (magicTick !== seenMagicTick.current) {
      seenMagicTick.current = magicTick;
      if (sources.magic) setMagicPlaying(true);
    }
  }, [magicTick, sources.magic]);

  let state: MedallionVideoState;
  if (magicPlaying && sources.magic) {
    state = "magic";
  } else if (!introDone && sources.intro) {
    state = "intro";
  } else if (active && sources.loopActive) {
    state = "loopActive";
  } else {
    state = "loopIdle";
  }

  const layers: {
    key: MedallionVideoState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    { key: "loopIdle", src: sources.loopIdle, loop: true },
    { key: "loopActive", src: sources.loopActive, loop: true },
    { key: "intro", src: sources.intro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "magic", src: sources.magic, loop: false, onEnded: () => setMagicPlaying(false) },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] motion-reduce:hidden"
    >
      {layers.map(({ key, src, loop, onEnded }) =>
        src ? (
          <CrossfadeVideo
            key={key}
            src={src}
            visible={state === key}
            loop={loop}
            onEnded={onEnded}
            objectFit="cover"
          />
        ) : null,
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

export interface PlayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label text. Defaults to "PLAY". */
  children?: ReactNode;
  /**
   * Overrides the idle label text shown in the slide window.
   * When omitted, falls back to `children`, then "PLAY".
   *
   * Use case: navbar shows "PARTY" (greyed/disabled) while in a lobby,
   * without replacing the children ReactNode slot or touching the STOP toggle.
   * Additive — existing call sites omitting this prop are unaffected.
   */
  label?: string;
  /**
   * Size variant.
   * - `"default"` — XAML 1× (bar 118×28, total 165×38)
   * - `"hero"` — proportionally scaled ×1.643
   */
  size?: PlayButtonSize;
  /**
   * Queueing state: greys out button, slides PLAY down and STOP in from above.
   * Optional, defaults to false (PLAY behavior). Back-compat safe.
   */
  queueing?: boolean;
  /**
   * Optional URL for the real LoL emblem image (e.g. `"/lol-emblem.png"`).
   * When provided, renders the emblem inside the medallion socket at XAML Height=38
   * (scaled for hero). When omitted the abstract LeagueGlyph SVG renders instead —
   * no visual regression to existing variants.
   *
   * Keep `@low/ui` asset-free: the page/showcase supplies this path, never an import.
   * Source asset is 497×474 RGBA; always downscaling, no upscaling.
   */
  emblemSrc?: string;
  /**
   * Real-client PLAY-button frame magic videos (v8, issue #309). When provided,
   * the matching webm layer over the CSS button as a state machine: `enabledIntro`
   * plays once on mount; `hoverIntro`/`hoverLoop` crossfade in while the pointer is
   * over and `hoverOutro` plays on leave; `release`/`magicRelease` fire once on
   * press-release; `particles` is an ambient drift loop. Omit entirely (or
   * per-state) to keep the pure-CSS v7 button. Videos are additive — they never
   * change geometry or the hit area, sit below the label, and are fully suppressed
   * while `disabled`/`queueing` and under `prefers-reduced-motion: reduce`.
   *
   * Pages supply these from `@low/fixtures` (`playButtonVideoUrl`,
   * `buttonParticlesVideoUrl`).
   */
  videoSources?: PlayButtonVideoSources;
  /**
   * Real-client League "L" medallion-socket magic videos (v8, issue #309, absorbed
   * from #316). When provided, the league-logo webm animate the medallion socket:
   * `intro` plays once on mount → `loopIdle`; `loopActive` crossfades in while the
   * button is hovered/engaged; `magic` fires once alongside the button intro. The
   * static emblem/glyph renders beneath, so a missing clip leaves the CSS medallion
   * intact. Suppressed while `disabled`/`queueing` and under reduced motion.
   *
   * Pages supply these from `@low/fixtures` (`leagueLogoVideoUrl`).
   */
  medallionVideoSources?: PlayButtonMedallionVideoSources;
}

/**
 * PlayButton v7 — hi-res-reference fidelity pass over the v5 XAML geometry.
 *
 * ## v7 reference-match changes (docs/reference/play-button-hires-full.png)
 * - PLAY label: heavy sans (Inter 800) at ~38% cap-height of the teal bar,
 *   tight tracking — replaces the thin Marcellus serif that read too small.
 * - Fill-region centering: PLAY is centered between the medallion inner edge and
 *   the chevron-tip narrowing (the visible fill), not the full bar.
 * - Medallion: enlarged gold-L (~1.26× bar height) that extends above and below
 *   the bar, matching the reference emblem proportion.
 * - Teal frame: double-stroke (bright cyan outer band over a darker teal-frame
 *   inner edge), ≈7% of bar height.
 * - Frame aspect: straight-run stretch (`dx`) toward the reference 5.42:1.
 * - Hover: magic-button LAYER CROSSFADE (HEXTECH-UI-NOTES.md) — stacked idle and
 *   hover frame layers cross-fade on opacity, plus a radial cyan glow bloom
 *   behind the frame — instead of a single-frame property restyle.
 *
 * ## Shape: concave-left SVG arrow bar
 * Path: `M 0,0 L tx,0 L bw,ty L tx,bh L 0,bh C ci,ty 0,0 0,0 Z`
 * Left edge is a cubic bezier (bows rightward ~ci px at vertical center).
 * SVG path chosen over CSS clip-path:path() so gradient strokes work natively.
 *
 * ## XAML layer mapping
 * - GoldLine: `bg #00070E, border 1px #34291E` outer dark-bronze frame
 * - GreenLine: `bg #1E2328, border 2px #09343D` inner teal frame (clears emblem)
 * - Arrow: stacked SVG frame layers (glow / idle double-stroke / hover double-stroke)
 *
 * ## State gradients
 * - Default: 80%-alpha 3-stop cyan (#3FE7FF→#006D7D→#0493A7) over dark inner edge, grey-4 fill
 * - Hover: full-alpha bright-cyan (#AFF5FF→#46E6FF→#00ADD4), lifted fill (#1D3B4A→#082734), radial glow
 * - Queueing: flat grey-2 stroke, grey-4 fill, grey-3 text; STOP label slides in
 * - Disabled: grey-3 stroke, grey-4 fill, greyed medallion; no glow
 *
 * ## STOP slide toggle
 * Two labels (PLAY/STOP) stacked in an overflow-hidden window matching bar height.
 * transition-transform 500ms ease-in-out; PLAY exits down, STOP enters from above.
 *
 * ## v3 contracts preserved
 * - Single `<button type="button">` in the DOM
 * - `drop-shadow` on unclipped outer wrapper (not box-shadow)
 * - `useId()` for all SVG gradient IDs
 * - CSS-var `--socket-size` / `--press-extend` mechanism
 * - `has-[:disabled]` fallbacks
 */
export function PlayButton({
  children,
  label,
  disabled,
  className,
  size = "default",
  queueing = false,
  emblemSrc,
  videoSources,
  medallionVideoSources,
  ...props
}: PlayButtonProps) {
  const uid = useId();
  const discId  = `${uid}-d`;
  const glyphId = `${uid}-g`;
  const swirlId = `${uid}-sw`;
  const dsId    = `${uid}-ds`;
  const hsId    = `${uid}-hs`;
  const hfId    = `${uid}-hf`;
  const glowId  = `${uid}-gl`;

  const greyed = disabled || queueing;

  // Video magic layers (v8, issue #309). Only mount when interactive AND at least
  // one source is supplied — the CSS button always renders beneath, so dropping the
  // layer (greyed, or no sources) leaves the exact v7 look. Kept as CSS-only
  // fallback for reduced-motion (motion-reduce:hidden inside each layer) and JS-off.
  const hasFrameVideo =
    !greyed && !!videoSources && Object.values(videoSources).some(Boolean);
  const hasMedallionVideo =
    !greyed &&
    !!medallionVideoSources &&
    Object.values(medallionVideoSources).some(Boolean);
  const videoEnabled = hasFrameVideo || hasMedallionVideo;

  // Pressed state — drives socket shrink + bar extend. CSS :active pseudo-class
  // cannot override inline style (specificity), so JS state handles the override.
  const [pressed, setPressed] = useState(false);

  // Pointer-hover state — only needed to drive the video crossfades (the CSS path
  // keeps using :hover). Tracked so the frame/medallion layers can pick the active
  // clip. Off entirely when there is no video layer.
  const [hovered, setHovered] = useState(false);
  // Bumped on each press-release to (re)fire the one-shot release/magic clips.
  const [releaseTick, setReleaseTick] = useState(0);
  // Bumped once on mount to fire the medallion `magic` accent alongside the intro.
  const [magicTick, setMagicTick] = useState(0);
  useEffect(() => {
    if (hasMedallionVideo && medallionVideoSources?.magic) setMagicTick((t) => t + 1);
    // Fire once per mount; deliberately not re-firing on source identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = useCallback(() => { if (!disabled && !queueing) setPressed(true); }, [disabled, queueing]);
  const handleMouseUp   = useCallback(() => {
    setPressed((wasPressed) => {
      // A genuine release (pointer was down) advances the release tick so the
      // one-shot release/magic-release clips replay.
      if (wasPressed && videoEnabled) setReleaseTick((t) => t + 1);
      return false;
    });
  }, [videoEnabled]);
  const handlePointerEnter = useCallback(() => { if (videoEnabled) setHovered(true); }, [videoEnabled]);
  const handlePointerLeave = useCallback(() => { if (videoEnabled) setHovered(false); }, [videoEnabled]);

  const cfg = SIZE_MAP[size];
  const {
    medallion, socket, socketPressed,
    bar, barWidth, tipNarrowX,
    totalH, outerW, outerMarginLeft,
    greenLeft, greenMargin,
    arrowLeft, arrowTop,
    fontSize, pressExtend,
    backingExtend,
  } = cfg;

  const d = barPath(cfg);

  // v7 teal-frame stroke — reference reads as a double-stroke (bright outer band
  // over a darker inner edge), total ≈ 7% of bar height. We render two stacked
  // strokes: a wider dark inner edge under a narrower bright stroke. Both scale
  // with bar height so the proportion holds across default/hero.
  const strokeInner = 2.75 * (bar / 28); // bright band
  const strokeOuter = strokeInner + 1.6 * (bar / 28); // dark inner edge under it

  // Resolved CSS vars for pressed/rest state
  const currentSocketSize = pressed ? socketPressed : socket;
  const currentPressExtend = pressed ? pressExtend : 0;

  // v7 fill-region centering. The label window is a flex-1 element between a
  // left and a right spacer; its midpoint is the average of the two spacer
  // edges. The reference centers PLAY in the FILL REGION (medallion inner edge
  // → chevron-tip narrowing), not the full bar. So:
  //   left spacer  = greenLeft                    (fill starts at the green frame)
  //   right spacer = outerW - (arrowLeft+tipNarrowX)   (chevron narrowing point)
  // → window center = (greenLeft + arrowLeft + tipNarrowX) / 2 = fill center.
  const fillLeft = greenLeft;
  const tipNarrowFrameX = arrowLeft + tipNarrowX;
  const textRight = outerW - tipNarrowFrameX;

  // How much of the medallion overhangs to the left of the outer frame
  const medallionOverhang = Math.round(medallion - outerMarginLeft * 1.5);

  return (
    <div
      className={[
        "relative inline-flex items-center group/pb",
        "has-[:disabled]:[filter:none] has-[:disabled]:hover:[filter:none]",
        disabled || queueing
          ? "[filter:none]"
          : [
              "hover:[filter:drop-shadow(0_0_6px_color-mix(in_srgb,var(--color-cyan-1)_40%,transparent))_drop-shadow(0_-2px_6px_color-mix(in_srgb,var(--color-cyan-1)_70%,transparent))]",
              "active:[filter:none]",
              "has-[:focus-visible]:[filter:drop-shadow(0_0_8px_var(--color-gold-2))]",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        !disabled
          ? ({
              "--socket-size": `${currentSocketSize}px`,
              "--press-extend": `${currentPressExtend}px`,
            } as React.CSSProperties)
          : undefined
      }
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        handlePointerLeave();
      }}
      onMouseEnter={handlePointerEnter}
    >
      {/* Real-client frame video state machine (v8, issue #309). Spans the whole
          button box (medallion + bar), sits above the frame (z-2) but below the
          label. pointer-events-none + motion-reduce:hidden inside the layer, so it
          never affects the hit area and vanishes under reduced motion. */}
      {hasFrameVideo && videoSources && (
        <PlayButtonVideoLayer
          sources={videoSources}
          hovered={hovered}
          releaseTick={releaseTick}
        />
      )}

      {/* Gradient defs in a hidden SVG — position:absolute, 0×0, overflow:hidden */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", overflow: "hidden" }}>
        <GradDefs dsId={dsId} hsId={hsId} hfId={hfId} glowId={glowId} />
      </svg>

      {/* ------------------------------------------------------------------ */}
      {/* MEDALLION — overlaps the outer frame on the left                   */}
      {/* Negative right margin pulls it into the frame.                     */}
      {/* The inner sizing div tracks --socket-size so the visible disc      */}
      {/* shrinks on press (44→40 default, 72→65 hero) while the layout      */}
      {/* container stays fixed (no reflow on press).                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 shrink-0 flex items-center justify-center"
        style={{
          width: medallion,
          height: totalH,
          marginRight: -medallionOverhang,
        }}
      >
        {/* Socket shell: tracks --socket-size with overflow:hidden + border-radius:50%
            to clip the fixed-size medallion SVG into a circle that visibly shrinks
            on press (44→40 default, 72→65 hero) without layout reflow. The same
            overflow-hidden circle clips the league-logo video swirl to the ring. */}
        <div
          className="relative transition-all duration-150 overflow-hidden flex items-center justify-center"
          style={{
            width: "var(--socket-size)",
            height: "var(--socket-size)",
            borderRadius: "50%",
          }}
        >
          <Medallion
            size={medallion}
            greyed={greyed}
            discId={discId}
            glyphId={glyphId}
            swirlId={swirlId}
            emblemSrc={emblemSrc}
            emblemHeight={totalH}
          />
          {/* Real-client league-logo socket video (v8, issue #309, from #316).
              Sits over the static emblem, clipped to the circle by this shell.
              loop-active engages while the button is hovered. */}
          {hasMedallionVideo && medallionVideoSources && (
            <MedallionVideoLayer
              sources={medallionVideoSources}
              active={hovered || pressed}
              magicTick={magicTick}
            />
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* OUTER FRAME — GoldLine                                             */}
      {/* Fixed width = outerW so the frame doesn't collapse.                */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative shrink-0"
        style={{
          width: outerW,
          height: totalH,
          background: "var(--color-pb-outer-bg)",
          border: "1px solid var(--color-pb-outer-border)",
          boxSizing: "border-box",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* INNER FRAME — GreenLine                                          */}
        {/* XAML margin 50 4 4 4 from GoldLine bounds.                       */}
        {/* v9 (#357): stop the inner frame's right edge at the chevron-tip   */}
        {/* zone rather than the outer frame's right edge. The GoldLine now   */}
        {/* runs `backingExtend` px past the tip (reference-matched dark      */}
        {/* bronze backing plate); if the GreenLine also spanned that run its */}
        {/* teal top/right border would draw a stray cyan line across the     */}
        {/* dark backing (the reference has only the bronze GoldLine there).  */}
        {/* Ending it `backingExtend` short keeps the inner teal frame hugging */}
        {/* the chevron, matching docs/reference/play-button-hires-full.png.  */}
        {/* ---------------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            left: greenLeft,
            top: greenMargin,
            right: greenMargin + backingExtend,
            bottom: greenMargin,
            background: "var(--color-grey-4)",
            border: "2px solid var(--color-pb-inner-border)",
            boxSizing: "border-box",
          }}
        />

        {/* ---------------------------------------------------------------- */}
        {/* ARROW SVG — positioned over both frames (z=2 > GreenLine)        */}
        {/* XAML Arrow margin 40 5 4 -5: left=40, top=5 from GoldLine edge.  */}
        {/* The drop-shadow on the SVG matches XAML DropShadowEffect.        */}
        {/* On press --press-extend moves the SVG left, extending the bar.   */}
        {/* ---------------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            left: `calc(${arrowLeft}px - var(--press-extend, 0px))`,
            top: arrowTop,
            zIndex: 2,
            filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.8))",
            lineHeight: 0,
            transition: "left 150ms",
          }}
        >
          <svg
            width={barWidth}
            height={bar}
            viewBox={`0 0 ${barWidth} ${bar}`}
            overflow="visible"
            aria-hidden="true"
          >
            {/* Backing plate: dark bronze fill that runs from the chevron tip to
                the outer frame's right edge (v9/#357). The hi-res reference keeps
                ~0.6× bar-height of GoldLine frame past the teal tip; `backingExtend`
                lengthens the frame there, and this rect fills that run so the tip
                reads as cutting through a solid plate (not floating in a gap). Width
                reaches the inner-frame right inset: from tipNarrowX to
                (outerW - arrowLeft - greenMargin) in this SVG's tip-relative coords.
                Color: pb-outer-bg (sampled ≈ dark bronze). */}
            <rect
              x={tipNarrowX}
              y={0}
              width={Math.max(
                barWidth - tipNarrowX + Math.round(5 * (bar / 28)),
                outerW - arrowLeft - greenMargin - tipNarrowX,
              )}
              height={bar}
              fill="var(--color-pb-outer-bg)"
            />

            {/* ---- Radial glow layer (magic-button "radial effects"): a bright
                cyan bloom behind the frame, revealed on hover via crossfade. ---- */}
            {!greyed && (
              <path
                d={d}
                fill={`url(#${glowId})`}
                stroke="none"
                className="opacity-0 transition-opacity duration-200 ease-out group-hover/pb:opacity-100"
                style={{ filter: `blur(${Math.round(2 * (bar / 28))}px)` }}
              />
            )}

            {/* ---- IDLE frame layer ----
                Double-stroke: a wider dark inner edge under a narrower bright cyan
                stroke, so the teal frame reads as bright-outer / dark-inner like the
                reference (stroke ≈ 7% of bar height). Crossfades OUT on hover. */}
            <g
              className={!greyed ? "transition-opacity duration-200 ease-out group-hover/pb:opacity-0" : undefined}
            >
              {/* dark inner edge (drawn first, wider) */}
              {!greyed && (
                <path d={d} fill="none" stroke="var(--color-teal-frame)" strokeWidth={strokeOuter} />
              )}
              {/* fill + bright stroke */}
              <path
                d={d}
                fill="var(--color-grey-4)"
                stroke={
                  disabled   ? "var(--color-grey-3)" :
                  queueing   ? "var(--color-grey-2)" :
                  `url(#${dsId})`
                }
                strokeWidth={strokeInner}
              />
            </g>

            {/* ---- HOVER frame layer ----
                Same double-stroke recipe with the brighter hover gradient + lifted
                fill. Crossfades IN on hover (opacity transition between layers, not a
                property restyle) per HEXTECH-UI-NOTES.md magic-button anatomy. */}
            {!greyed && (
              <g className="opacity-0 transition-opacity duration-200 ease-out group-hover/pb:opacity-100">
                <path d={d} fill="none" stroke="var(--color-teal-grad-hover-c)" strokeWidth={strokeOuter} />
                <path d={d} fill={`url(#${hfId})`} stroke={`url(#${hsId})`} strokeWidth={strokeInner} />
              </g>
            )}
          </svg>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* BUTTON + TEXT — fills the full outer frame area (z=3 > arrow)    */}
        {/* overflow-hidden for the label slide clip.                        */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          disabled={disabled}
          {...props}
          className={[
            "absolute inset-0 z-[3]",
            "flex items-center cursor-pointer overflow-hidden",
            // v7: reference PLAY is a heavy sans (near-black), not the thin
            // Marcellus serif. Use font-body (Inter) at weight 800 with tight
            // tracking to match the bold-sans cap-height + weight of the ref.
            "font-body font-extrabold uppercase tracking-[-0.01em]",
            disabled
              ? "cursor-not-allowed text-grey-2"
              : queueing
              ? "text-grey-3 cursor-default"
              : "text-white group-hover/pb:text-white active:text-gold-3",
            "focus-visible:outline-none",
            "transition-colors duration-150",
          ].join(" ")}
          style={{ fontSize }}
        >
          {/* Left spacer: fill-region left edge (green frame inset).
              Narrows by --press-extend on active so text tracks with the bar. */}
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              display: "inline-block",
              width: `calc(${fillLeft}px - var(--press-extend, 0px))`,
              transition: "width 150ms",
            }}
          />

          {/* PLAY/STOP sliding window */}
          <span
            className="relative overflow-hidden flex-1"
            style={{ height: bar }}
            aria-hidden="true"
          >
            {/* PLAY — rest position, exits down on queueing */}
            <span
              className="absolute inset-x-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
              style={{ height: bar, transform: queueing ? "translateY(100%)" : "translateY(0%)" }}
            >
              {label ?? children ?? "PLAY"}
            </span>
            {/* STOP — enters from above on queueing */}
            <span
              className="absolute inset-x-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
              style={{ height: bar, transform: queueing ? "translateY(0%)" : "translateY(-100%)" }}
            >
              STOP
            </span>
          </span>

          {/* Right spacer: clears arrow tip */}
          <span
            aria-hidden="true"
            style={{ flexShrink: 0, display: "inline-block", width: textRight }}
          />

          <span className="sr-only">
            {queueing ? "Stop" : label ?? (typeof children === "string" ? children : "Play")}
          </span>
        </button>
      </div>
    </div>
  );
}
