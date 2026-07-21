// ---------------------------------------------------------------------------
// LobbyButtonVideoLayer — the native lobby (CONFIRM) button state machine
// overlay (issue #454).
//
// Mirrors PlayButtonVideoLayer / LockInButtonVideoLayer onto HextechButton's
// primary (chevron) face. The rcp-fe-lol-patcher plugin's lobby-button webms
// (CDragon patch 7.5) are VP8-with-alpha 146×58 clips that carry the FULL button
// FACE — a concave-left arrow chevron with an opaque dark fill and its own teal
// frame — for the opaque states (intro / hover-intro / release / magic-release),
// plus a transparent-center frame-only shimmer for hover-loop / hover-outro.
//
// DOUBLED-ART DECISION (issue #423 class): SWAP-not-stack. Because the opaque
// clips carry the whole button face (and their concave-left arrow silhouette
// does NOT match HextechButton's straight-left chevron), stacking the video over
// the CSS frame would show two mismatched button shapes. So the consumer
// (ChevronButton) HIDES its CSS teal frame while this layer is active and paints
// a plain dark backing beneath the video, so the frame-only hover-loop's
// transparent center still reads as a solid button rather than a hollow cut-out.
// The video is the visible button; the label composites on top (the clips carry
// no text).
//
// The whole layer is pointer-events-none + aria-hidden and is removed under
// prefers-reduced-motion via motion-reduce:hidden (pure CSS, SSR-safe, no
// first-frame flash) — under reduced motion the CSS button shows unswapped.
// ---------------------------------------------------------------------------

"use client";

import { useEffect, useRef, useState } from "react";
import { usePausedVideo } from "./use-paused-video";

// Video crossfade transition. The real client sequences video states with
// ~250ms crossfades (docs/reference/HEXTECH-UI-NOTES.md). We use the shared
// Hextech motion token --motion-crossfade (250ms cubic-bezier, authored for
// exactly this video-state-machine use in packages/tokens/src/theme.css) so the
// timing/easing stays centralized rather than ad-hoc per component.
const CROSSFADE_TRANSITION = "opacity var(--motion-crossfade)";

// The lobby-button frame videos are authored at 146×58 centered on the whole
// button box. Their glow bleeds slightly past the frame, so the overlay box is
// inset by a small negative fraction to let that bleed extend past the button
// bounds without being clipped. Visual-only overflow: the layer is
// pointer-events-none and absolutely positioned, so it never changes the hit
// area or the flow. Matches PlayButtonVideoLayer's VIDEO_BLEED_FRAC.
const VIDEO_BLEED_FRAC = 0.08;

/**
 * Real-client lobby (CONFIRM) button state videos (issue #454), one URL per
 * state. All optional — a state's video only layers when its URL is supplied,
 * and the pure-CSS button always renders beneath (so a missing or broken clip
 * never regresses the static look). Pages/showcase supply URLs from
 * `@low/fixtures` (`lobbyButtonVideoUrl(...)`); NO fetching happens in `@low/ui`.
 *
 * The videos are VP8-with-alpha (carry their own straight alpha). Because the
 * opaque states carry the FULL button face, the consuming button SWAPS its CSS
 * frame for the video while this layer is active (issue #423) rather than
 * stacking. All layers: pointer-events-none, aria-hidden, motion-reduce:hidden.
 *
 * State machine:
 *   `intro` (once on mount) → settled idle (intro's held end frame)
 *   `hoverIntro` (one-shot on pointer-enter) → `hoverLoop` (loop while hovered)
 *   `hoverOutro` (one-shot on pointer-leave) → back to idle
 *   `release` / `magicRelease` (one-shot on press-release — bumped internally)
 *   `disabledIntro` (once when `disabled` is true) — then CSS disabled shows
 */
export interface LobbyButtonVideoSources {
  /** One-shot enabled reveal, played once on mount → hands off to the idle rest. */
  intro?: string;
  /** Hover-in one-shot — the dark face brightens its teal frame on pointer-enter. */
  hoverIntro?: string;
  /** Hover loop — frame-only travelling border shimmer while the pointer is over. */
  hoverLoop?: string;
  /** Hover-out one-shot — the hover shimmer fades back down on pointer-leave. */
  hoverOutro?: string;
  /** Press-release one-shot — cyan energy streaks sweep the fill (fired on click). */
  release?: string;
  /**
   * Press-release magic-accent one-shot — a brighter flare variant of `release`.
   * Preferred over `release` when both are supplied.
   */
  magicRelease?: string;
  /** Disabled reveal one-shot — plays once when `disabled` is true. */
  disabledIntro?: string;
}

// One crossfade <video> layer whose decoder pauses while hidden (#358). Only the
// active (opaque) layer decodes; the rest sit paused at opacity 0, still mounted
// so their resume is seamless under var(--motion-crossfade).
function CrossfadeVideo({
  src,
  visible,
  loop,
  onEnded,
}: {
  src: string;
  visible: boolean;
  loop: boolean;
  onEnded?: () => void;
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
      style={{
        objectFit: "contain",
        opacity: visible ? 1 : 0,
        transition: CROSSFADE_TRANSITION,
      }}
    />
  );
}

type LBVideoState =
  | "intro"
  | "idle" // terminal rest: no clip visible; the swapped dark backing shows through
  | "hoverIntro"
  | "hoverLoop"
  | "hoverOutro"
  | "release"
  | "magicRelease"
  | "disabledIntro"
  | "disabledIdle"; // terminal disabled rest: no clip; CSS disabled backing shows

/**
 * Whether at least one source is supplied — the layer only mounts (and the CSS
 * frame only swaps out) when there's a real clip to show. Exported so the
 * consumer can gate the swap without re-implementing the check.
 */
export function hasLobbyVideo(sources: LobbyButtonVideoSources | undefined): boolean {
  return !!sources && Object.values(sources).some(Boolean);
}

export function LobbyButtonVideoLayer({
  sources,
  disabled,
  hovered,
  releaseTick,
}: {
  sources: LobbyButtonVideoSources;
  disabled: boolean;
  hovered: boolean;
  /** Bumped on each press-release to (re)fire the release/magic one-shot. */
  releaseTick: number;
}) {
  // introDone flips true when the one-shot intro finishes (or immediately when
  // there is no intro clip), handing the resting state to the terminal idle.
  const [introDone, setIntroDone] = useState(!sources.intro);

  // disabledIntroDone flips true when the disabled-intro one-shot finishes (or
  // when disabled first becomes true without a disabledIntro clip). Resets
  // whenever disabled flips to false so the disabled intro replays next time.
  const [disabledIntroDone, setDisabledIntroDone] = useState(
    !disabled || !sources.disabledIntro,
  );
  const prevDisabled = useRef(disabled);
  useEffect(() => {
    if (disabled && !prevDisabled.current) {
      // Transitioned to disabled: reset so disabledIntro replays.
      setDisabledIntroDone(!sources.disabledIntro);
    }
    if (!disabled && prevDisabled.current) {
      // Transitioned to enabled: reset the active intro too.
      setIntroDone(!sources.intro);
      setDisabledIntroDone(true); // not relevant while enabled
    }
    prevDisabled.current = disabled;
  }, [disabled, sources.intro, sources.disabledIntro]);

  // hoverIntroDone flips once the one-shot hover-in finishes, handing off to the
  // hover loop; it resets on every fresh hover-enter so the lead-in replays.
  const [hoverIntroDone, setHoverIntroDone] = useState(false);
  // hoverOutActive plays the one-shot hover-out clip after the pointer leaves.
  const [hoverOutActive, setHoverOutActive] = useState(false);
  const prevHovered = useRef(hovered);
  useEffect(() => {
    if (hovered && !prevHovered.current) {
      setHoverIntroDone(false);
      setHoverOutActive(false);
    }
    if (!hovered && prevHovered.current && sources.hoverOutro) {
      setHoverOutActive(true);
    }
    prevHovered.current = hovered;
  }, [hovered, sources.hoverOutro]);

  // releasePlaying fires the release/magic one-shot on each new releaseTick.
  const [releasePlaying, setReleasePlaying] = useState(false);
  const seenReleaseTick = useRef(releaseTick);
  useEffect(() => {
    if (releaseTick !== seenReleaseTick.current) {
      seenReleaseTick.current = releaseTick;
      if (sources.magicRelease || sources.release) setReleasePlaying(true);
    }
  }, [releaseTick, sources.magicRelease, sources.release]);

  // Resolve the single active state, in priority order. Release accents fire
  // above interactive states; the disabled branch takes over when disabled=true.
  let state: LBVideoState;
  if (releasePlaying && (sources.magicRelease || sources.release)) {
    state = sources.magicRelease ? "magicRelease" : "release";
  } else if (disabled) {
    // When disabled only disabledIntro may play (once); after it ends the layer
    // resolves to the terminal `disabledIdle` no-op — no active video — so the
    // CSS grey disabled backing shows cleanly. The enabled clips must NEVER play
    // while disabled.
    state = disabledIntroDone ? "disabledIdle" : "disabledIntro";
  } else if (!introDone && sources.intro) {
    state = "intro";
  } else if (hovered && !hoverIntroDone && sources.hoverIntro) {
    // One-shot hover-in leads before the loop takes over.
    state = "hoverIntro";
  } else if (hovered && (sources.hoverLoop || sources.hoverIntro)) {
    state = sources.hoverLoop ? "hoverLoop" : "hoverIntro";
  } else if (hoverOutActive && sources.hoverOutro) {
    state = "hoverOutro";
  } else {
    state = "idle";
  }

  const layers: {
    key: LBVideoState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    // DOM order = paint order (later paints on top). `intro` sits at the BOTTOM
    // because its held last frame is the settled enabled base that the frame-only
    // hover machine composites over. The opaque one-shots (release / magic-release
    // / disabled-intro) sit on top so they fully repaint the face.
    { key: "intro", src: sources.intro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "hoverLoop", src: sources.hoverLoop, loop: true },
    { key: "hoverIntro", src: sources.hoverIntro, loop: false, onEnded: () => setHoverIntroDone(true) },
    { key: "hoverOutro", src: sources.hoverOutro, loop: false, onEnded: () => setHoverOutActive(false) },
    { key: "release", src: sources.release, loop: false, onEnded: () => setReleasePlaying(false) },
    { key: "magicRelease", src: sources.magicRelease, loop: false, onEnded: () => setReleasePlaying(false) },
    { key: "disabledIntro", src: sources.disabledIntro, loop: false, onEnded: () => setDisabledIntroDone(true) },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[2] overflow-visible motion-reduce:hidden"
      style={{ inset: `${-VIDEO_BLEED_FRAC * 100}%` }}
    >
      {layers.map(({ key, src, loop, onEnded }) => {
        // The settled enabled look IS the intro clip's held last frame (a teal-
        // framed dark button). Once the intro one-shot has ended it stays visible
        // (opacity 1, decoder paused at its end frame) BENEATH the enabled hover
        // machine — the frame-only hover-loop composites over it — rather than
        // dropping to the bare dark backing. It is only covered by an OPAQUE state
        // that fully repaints the face (release / magic-release) or by the disabled
        // branch. Keeping it continuously visible across idle↔hover avoids a
        // visibility toggle that would otherwise re-trigger playback from frame 0.
        // The disabled reveal likewise holds its settled grey frame through the
        // terminal `disabledIdle`.
        const introHeld =
          key === "intro" &&
          introDone &&
          !!sources.intro &&
          state !== "release" &&
          state !== "magicRelease" &&
          state !== "disabledIntro" &&
          state !== "disabledIdle";
        const disabledHeld =
          key === "disabledIntro" &&
          state === "disabledIdle" &&
          !!sources.disabledIntro;
        const visible = state === key || introHeld || disabledHeld;
        return src ? (
          <CrossfadeVideo
            key={key}
            src={src}
            visible={visible}
            loop={loop}
            onEnded={onEnded}
          />
        ) : null;
      })}
    </div>
  );
}
