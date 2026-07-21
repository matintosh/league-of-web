// ---------------------------------------------------------------------------
// LockInButton — NOT a variant of HextechButton.
//
// The pick-phase "LOCK IN" / lobby "FIND MATCH" button has a distinct visual
// language from the gold-bordered HextechButton. It uses:
//   - Trapezoid silhouette with a curved bottom arc — the shared shape now lives
//     in TrapezoidButton (../chrome/trapezoid-button), consumed here and by the
//     MATCH FOUND ACCEPT button so both are literally the same primitive (#331).
//   - Enabled fill: teal vertical gradient (teal-grad-fm-a top → teal-grad-fm-b
//     bottom), near-white hot frame + white/teal glow (v14 #335), WHITE text.
//   - Disabled/In Queue: grey-4 dark fill, grey-3 border + grey-2 text.
//
// Do not refactor into HextechButton props — the shape/color contract is
// fundamentally different and would make HextechButton's API unstable. The
// trapezoid GEOMETRY is shared (TrapezoidButton); the palette/state machine
// below is what makes this the LOCK IN / FIND MATCH surface specifically.
// ---------------------------------------------------------------------------

"use client";

import { useEffect, useRef, useState } from "react";
import {
  TrapezoidButton,
  TRAP_BORDER_PX,
  type TrapLayer,
} from "../chrome/trapezoid-button";
import { usePausedVideo } from "../chrome/use-paused-video";

// Video crossfade transition. The real client sequences video states with
// ~250ms crossfades (docs/reference/HEXTECH-UI-NOTES.md). We use the shared
// Hextech motion token --motion-crossfade (250ms cubic-bezier, authored for
// exactly this video-state-machine use in packages/tokens/src/theme.css) so the
// timing/easing stays centralized rather than ad-hoc per component.
const CROSSFADE_TRANSITION = "opacity var(--motion-crossfade)";

// The pulse / all-returned videos are authored on a larger 300×200 canvas so
// their green glow can bleed well beyond the trapezoid. The interactive
// (intro/idle/hover/active) videos are 230×100 with tighter bleed. We give the
// overlay box a symmetric negative inset so the video's own trapezoid frame —
// centered on the canvas — scales up to land ON the CSS clip edge, with its
// glow bleed extending past the button bounds. This is a *visual* overflow only:
// the layer is pointer-events-none and sits outside the button's layout box via
// absolute positioning, so it never changes the hit area, the clipPath
// geometry, or the flow.
//
// v14 registration (#335): the 230×100 clips carry their OWN trapezoid outline
// whose tight bright-border bbox measures 197×59 within the canvas (scratchpad
// hover-frame sampling) — i.e. 85.7% of canvas width, 59% of canvas height,
// centered. That outline's normalized silhouette (top corners x0.091/0.909,
// full-width base, bottom tip y1.0) matches the v14 CSS clip almost exactly, so
// it is the SAME shape — it only needs to be scaled UP to fill the button. With
// `objectFit: contain` on a box inset by -BLEED_FRAC, the height-constrained
// video renders at (1+2·BLEED)·H; 0.28 scales the 59%-tall border bbox up to
// ~button height at the in-app 200×70 (aspect 2.87) FIND MATCH slot so the video
// border sits on the CSS frame rather than floating inset inside it (was 0.18,
// which left the video border ~7px inside the frame — the pre-v14 mismatch).
const BLEED_FRAC = 0.28;

// Idle-video opacity. The idle shimmer video reads much hotter/brighter cyan
// than the reference idle (see #331 convergence). Compositing it at reduced
// opacity lets the tuned CSS teal base dominate so the resting idle matches the
// reference's subtle shimmer rather than an aurora. Intro/hover/active/attention
// stay at full opacity — only the resting idle is damped.
const IDLE_VIDEO_OPACITY = 0.22;

// One crossfade <video> layer whose decoder pauses while hidden (#358). Only the
// active (opaque) layer decodes; the rest sit paused at opacity 0, still mounted
// so their resume is seamless under var(--motion-crossfade). `visibleOpacity`
// lets the resting idle stay damped (IDLE_VIDEO_OPACITY) when it is the active
// state, so the tuned CSS teal base keeps dominating the idle look (#331).
function CrossfadeVideo({
  src,
  visible,
  visibleOpacity,
  loop,
  onEnded,
}: {
  src: string;
  visible: boolean;
  visibleOpacity: number;
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
        opacity: visible ? visibleOpacity : 0,
        transition: CROSSFADE_TRANSITION,
      }}
    />
  );
}

/**
 * Real-client FIND MATCH button state videos, one URL per state (issue #310).
 * All optional — the component only layers a state's video when its URL is
 * supplied, and renders the pure-CSS button underneath regardless (so a missing
 * or broken video never regresses the static look). Pages/showcase supply the
 * URLs from `@low/fixtures` (`findMatchVideoUrl(...)`); NO fetching happens here.
 *
 * The videos are VP9-with-alpha frame/glow overlays composited straight (not
 * screen-blended) over the CSS button, sitting below the label so the text stays
 * readable. Hidden entirely under `prefers-reduced-motion: reduce`.
 */
export interface LockInVideoSources {
  /** One-shot reveal played once on mount, then handed off to the idle loop. */
  intro?: string;
  /** Ambient shimmer loop — the resting state after intro finishes. */
  idle?: string;
  /** Bright hover face — crossfades in on pointer-enter, out on leave. */
  hover?: string;
  /** Pressed/engaged face — shown while the pointer is held down. */
  active?: string;
  /** Green attention-pulse sweep — driven by `attention="pulse"`. */
  pulse?: string;
  /** Steady green party-all-ready glow — driven by `attention="all-returned"`. */
  allReturned?: string;
}

// ---------------------------------------------------------------------------
// LockInButtonVideoSources — real-client LOCK IN button state videos
// (issue #428). Separate from LockInVideoSources (FIND MATCH videos, #310):
// these are the champ-select-plugin's native lock-in animations from CDragon
// patch 7.5, which have a different state set (active-intro → active-idle loop;
// active-hover loop ↔ active-out one-shot; release one-shot; disabled-intro;
// optional changeChamp / magicExpell one-shot accents without a native trigger).
// ---------------------------------------------------------------------------

/**
 * Real-client LOCK IN button state videos (issue #428), one URL per state.
 * All optional — a state's video only layers when its URL is supplied, and the
 * pure-CSS TrapezoidButton always renders beneath (so a missing or broken clip
 * never regresses the static look). Pages/showcase supply URLs from `@low/fixtures`
 * (`lockInVideoUrl(...)`); NO fetching happens in `@low/ui`.
 *
 * The videos are VP9-with-alpha straight-alpha overlays (carry their own alpha),
 * composited directly over the CSS button. A missing clip leaves the static look
 * intact. All layers: pointer-events-none, aria-hidden, motion-reduce:hidden.
 *
 * State machine:
 *   `activeIntro` (once on mount) → `activeIdle` (loop)
 *   `activeHover` (loop while pointer over) → `activeOut` (one-shot on leave)
 *   `release` (one-shot on press-release — bumped internally on click)
 *   `disabledIntro` (once when `disabled` is true) — then CSS disabled state shows
 *
 * One-shot accents (exposed but no built-in trigger — callers fire via tick props):
 *   `changeChamp` — via `lockInChangeChampTick` on `LockInButtonProps`
 *   `magicExpell` — via `lockInMagicExpellTick` on `LockInButtonProps`
 */
export interface LockInButtonVideoSources {
  /** One-shot enabled reveal, played once on mount → hands off to `activeIdle`. */
  activeIntro?: string;
  /** Ambient enabled idle loop — the resting enabled state. */
  activeIdle?: string;
  /** Hover loop — crossfades in on pointer-enter, stays while hovered. */
  activeHover?: string;
  /** Hover-out one-shot — plays once on pointer-leave, then returns to idle. */
  activeOut?: string;
  /** Press-release one-shot — fired automatically on click. */
  release?: string;
  /** Disabled reveal one-shot — plays once when `disabled` is true. */
  disabledIntro?: string;
  /**
   * Change-champ accent one-shot — fired by bumping `lockInChangeChampTick`.
   * Exposed for callers that have a champion-change signal; no built-in trigger.
   */
  changeChamp?: string;
  /**
   * Magic burst accent one-shot — fired by bumping `lockInMagicExpellTick`.
   * Analogous to PlayButton's `magicRelease`; no built-in trigger.
   */
  magicExpell?: string;
}

/**
 * The real client's green "ready" treatments for FIND MATCH, mapped 1:1 to the
 * WAD-corpus videos. `"none"` (default) leaves the button in its normal
 * intro→idle→hover→active interactive cycle.
 */
export type LockInAttention = "none" | "pulse" | "all-returned";

export interface LockInButtonProps {
  /**
   * When true the button is non-interactive: dark fill, grey text/border, aria-disabled,
   * click no-op. Use for "In Queue" state in the lobby or while no champion is selected.
   * Also suppresses the interactive state videos (disabled shows `disabledIntro` once if
   * provided via `lockInVideoSources`).
   */
  disabled?: boolean;
  /**
   * Called when the player clicks to lock in / find a match.
   * Never fired when disabled.
   */
  onLockIn: () => void;
  /**
   * Button label text. Defaults to "Lock In".
   * JSX receives natural-case; CSS text-transform: uppercase is applied via
   * the tracking-widest + uppercase class — do not pass an already-uppercased
   * string to keep accessible text natural.
   */
  label?: string;
  /**
   * Visual variant.
   * - "lock" (default): cyan/teal gradient fill — pick phase and Find Match button.
   * - "ban": red gradient fill using ban-red-1/2/3/press tokens — ban phase BAN button.
   */
  variant?: "lock" | "ban";
  /**
   * Real-client FIND MATCH state videos (issue #310). When provided, the matching
   * videos layer over the CSS button as a state machine: `intro` plays once on
   * mount → `idle` loops; `hover`/`active` crossfade with pointer state; the
   * green `pulse`/`allReturned` faces are driven by `attention`. Omit entirely
   * (or per-state) to keep the pure-CSS button. Videos are additive and never
   * change the trapezoid geometry or hit area. Ignored while `disabled`, and
   * fully suppressed under `prefers-reduced-motion: reduce`.
   *
   * Pages supply these from `@low/fixtures` (`findMatchVideoUrl`).
   */
  videoSources?: LockInVideoSources;
  /**
   * The green "ready" treatment to show, mapping to the real client's
   * ready-to-start states. `"pulse"` shows the attention-pulse sweep;
   * `"all-returned"` shows the steady party-all-ready glow; `"none"` (default)
   * keeps the normal interactive cycle. Only takes effect when the matching
   * `videoSources` entry is supplied and motion is allowed.
   */
  attention?: LockInAttention;
  /**
   * Real-client LOCK IN button state videos (issue #428). When provided, the
   * native champ-select lock-in webms (CDragon patch 7.5) layer over the CSS
   * button as a state machine: `activeIntro` plays once on mount → `activeIdle`
   * loops; `activeHover` crossfades in on pointer-enter → `activeOut` one-shot on
   * leave; `release` fires on each click; `disabledIntro` plays once when
   * `disabled=true`. One-shot accents (`changeChamp`, `magicExpell`) are exposed
   * but have no built-in trigger — bump their tick props to fire them.
   *
   * Pages supply these from `@low/fixtures` (`lockInVideoUrl`).
   */
  lockInVideoSources?: LockInButtonVideoSources;
  /**
   * Bump to (re)fire the `changeChamp` one-shot accent from `lockInVideoSources`.
   * Convention: increment whenever the selected champion changes. No-op if
   * `lockInVideoSources.changeChamp` is not supplied.
   */
  lockInChangeChampTick?: number;
  /**
   * Bump to (re)fire the `magicExpell` one-shot accent from `lockInVideoSources`.
   * Convention: increment at lock-in confirmation. No-op if
   * `lockInVideoSources.magicExpell` is not supplied.
   */
  lockInMagicExpellTick?: number;
}

// ---------------------------------------------------------------------------
// LockInVideoLayer — the FIND MATCH video state machine overlay (issue #310).
//
// Layers the real-client FIND MATCH state videos over the CSS button. Videos
// carry their own alpha (VP9), so they composite straight (no screen blend) —
// transparent regions let the CSS button read through, which also means a
// video that fails to load leaves the static look intact.
//
// All supplied videos are stacked absolutely and crossfaded via opacity; only
// the active state sits at its target opacity (idle damped to IDLE_VIDEO_OPACITY,
// the rest at 1). This keeps webm decoders warm and avoids the remount stalls a
// single swapping <video src> can hit. The whole layer is pointer-events-none
// and aria-hidden (it never intercepts clicks or reaches assistive tech) and is
// removed under prefers-reduced-motion via motion-reduce:hidden — pure CSS,
// SSR-safe, no first-frame flash.
//
// Geometry: the box is inset by -BLEED_FRAC on every side so each video's
// built-in glow bleed extends past the trapezoid. It is NOT clipped to the
// trapezoid — the glow bleed is the whole point — but because it is
// pointer-events-none and absolutely positioned it cannot affect the button's
// hit area or the clipPath'd fill layers beneath it.
// ---------------------------------------------------------------------------

type VideoState = "intro" | "idle" | "hover" | "active" | "pulse" | "allReturned";

function LockInVideoLayer({
  sources,
  hovered,
  pressed,
  attention,
}: {
  sources: LockInVideoSources;
  hovered: boolean;
  pressed: boolean;
  attention: LockInAttention;
}) {
  // introDone flips true when the one-shot intro finishes (or immediately when
  // there is no intro clip), handing the resting state to the idle loop.
  const [introDone, setIntroDone] = useState(!sources.intro);

  // Resolve the single active state from inputs, in priority order. Attention
  // (green ready states) wins when set; then press, then hover, then intro/idle.
  let state: VideoState;
  if (attention === "pulse" && sources.pulse) {
    state = "pulse";
  } else if (attention === "all-returned" && sources.allReturned) {
    state = "allReturned";
  } else if (pressed && sources.active) {
    state = "active";
  } else if (hovered && sources.hover) {
    state = "hover";
  } else if (!introDone && sources.intro) {
    state = "intro";
  } else {
    state = "idle";
  }

  // Each stacked <video> at its own opacity. The active one is fully opaque,
  // except idle which is damped so the tuned CSS teal base dominates the resting
  // look (see IDLE_VIDEO_OPACITY / #331).
  const layers: { key: VideoState; src?: string; loop: boolean; onEnded?: () => void }[] = [
    { key: "idle", src: sources.idle, loop: true },
    { key: "intro", src: sources.intro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "hover", src: sources.hover, loop: true },
    { key: "active", src: sources.active, loop: true },
    { key: "pulse", src: sources.pulse, loop: true },
    { key: "allReturned", src: sources.allReturned, loop: true },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[5] overflow-visible motion-reduce:hidden"
      style={{
        inset: `${-BLEED_FRAC * 100}%`,
      }}
    >
      {layers.map(({ key, src, loop, onEnded }) =>
        src ? (
          <CrossfadeVideo
            key={key}
            src={src}
            visible={state === key}
            visibleOpacity={key === "idle" ? IDLE_VIDEO_OPACITY : 1}
            loop={loop}
            onEnded={onEnded}
          />
        ) : null,
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LockInButtonVideoLayer — the native LOCK IN state machine overlay (issue #428).
//
// Mirrors PlayButtonVideoLayer's architecture onto the LOCK IN / FIND MATCH
// trapezoid. The CDragon patch-7.5 webms carry straight alpha (VP9), so they
// composite directly over the CSS TrapezoidButton — transparent regions let the
// CSS frame read through, and a missing/failed clip leaves the static look
// intact.
//
// State machine (mirroring the play-button's intro → idle + hover + release
// pattern but with the native lock-in state names from the CDragon catalog):
//   activeIntro (once on mount) → activeIdle (loop)
//   activeHover (loop while pointer over) ↔ activeOut (one-shot on pointer-leave)
//   release (one-shot on click, bumped via releaseTick)
//   disabledIntro (once when disabled=true) — CSS disabled state renders below
//   changeChamp, magicExpell (one-shot accents via their respective ticks)
//
// Disabled note: `disabledIntro` IS fired when `disabled=true` — it is an
// additive overlay, so the CSS disabled treatment (grey fill / grey text) still
// shows when the video ends or is absent.
// ---------------------------------------------------------------------------

type LIBVideoState =
  | "activeIntro"
  | "activeIdle"
  | "activeHover"
  | "activeOut"
  | "release"
  | "disabledIntro"
  | "disabledIdle"   // terminal no-op: all layers opacity 0; CSS grey fill shows cleanly
  | "changeChamp"
  | "magicExpell";

function LockInButtonVideoLayer({
  sources,
  disabled,
  hovered,
  releaseTick,
  changeChampTick,
  magicExpellTick,
}: {
  sources: LockInButtonVideoSources;
  disabled: boolean;
  hovered: boolean;
  /** Bumped on each press-release to (re)fire the release one-shot. */
  releaseTick: number;
  /** Bumped to (re)fire the changeChamp one-shot accent. */
  changeChampTick: number;
  /** Bumped to (re)fire the magicExpell one-shot accent. */
  magicExpellTick: number;
}) {
  // introDone flips true when the active-intro one-shot finishes (or immediately
  // when there is no intro clip), handing the resting state to activeIdle.
  const [introDone, setIntroDone] = useState(!sources.activeIntro);

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
      setIntroDone(!sources.activeIntro);
      setDisabledIntroDone(true); // not relevant while enabled
    }
    prevDisabled.current = disabled;
  }, [disabled, sources.activeIntro, sources.disabledIntro]);

  // hoverOutActive plays the one-shot hover-out clip after the pointer leaves.
  const [hoverOutActive, setHoverOutActive] = useState(false);
  const prevHovered = useRef(hovered);
  useEffect(() => {
    if (!hovered && prevHovered.current && sources.activeOut) {
      setHoverOutActive(true);
    }
    if (hovered && !prevHovered.current) {
      setHoverOutActive(false);
    }
    prevHovered.current = hovered;
  }, [hovered, sources.activeOut]);

  // releasePlaying fires the release one-shot on each new releaseTick.
  const [releasePlaying, setReleasePlaying] = useState(false);
  const seenReleaseTick = useRef(releaseTick);
  useEffect(() => {
    if (releaseTick !== seenReleaseTick.current) {
      seenReleaseTick.current = releaseTick;
      if (sources.release) setReleasePlaying(true);
    }
  }, [releaseTick, sources.release]);

  // changeChampPlaying fires the changeChamp accent on each new tick.
  const [changeChampPlaying, setChangeChampPlaying] = useState(false);
  const seenChangeChampTick = useRef(changeChampTick);
  useEffect(() => {
    if (changeChampTick !== seenChangeChampTick.current) {
      seenChangeChampTick.current = changeChampTick;
      if (sources.changeChamp) setChangeChampPlaying(true);
    }
  }, [changeChampTick, sources.changeChamp]);

  // magicExpellPlaying fires the magic burst accent on each new tick.
  const [magicExpellPlaying, setMagicExpellPlaying] = useState(false);
  const seenMagicExpellTick = useRef(magicExpellTick);
  useEffect(() => {
    if (magicExpellTick !== seenMagicExpellTick.current) {
      seenMagicExpellTick.current = magicExpellTick;
      if (sources.magicExpell) setMagicExpellPlaying(true);
    }
  }, [magicExpellTick, sources.magicExpell]);

  // Resolve the single active state, in priority order. One-shot accents fire
  // above interactive states; disabled branch takes over when disabled=true.
  let state: LIBVideoState;
  if (magicExpellPlaying && sources.magicExpell) {
    state = "magicExpell";
  } else if (changeChampPlaying && sources.changeChamp) {
    state = "changeChamp";
  } else if (releasePlaying && sources.release) {
    state = "release";
  } else if (disabled) {
    // When disabled, only disabledIntro may play (once); after it ends the layer
    // resolves to the terminal `disabledIdle` no-op state — no active video, all
    // layers at opacity 0 — so the CSS grey disabled fill shows cleanly through
    // the transparent overlay. The enabled shimmer (activeIdle) must NEVER play
    // while disabled, even at 22% opacity.
    state = disabledIntroDone ? "disabledIdle" : "disabledIntro";
  } else if (!introDone && sources.activeIntro) {
    state = "activeIntro";
  } else if (hovered && sources.activeHover) {
    state = "activeHover";
  } else if (hoverOutActive && sources.activeOut) {
    state = "activeOut";
  } else {
    state = "activeIdle";
  }

  const layers: {
    key: LIBVideoState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    { key: "activeIdle", src: sources.activeIdle, loop: true },
    { key: "activeIntro", src: sources.activeIntro, loop: false, onEnded: () => setIntroDone(true) },
    { key: "activeHover", src: sources.activeHover, loop: true },
    { key: "activeOut", src: sources.activeOut, loop: false, onEnded: () => setHoverOutActive(false) },
    { key: "release", src: sources.release, loop: false, onEnded: () => setReleasePlaying(false) },
    { key: "disabledIntro", src: sources.disabledIntro, loop: false, onEnded: () => setDisabledIntroDone(true) },
    { key: "changeChamp", src: sources.changeChamp, loop: false, onEnded: () => setChangeChampPlaying(false) },
    { key: "magicExpell", src: sources.magicExpell, loop: false, onEnded: () => setMagicExpellPlaying(false) },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[5] overflow-visible motion-reduce:hidden"
      style={{ inset: `${-BLEED_FRAC * 100}%` }}
    >
      {layers.map(({ key, src, loop, onEnded }) =>
        src ? (
          <CrossfadeVideo
            key={key}
            src={src}
            visible={state === key}
            visibleOpacity={key === "activeIdle" ? IDLE_VIDEO_OPACITY : 1}
            loop={loop}
            onEnded={onEnded}
          />
        ) : null,
      )}
    </div>
  );
}

/**
 * LockInButton — trapezoid-shaped gradient confirmation button with curved bottom arc.
 *
 * Visual contract:
 * - Trapezoid + curved-bottom-arc silhouette (shared TrapezoidButton primitive,
 *   v14 #335): NARROW arched top, sides splay OUTWARD to a full-width base, which
 *   closes with a downward quadratic bezier. Scales to any container width via
 *   objectBoundingBox clipPath.
 * - Enabled: near-flat teal fill (teal-grad-fm-a → teal-grad-fm-b), a near-white
 *   hot frame with a two-stop white/teal glow, white text (matched to the v14
 *   FIND MATCH reference, #335).
 * - Hover: brighter cyan hover gradient.
 * - Active/press: dimmed teal press gradient, text goes grey-1.
 * - Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text, cursor-not-allowed.
 * - Drop-shadow glow follows the clipped silhouette (filter on the outer wrapper).
 *
 * NOT a HextechButton variant — shape and color language are distinct (trapezoid
 * teal gradient vs rectangular gold borders). See file header for rationale.
 *
 * Both call sites (pick-screen LOCK IN + party-lobby-screen FIND MATCH) receive
 * the trapezoid+arc geometry automatically — prop contract is unchanged.
 *
 * @param disabled  Greys the button; disables clicks; shows "In Queue" treatment.
 * @param onLockIn  Lock-in / find-match handler — called on click when not disabled.
 * @param label     Button label (default: "Lock In"). CSS uppercased.
 * @param variant   "lock" (teal, default) or "ban" (brick-red, ban-phase CTA).
 * @param videoSources  Optional real-client FIND MATCH state videos (issue #310).
 * @param attention     Green ready treatment: "pulse" | "all-returned" | "none".
 * @param lockInVideoSources  Optional real-client LOCK IN state videos (issue #428).
 * @param lockInChangeChampTick  Bump to fire the changeChamp accent.
 * @param lockInMagicExpellTick  Bump to fire the magicExpell accent.
 */
export function LockInButton({
  disabled = false,
  onLockIn,
  label = "Lock In",
  variant = "lock",
  videoSources,
  attention = "none",
  lockInVideoSources,
  lockInChangeChampTick = 0,
  lockInMagicExpellTick = 0,
}: LockInButtonProps) {
  const isBan = variant === "ban";

  // Pointer state drives the hover/active video crossfades. These mirror the
  // CSS :hover / :active pseudo-states already used for the gradient overlays,
  // but the video layer needs them as React state to pick the active clip.
  // pressed is cleared on leave too, so a pointer that drags off mid-press
  // doesn't leave the button stuck in its pressed video.
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // releaseTick bumps on each successful click to (re)fire the release one-shot
  // in LockInButtonVideoLayer. Starts at 0; incremented in the click handler.
  const [releaseTick, setReleaseTick] = useState(0);

  // Only mount the FIND MATCH video layer when at least one source is supplied
  // and the button is interactive. The CSS button always renders beneath, so
  // dropping the layer (disabled, or no sources) leaves the static look intact.
  const hasVideo =
    !disabled &&
    !!videoSources &&
    Object.values(videoSources).some(Boolean);

  // Mount the LOCK IN video layer when at least one source is supplied.
  // Unlike the FIND MATCH layer, this layer also activates while disabled
  // (to show the disabledIntro one-shot). The CSS button always renders beneath.
  const hasLockInVideo =
    !!lockInVideoSources && Object.values(lockInVideoSources).some(Boolean);

  // The two layers cannot overlap the same pointer-state signals. Both use the
  // same `hovered` and `pressed` state — they both need pointer tracking when
  // either is active.
  const needsPointerTracking = hasVideo || hasLockInVideo;

  // Border colour: variant-dependent when enabled, grey-3 when disabled.
  // v14 (#335): the lock/FIND MATCH frame reads NEAR-WHITE hot, not thin teal.
  // Sampled frame core RGB ≈ (231,249,248) — white with a faint cyan cast. A
  // color-mix of white + teal-grad-fm-b (the bright fill cyan) reproduces that
  // cast without a raw hex: 88% white / 12% cyan ≈ (226,247,250). BAN keeps its
  // ban-red frame family; ACCEPT owns its teal-ring frame in match-found-modal.
  const borderColor = disabled
    ? "var(--color-grey-3)"
    : isBan
      ? "var(--color-ban-red-1)"
      : "color-mix(in srgb, white 88%, var(--color-teal-grad-fm-b) 12%)";

  // Fill: variant gradient when enabled; flat grey-4 when disabled.
  const fillBackground = disabled
    ? "var(--color-grey-4)"
    : isBan
      ? "linear-gradient(to bottom, var(--color-ban-red-2) 0%, var(--color-ban-red-3) 100%)"
      : // Reference (v11 in-context) idle fill is dark navy-teal across the top,
        // holding until the bottom third where it ramps to a bright teal glow at
        // the arc (#331 iter2). Holding teal-grad-fm-a (dark) to ~45% before
        // ramping to teal-grad-fm-b (bright) reproduces that steep bottom-weighted
        // curve — a plain 0→100% linear reads too bright through the middle.
        "linear-gradient(to bottom, var(--color-teal-grad-fm-a) 0%, var(--color-teal-grad-fm-a) 30%, var(--color-teal-grad-fm-b) 100%)";

  // Text colour: white on both the red ban fill AND the teal lock fill; grey-2 disabled.
  // The reference FIND MATCH label is white (mean rgb(227,231,232), peak #fff) over the
  // dark teal idle fill — NOT the dark-on-bright inversion the old hot-cyan fill assumed
  // (#331: with the fill corrected to the reference teal, white is the faithful label).
  // White is the CSS keyword — not a token, not a raw hex — for maximum contrast.
  const textColor = disabled
    ? "var(--color-grey-2)"
    : isBan
      ? "white"
      : "white";

  // Shape layers, bottom → top: border shell, fill, then hover/press overlays
  // when interactive. clipPath is injected by TrapezoidButton.
  const layers: TrapLayer[] = [
    {
      key: "shell",
      inset: 0,
      style: { background: borderColor, transition: "background 150ms" },
    },
    {
      key: "fill",
      inset: TRAP_BORDER_PX,
      className: !disabled ? "group-hover:!bg-none" : undefined,
      style: {
        background: fillBackground,
        transition: "background 150ms, opacity 150ms",
      },
    },
  ];

  if (!disabled) {
    layers.push(
      {
        // Hover fill overlay — 0→1 opacity on hover.
        // Lock: cyan hover gradient. Ban: slightly brighter red hover.
        key: "hover",
        inset: TRAP_BORDER_PX,
        className:
          "opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity duration-150",
        style: {
          background: isBan
            ? "linear-gradient(to bottom, var(--color-ban-red-1) 0%, color-mix(in srgb, var(--color-ban-red-2) 55%, var(--color-ban-red-3) 45%) 100%)"
            : "linear-gradient(to bottom, var(--color-teal-grad-hover-a) 0%, var(--color-teal-grad-hover-b) 50%, var(--color-teal-grad-hover-c) 100%)",
        },
      },
      {
        // Press fill overlay — on active.
        // Lock: dark teal press. Ban: dark red press.
        key: "press",
        inset: TRAP_BORDER_PX,
        className: "opacity-0 group-active:opacity-100 transition-opacity duration-75",
        style: {
          background: isBan
            ? "linear-gradient(to bottom, var(--color-ban-red-3) 0%, var(--color-ban-red-press) 100%)"
            : "linear-gradient(to bottom, var(--color-teal-grad-press-a) 0%, var(--color-teal-grad-press-b) 100%)",
        },
      },
    );
  }

  return (
    <TrapezoidButton
      disabled={disabled}
      onClick={
        disabled
          ? undefined
          : () => {
              // Bump the release tick before calling onLockIn so the video
              // fires in the same render cycle as the user's action.
              if (hasLockInVideo) setReleaseTick((t) => t + 1);
              onLockIn();
            }
      }
      layers={layers}
      // Pointer tracking for the video state machines. No-ops (undefined) when
      // neither video layer is active, so the pure-CSS button keeps its exact behavior.
      onPointerEnter={needsPointerTracking ? () => setHovered(true) : undefined}
      onPointerLeave={
        needsPointerTracking
          ? () => {
              setHovered(false);
              setPressed(false);
            }
          : undefined
      }
      onPointerDown={needsPointerTracking ? () => setPressed(true) : undefined}
      onPointerUp={needsPointerTracking ? () => setPressed(false) : undefined}
      className={[
        // Outer glow per the reference close-up — drop-shadow (not box-shadow:
        // it must follow the clipped silhouette including the arc).
        // Ban variant uses a red glow; lock variant (v14, #335) uses a HOT
        // two-stop halo: a tight near-white inner bloom hugging the frame plus a
        // softer teal outer glow — matching the near-white frame + teal bleed the
        // v14 reference shows (frame core ≈ white/cyan, glow band ≈ dim teal).
        !disabled && !isBan &&
          "[filter:drop-shadow(0_0_4px_color-mix(in_srgb,white_60%,var(--color-teal-grad-fm-b)_40%))_drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-teal-fm-glow)_55%,transparent))]",
        !disabled && isBan &&
          "[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-ban-red-1)_55%,transparent))]",
        !disabled &&
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-fm-border focus-visible:outline-offset-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      ]
        .filter(Boolean)
        .join(" ")}
      bleed={
        <>
          {/* FIND MATCH video layer (issue #310) */}
          {hasVideo && videoSources ? (
            <LockInVideoLayer
              sources={videoSources}
              hovered={hovered}
              pressed={pressed}
              attention={attention}
            />
          ) : null}
          {/* LOCK IN button video layer (issue #428) */}
          {hasLockInVideo && lockInVideoSources ? (
            <LockInButtonVideoLayer
              sources={lockInVideoSources}
              disabled={disabled}
              hovered={hovered}
              releaseTick={releaseTick}
              changeChampTick={lockInChangeChampTick}
              magicExpellTick={lockInMagicExpellTick}
            />
          ) : null}
        </>
      }
      labelClassName={[
        // text-lg + 0.12em tracking: the reference FIND MATCH label fills ~50%
        // of the button body width (cap-height ≈ 24% of body); text-sm/0.2em read
        // ~38% and too airy (#331 measurement).
        "font-display text-lg tracking-[0.12em] uppercase",
        // Press: text dims to grey-1 over the darker press gradient (JSDoc contract)
        !disabled && "group-active:!text-grey-1",
      ]
        .filter(Boolean)
        .join(" ")}
      labelStyle={{ color: textColor, transition: "color 150ms" }}
    >
      {label}
    </TrapezoidButton>
  );
}
