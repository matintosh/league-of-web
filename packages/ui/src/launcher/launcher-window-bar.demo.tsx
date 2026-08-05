'use client';

import { LauncherWindowBar } from "./launcher-window-bar";

/** Riot logo placeholder for leftContent slot. */
function RiotLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "var(--color-launcher-text-muted)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 4h10v2H7V4zm-1 3h12v1.5l1 2v4.5H5v-4.5l1-2V7zm2 6.5h8V11H8v2.5zm-2 2h12v1H6v-1zm1 2h10v1H7v-1z" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          color: "var(--color-launcher-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        matintosh
      </span>
    </div>
  );
}

/** Default windowed state — no leftContent. */
export function WindowBarDefaultDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-bg)" }}>
      <LauncherWindowBar
        onMinimize={() => undefined}
        onMaximize={() => undefined}
        onClose={() => undefined}
      />
    </div>
  );
}

/** Maximized state — restore icon shown. */
export function WindowBarMaximizedDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-bg)" }}>
      <LauncherWindowBar
        maximized
        onMinimize={() => undefined}
        onMaximize={() => undefined}
        onClose={() => undefined}
      />
    </div>
  );
}

/** With leftContent slot — Riot logo + summoner name. */
export function WindowBarWithLeftContentDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-bg)" }}>
      <LauncherWindowBar
        leftContent={<RiotLogo />}
        onMinimize={() => undefined}
        onMaximize={() => undefined}
        onClose={() => undefined}
      />
    </div>
  );
}

/** With leftContent + maximized. */
export function WindowBarLeftMaximizedDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-bg)" }}>
      <LauncherWindowBar
        leftContent={<RiotLogo />}
        maximized
        onMinimize={() => undefined}
        onMaximize={() => undefined}
        onClose={() => undefined}
      />
    </div>
  );
}
