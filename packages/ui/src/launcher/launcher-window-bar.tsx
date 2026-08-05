"use client";

/**
 * LauncherWindowBar — 28px window chrome bar for the /launcher section.
 *
 * Thin strip at the very top of the launcher shell. Right-aligned window
 * controls: minimize, maximize/restore, close. Optional `leftContent` slot
 * for a Riot logo or account chip.
 *
 * Control hover states:
 *   minimize/maximize — bg: `--color-launcher-border`, icon: text-primary
 *   close             — bg: `--color-launcher-close-hover` (#c0392b), icon: white
 *
 * The `maximized` prop swaps the maximize icon for a restore icon.
 *
 * Drag region: presentational only (web recreation). No real OS drag behavior.
 *
 * No hardcoded hex outside packages/tokens. Server-safe.
 *
 * New token added: --color-launcher-close-hover: #c0392b (packages/tokens/src/theme.css).
 * Distinct from --color-warning (#ed2c49 bright crimson) — this is the deeper
 * brick-red used for window-close hover in the Riot launcher.
 */

import { useId } from "react";
import type { ReactNode } from "react";

export interface LauncherWindowBarProps {
  /** Optional content for the left side (e.g. logo + account chip). */
  leftContent?: ReactNode;
  /** Called when minimize button is clicked. */
  onMinimize?: () => void;
  /** Called when maximize/restore button is clicked. */
  onMaximize?: () => void;
  /** Called when close button is clicked. */
  onClose?: () => void;
  /** Whether the window is currently maximized (changes the maximize icon to restore). */
  maximized?: boolean;
}

/** Minimize icon — horizontal line */
function MinimizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Maximize icon — open square */
function MaximizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="0.5" />
    </svg>
  );
}

/** Restore icon — two overlapping squares (windowed from maximized) */
function RestoreIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      {/* back rect (offset top-right) */}
      <rect x="3" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.25" rx="0.5" />
      {/* front rect (offset bottom-left) */}
      <rect x="1" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.25" rx="0.5"
        style={{ fill: "var(--color-launcher-bg)" }} />
    </svg>
  );
}

/** Close icon — × */
function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LauncherWindowBar({
  leftContent,
  onMinimize,
  onMaximize,
  onClose,
  maximized = false,
}: LauncherWindowBarProps) {
  const uid = useId();
  const minId = `${uid}-min`;
  const maxId = `${uid}-max`;
  const closeId = `${uid}-close`;

  return (
    <>
      <style>{`
        .lwb-ctrl:hover {
          background-color: var(--color-launcher-border) !important;
          color: var(--color-launcher-text-primary) !important;
        }
        .lwb-ctrl-close:hover {
          background-color: var(--color-launcher-close-hover) !important;
          color: var(--color-launcher-ink) !important;
        }
      `}</style>

      <div
        aria-label="Window controls bar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: 28,
          backgroundColor: "var(--color-launcher-bg)",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Left slot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
          }}
        >
          {leftContent ?? null}
        </div>

        {/* Window control buttons — right side */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            height: "100%",
          }}
        >
          {/* Minimize */}
          <button
            id={minId}
            type="button"
            aria-label="Minimize"
            onClick={onMinimize}
            className="lwb-ctrl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-launcher-text-muted)",
              transition: "background-color 120ms ease, color 120ms ease",
            }}
          >
            <MinimizeIcon />
          </button>

          {/* Maximize / Restore */}
          <button
            id={maxId}
            type="button"
            aria-label={maximized ? "Restore" : "Maximize"}
            onClick={onMaximize}
            className="lwb-ctrl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-launcher-text-muted)",
              transition: "background-color 120ms ease, color 120ms ease",
            }}
          >
            {maximized ? <RestoreIcon /> : <MaximizeIcon />}
          </button>

          {/* Close */}
          <button
            id={closeId}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="lwb-ctrl lwb-ctrl-close"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-launcher-text-muted)",
              transition: "background-color 120ms ease, color 120ms ease",
            }}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </>
  );
}
