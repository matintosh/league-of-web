"use client";

import { findMatchVideoUrl, lockInVideoUrl } from "@low/fixtures";
import { LockInButton } from "./lock-in-button";

// Real-client FIND MATCH state videos (issue #310). The showcase (a server file)
// must not import fixture values, so the URL map lives here in the client demo.
const FIND_MATCH_VIDEOS = {
  intro: findMatchVideoUrl("intro"),
  idle: findMatchVideoUrl("idle"),
  hover: findMatchVideoUrl("hover"),
  active: findMatchVideoUrl("active"),
  pulse: findMatchVideoUrl("pulse"),
  allReturned: findMatchVideoUrl("all-returned"),
};

// Real-client LOCK IN button state videos (issue #428, CDragon patch 7.5).
// All 8 webms confirmed HTTP 200 at:
//   https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-champ-select/global/default/video/lock-in/
const LOCK_IN_VIDEOS = {
  activeIntro:   lockInVideoUrl("activeIntro"),
  activeIdle:    lockInVideoUrl("activeIdle"),
  activeHover:   lockInVideoUrl("activeHover"),
  activeOut:     lockInVideoUrl("activeOut"),
  release:       lockInVideoUrl("release"),
  disabledIntro: lockInVideoUrl("disabledIntro"),
  changeChamp:   lockInVideoUrl("changeChamp"),
  magicExpell:   lockInVideoUrl("magicExpell"),
};

/** Enabled lock variant — bright cyan gradient fill, dark text. */
export function LockInButtonEnabledDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton onLockIn={() => console.log("locked in")} />
    </div>
  );
}

/** Enabled ban variant — red gradient fill, white text, red glow. */
export function LockInButtonBanVariantDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton variant="ban" label="Ban" onLockIn={() => console.log("ban")} />
    </div>
  );
}

/** Disabled — dark grey fill, grey text. Used for "no champion selected" pick state. */
export function LockInButtonDisabledDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton disabled onLockIn={() => console.log("locked in")} />
    </div>
  );
}

/** In Queue — disabled with "Find Match" label replaced by "In Queue". */
export function LockInButtonInQueueDemo() {
  return (
    <div style={{ width: 200 }}>
      <LockInButton label="In Queue" disabled onLockIn={() => {}} />
    </div>
  );
}

/** Custom label — natural-case in JSX, CSS uppercased by the component. */
export function LockInButtonCustomLabelDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton label="Find Match" onLockIn={() => console.log("find match")} />
    </div>
  );
}

/** Full width at 480px — shows trapezoid+arc geometry at wider container.
    Arc sagitta scales with container via objectBoundingBox clipPath. */
export function LockInButtonFullWidthDemo() {
  return (
    <div style={{ width: 480 }}>
      <LockInButton onLockIn={() => console.log("locked in")} />
    </div>
  );
}

/** Video state machine — intro plays once on mount, then the idle loop runs.
    Hover the button to crossfade into the bright cyan hover face; press for the
    engaged/active face. The CSS button renders beneath so nothing regresses if
    a video is missing or motion is reduced. */
export function LockInButtonVideoDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton
        label="Find Match"
        onLockIn={() => console.log("find match")}
        videoSources={FIND_MATCH_VIDEOS}
      />
    </div>
  );
}

/** Pulse attention — the green ready-to-start attention pulse overlay
    (attention="pulse"). Its 300×200 glow bleeds past the trapezoid. */
export function LockInButtonPulseDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton
        label="Find Match"
        onLockIn={() => console.log("find match")}
        videoSources={FIND_MATCH_VIDEOS}
        attention="pulse"
      />
    </div>
  );
}

/** All-returned attention — the steady green party-all-ready outline glow
    (attention="all-returned"). */
export function LockInButtonAllReturnedDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton
        label="Find Match"
        onLockIn={() => console.log("find match")}
        videoSources={FIND_MATCH_VIDEOS}
        attention="all-returned"
      />
    </div>
  );
}

/**
 * Native LOCK IN button state machine (issue #428) — the CDragon patch-7.5
 * champ-select lock-in webms wired via `lockInVideoSources`. Plays activeIntro
 * once on mount → activeIdle loops; hover crossfades to activeHover loop and
 * activeOut plays on pointer-leave; release fires on click. All layers are
 * additive straight-alpha overlays; the CSS button renders beneath so a missing
 * clip leaves the static look intact.
 */
export function LockInButtonNativeVideoDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton
        label="Lock In"
        onLockIn={() => console.log("lock in")}
        lockInVideoSources={LOCK_IN_VIDEOS}
      />
    </div>
  );
}

/**
 * Native LOCK IN button — disabled variant with disabledIntro one-shot.
 * When `disabled` is true and `disabledIntro` is supplied, the intro plays
 * once then the CSS disabled state shows through the transparent overlay.
 */
export function LockInButtonNativeVideoDisabledDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton
        label="Lock In"
        disabled
        onLockIn={() => {}}
        lockInVideoSources={LOCK_IN_VIDEOS}
      />
    </div>
  );
}
