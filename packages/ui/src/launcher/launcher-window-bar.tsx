"use client";

/**
 * LauncherWindowBar — transparent overlay window chrome for the /launcher section.
 *
 * Floats over the launcher content at y=0 (transparent background) so the rail,
 * hero, and social panel all bleed to the top edge. Right-aligned controls:
 * minimize (—) and close (×) only — no maximize button per the ref.
 *
 * Control hover states:
 *   minimize — bg: `--color-launcher-border`, icon: text-primary
 *   close    — bg: `--color-launcher-close-hover` (#c0392b), icon: white
 *
 * The bar has no background of its own; callers render it as an absolute
 * overlay (via LauncherShell) so content beneath is fully visible.
 *
 * Optional `leftContent` slot for a Riot logo or account chip (unused in the
 * main /launcher/lol route per the ref, but kept for flexibility).
 *
 * Drag region: presentational only (web recreation). No real OS drag behavior.
 *
 * No hardcoded hex outside packages/tokens. Server-safe.
 */

import { useId } from "react";
import type { ReactNode } from "react";

export interface LauncherWindowBarProps {
  /** Optional content for the left side (e.g. logo + account chip). */
  leftContent?: ReactNode;
  /** Called when minimize button is clicked. */
  onMinimize?: () => void;
  /** Called when close button is clicked. */
  onClose?: () => void;
}

/** Minimize icon — horizontal line */
function MinimizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
  onClose,
}: LauncherWindowBarProps) {
  const uid = useId();
  const minId = `${uid}-min`;
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
          background: "transparent",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Left slot — empty in the ref; available for logo/chip if needed */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 8,
          }}
        >
          {leftContent ?? null}
        </div>

        {/* Window control buttons — minimize + close only, flush right */}
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
              color: "var(--color-launcher-ctrl-icon)",
              transition: "background-color 120ms ease, color 120ms ease",
            }}
          >
            <MinimizeIcon />
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
              color: "var(--color-launcher-ctrl-icon)",
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
