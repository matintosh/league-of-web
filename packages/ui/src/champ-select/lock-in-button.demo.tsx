"use client";

import { LockInButton } from "./lock-in-button";

/** Interactive demo — clicking logs to console. */
export function LockInButtonEnabledDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton onLockIn={() => console.log("locked in")} />
    </div>
  );
}

export function LockInButtonDisabledDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton disabled onLockIn={() => console.log("locked in")} />
    </div>
  );
}

export function LockInButtonCustomLabelDemo() {
  return (
    <div style={{ width: 300 }}>
      <LockInButton label="Confirm Pick" onLockIn={() => console.log("locked in")} />
    </div>
  );
}

export function LockInButtonFullWidthDemo() {
  return (
    <div style={{ width: 480 }}>
      <LockInButton onLockIn={() => console.log("locked in")} />
    </div>
  );
}
