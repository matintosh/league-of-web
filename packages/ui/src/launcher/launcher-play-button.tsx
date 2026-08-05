"use client";

/**
 * LauncherPlayButton — gold "▶ PLAY" split button with game-mode dropdown.
 *
 * A launcher-specific gold pill button distinct from the in-client play button
 * in `packages/ui/src/chrome/play-button.tsx`. Two segments divided by a thin
 * separator:
 *   - Left: main action "▶ Play" — triggers onPlay
 *   - Right: caret ▾ — triggers onToggleDropdown to open/close the picker
 *
 * Dropdown opens UPWARD above the button, listing game modes with optional
 * icons and PBE badges. Uses --color-launcher-* dark palette for the dropdown
 * panel while the button itself uses the gold token set.
 *
 * Presentational: props in / callbacks out. No state owned internally — the
 * caller controls `open` and `selectedModeId`. For stateful interactive demos
 * use launcher-play-button.demo.tsx.
 *
 * SVG id isolation: not needed here (no inline SVG with ids).
 *
 * Token reference: packages/tokens/src/theme.css — --color-launcher-* and
 * gold-2/3/4/5 for the gradient and separator.
 */

import type { ReactNode } from "react";

/** One option in the game-mode picker dropdown. */
export interface LauncherGameMode {
  /** Unique key, e.g. "lol" | "lol-pbe". */
  id: string;
  /** Display label, e.g. "League of Legends". */
  label: string;
  /** Small icon node (supplied by page, ~20px). */
  icon?: ReactNode;
  /** If true, renders a "PBE" badge next to the label. */
  isPbe?: boolean;
}

export interface LauncherPlayButtonProps {
  /** Available game modes for the dropdown. */
  gameModes: LauncherGameMode[];
  /** Currently selected game mode id. */
  selectedModeId?: string;
  /** Whether the dropdown is open. Controlled by caller. */
  open?: boolean;
  /** Called when the main "Play" segment is clicked. */
  onPlay?: () => void;
  /** Called when the caret segment is clicked (toggle dropdown). */
  onToggleDropdown?: () => void;
  /** Called when the user selects a game mode from the dropdown. */
  onSelectMode?: (id: string) => void;
}

/**
 * LauncherPlayButton — gold pill split button with upward game-mode dropdown.
 *
 * The button is intentionally unpositioned: callers that need the bottom-left
 * overlay layout described in the issue spec should wrap it with their own
 * positioning (e.g. `absolute bottom-[...] left-[...]`).
 */
export function LauncherPlayButton({
  gameModes,
  selectedModeId,
  open = false,
  onPlay,
  onToggleDropdown,
  onSelectMode,
}: LauncherPlayButtonProps) {
  return (
    <div className="relative inline-flex select-none">
      {/* Game-mode dropdown — opens UPWARD above the button */}
      {open && (
        <div
          className="absolute bottom-full left-0 z-50 mb-1 w-[220px] overflow-hidden rounded-[4px] border"
          style={{
            backgroundColor: "var(--color-launcher-panel-bg)",
            borderColor: "var(--color-launcher-border)",
          }}
        >
          {gameModes.map((mode) => {
            const isSelected = mode.id === selectedModeId;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode?.(mode.id)}
                className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100"
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-launcher-divider)"
                    : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--color-launcher-panel-header)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
                  }
                }}
                aria-current={isSelected ? "true" : undefined}
              >
                {/* Game icon — ~20px */}
                {mode.icon != null && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {mode.icon}
                  </span>
                )}

                {/* Label + PBE badge */}
                <span
                  className="flex flex-1 items-center gap-2 font-body text-[13px]"
                  style={{ color: "var(--color-launcher-text-primary)" }}
                >
                  {mode.label}
                  {mode.isPbe === true && (
                    <span
                      className="rounded-[2px] px-1 py-px font-body text-[10px] font-bold leading-none"
                      style={{
                        backgroundColor: "var(--color-gold-4)",
                        color: "var(--color-gold-1)",
                      }}
                    >
                      PBE
                    </span>
                  )}
                </span>

                {/* Checkmark for selected mode */}
                {isSelected && (
                  <span
                    className="ml-auto shrink-0 font-body text-[12px]"
                    style={{ color: "var(--color-gold-3)" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Gold pill button — two segments */}
      <div
        className="flex h-[40px] overflow-hidden rounded-full border"
        style={{ borderColor: "var(--color-gold-3)" }}
      >
        {/* Left segment: "▶ Play" */}
        <button
          type="button"
          onClick={onPlay}
          className="flex items-center gap-1.5 px-5 font-display text-[14px] font-bold uppercase tracking-wide transition-[filter] duration-100 hover:brightness-125 active:brightness-75"
          style={{
            background: "linear-gradient(to bottom, var(--color-gold-3), var(--color-gold-4))",
            color: "var(--color-hextech-black)",
          }}
          aria-label="Play"
        >
          {/* Play triangle */}
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            aria-hidden="true"
            style={{ fill: "var(--color-hextech-black)" }}
          >
            <polygon points="0,0 10,6 0,12" />
          </svg>
          Play
        </button>

        {/* Thin separator */}
        <div
          className="w-px shrink-0 self-stretch"
          style={{ backgroundColor: "var(--color-gold-4)" }}
          aria-hidden="true"
        />

        {/* Right segment: caret toggle */}
        <button
          type="button"
          onClick={onToggleDropdown}
          className="flex w-[28px] items-center justify-center transition-[filter] duration-100 hover:brightness-125 active:brightness-75"
          style={{
            background: "linear-gradient(to bottom, var(--color-gold-3), var(--color-gold-4))",
            color: "var(--color-hextech-black)",
          }}
          aria-label={open ? "Close game mode picker" : "Open game mode picker"}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            aria-hidden="true"
            className="transition-transform duration-150"
            style={{
              fill: "var(--color-hextech-black)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="M0 0 L5 6 L10 0 Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
