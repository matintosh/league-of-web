"use client";

import { findMatchVideoUrl } from "@low/fixtures";
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
