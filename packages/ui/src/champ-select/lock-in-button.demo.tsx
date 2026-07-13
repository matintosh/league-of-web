"use client";

import { LockInButton } from "./lock-in-button";

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
