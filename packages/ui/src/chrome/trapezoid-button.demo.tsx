"use client";

import {
  TrapezoidButton,
  TRAP_BORDER_PX,
  type TrapLayer,
} from "./trapezoid-button";

// The shared curved-trapezoid primitive powers three surfaces (#331): FIND MATCH /
// LOCK IN (teal), BAN (red), and ACCEPT (dark blue). These demos show the SAME
// geometry driven by different `layers` palettes — the proof that the shape is
// unified. The real surfaces (LockInButton, MatchFoundModal) add their video /
// entrance overlays on top of this base.

const labelClass = "font-display text-sm tracking-[0.2em] uppercase";

/** Teal palette — the FIND MATCH / LOCK IN base (no video overlay). */
export function TrapezoidButtonLockDemo() {
  const layers: TrapLayer[] = [
    { key: "shell", inset: 0, style: { background: "var(--color-teal-fm-border)" } },
    {
      key: "fill",
      inset: TRAP_BORDER_PX,
      style: {
        background:
          "linear-gradient(to bottom, var(--color-teal-grad-fm-a) 0%, var(--color-teal-grad-fm-b) 100%)",
      },
    },
  ];
  return (
    <div style={{ width: 300 }}>
      <TrapezoidButton
        onClick={() => console.log("lock")}
        layers={layers}
        className="[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-teal-fm-glow)_55%,transparent))] cursor-pointer"
        labelClassName={labelClass}
        labelStyle={{ color: "var(--color-hextech-black)" }}
      >
        Find Match
      </TrapezoidButton>
    </div>
  );
}

/** Red palette — the BAN base. */
export function TrapezoidButtonBanDemo() {
  const layers: TrapLayer[] = [
    { key: "shell", inset: 0, style: { background: "var(--color-ban-red-1)" } },
    {
      key: "fill",
      inset: TRAP_BORDER_PX,
      style: {
        background:
          "linear-gradient(to bottom, var(--color-ban-red-2) 0%, var(--color-ban-red-3) 100%)",
      },
    },
  ];
  return (
    <div style={{ width: 300 }}>
      <TrapezoidButton
        onClick={() => console.log("ban")}
        layers={layers}
        className="[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-ban-red-1)_55%,transparent))] cursor-pointer"
        labelClassName={labelClass}
        labelStyle={{ color: "white" }}
      >
        Ban
      </TrapezoidButton>
    </div>
  );
}

/** Dark-blue palette — the ACCEPT base (teal-ring border, blue-5 fill). */
export function TrapezoidButtonAcceptDemo() {
  const layers: TrapLayer[] = [
    { key: "shell", inset: 0, style: { background: "var(--color-teal-ring)" } },
    { key: "fill", inset: TRAP_BORDER_PX, style: { background: "var(--color-blue-5)" } },
  ];
  return (
    <div style={{ width: 280 }}>
      <TrapezoidButton
        onClick={() => console.log("accept")}
        layers={layers}
        className="[filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-blue-2)_60%,transparent))] cursor-pointer"
        labelClassName={`${labelClass} text-gold-1`}
      >
        Accept!
      </TrapezoidButton>
    </div>
  );
}

/** Full-width — the arc + slope scale with container via objectBoundingBox clip. */
export function TrapezoidButtonWideDemo() {
  const layers: TrapLayer[] = [
    { key: "shell", inset: 0, style: { background: "var(--color-teal-fm-border)" } },
    {
      key: "fill",
      inset: TRAP_BORDER_PX,
      style: {
        background:
          "linear-gradient(to bottom, var(--color-teal-grad-fm-a) 0%, var(--color-teal-grad-fm-b) 100%)",
      },
    },
  ];
  return (
    <div style={{ width: 480 }}>
      <TrapezoidButton
        onClick={() => console.log("wide")}
        layers={layers}
        labelClassName={labelClass}
        labelStyle={{ color: "var(--color-hextech-black)" }}
      >
        Find Match
      </TrapezoidButton>
    </div>
  );
}
