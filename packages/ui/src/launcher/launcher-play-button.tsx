"use client";

/**
 * LauncherPlayButton — two detached gold pills with a right-opening game-mode dropdown.
 *
 * Matches the real Riot launcher (lol-launcher-ref/image.png + image-1.png):
 *   - LEFT pill:  light warm-gold fill, mixed-case "▶ Play" in sans (--font-launcher),
 *                 black label, ~113×52px, fully rounded.
 *   - RIGHT pill: dark muted olive-gold fill (~rgb(68,57,28)), gold caret glyph,
 *                 ~52×52px, fully rounded. ~6px gap between the pills.
 *   - Dropdown:   opens to the RIGHT of the caret pill, top-aligned with the button row.
 *                 Flat near-black panel (#1F1F1F). Selected row: red text, no bg, no checkmark.
 *                 PBE: plain appended text, muted gray, no badge.
 *
 * Presentational: props in / callbacks out. No state owned internally — the caller
 * controls `open` and `selectedModeId`. For stateful interactive demos use
 * launcher-play-button.demo.tsx.
 *
 * Token reference: packages/tokens/src/theme.css — --color-launcher-play-pill-*,
 * --color-launcher-caret-pill, --color-launcher-selected-mode, --color-launcher-dropdown-bg.
 */

import type { ReactNode } from "react";

/** One option in the game-mode picker dropdown. */
export interface LauncherGameMode {
  /** Unique key, e.g. "lol" | "lol-pbe". */
  id: string;
  /** Display label, e.g. "League of Legends". */
  label: string;
  /** Small icon node (supplied by page, ~20px). Kept for API compat; rows are text-only per ref. */
  icon?: ReactNode;
  /** If true, appends " PBE" as plain text in muted gray (no badge). */
  isPbe?: boolean;
}

export interface LauncherPlayButtonProps {
  /** Available game modes for the dropdown. */
  gameModes: LauncherGameMode[];
  /** Currently selected game mode id. */
  selectedModeId?: string;
  /** Whether the dropdown is open. Controlled by caller. */
  open?: boolean;
  /** Called when the main "Play" pill is clicked. */
  onPlay?: () => void;
  /** Called when the caret pill is clicked (toggle dropdown). */
  onToggleDropdown?: () => void;
  /** Called when the user selects a game mode from the dropdown. */
  onSelectMode?: (id: string) => void;
}

/**
 * LauncherPlayButton — two detached pills + right-opening game-mode dropdown.
 *
 * The button is intentionally unpositioned: callers that need a specific layout
 * overlay (e.g. below the wordmark in the Overview hero) should wrap it with
 * their own positioning.
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
    /* Outer wrapper: relative so the dropdown can escape via absolute right-side */
    <div className="relative inline-flex select-none items-center gap-[6px]">
      {/* ── LEFT PILL: "▶ Play" ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onPlay}
        className="flex h-[52px] items-center gap-[8px] rounded-full px-[22px] transition-[filter] duration-100 hover:brightness-110 active:brightness-75"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-launcher-play-pill-from), var(--color-launcher-play-pill-to))",
          fontFamily: "var(--font-launcher)",
          fontSize: 21,
          fontWeight: 600,
          color: "var(--color-hextech-black)",
          letterSpacing: 0,
        }}
        aria-label="Play"
      >
        {/* Play triangle — sized for a 21px label */}
        <svg
          width="11"
          height="13"
          viewBox="0 0 11 13"
          aria-hidden="true"
          style={{ fill: "var(--color-hextech-black)", flexShrink: 0 }}
        >
          <polygon points="0,0 11,6.5 0,13" />
        </svg>
        Play
      </button>

      {/* ── RIGHT PILL: caret toggle ─────────────────────────────────────────── */}
      <div className="relative">
        <button
          type="button"
          onClick={onToggleDropdown}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full transition-[filter] duration-100 hover:brightness-125 active:brightness-75"
          style={{
            backgroundColor: "var(--color-launcher-caret-pill)",
          }}
          aria-label={open ? "Close game mode picker" : "Open game mode picker"}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {/* Caret — gold glyph, does NOT rotate when open (matches ref) */}
          <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            aria-hidden="true"
            style={{ fill: "var(--color-gold-2)" }}
          >
            <path d="M0 0 L5.5 7 L11 0 Z" />
          </svg>
        </button>

        {/* ── DROPDOWN: opens to the RIGHT of the caret pill, top-aligned ──── */}
        {open && (
          <div
            role="listbox"
            aria-label="Game mode"
            className="absolute left-full top-0 z-50 ml-[6px] w-[230px] overflow-hidden rounded-[4px]"
            style={{
              backgroundColor: "var(--color-launcher-dropdown-bg)",
              border: "1px solid var(--color-launcher-border)",
            }}
          >
            {gameModes.map((mode) => {
              const isSelected = mode.id === selectedModeId;
              return (
                <button
                  key={mode.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectMode?.(mode.id)}
                  className="flex w-full items-center px-4 py-[10px] text-left transition-colors duration-100"
                  style={{
                    /* No bg fill for selected row — only text turns red (per ref) */
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-launcher)",
                    fontSize: 13,
                    fontWeight: 400,
                    /* Selected: red text; PBE (non-selected): muted gray; default: primary */
                    color: isSelected
                      ? "var(--color-launcher-selected-mode)"
                      : "var(--color-launcher-text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--color-launcher-panel-header)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                    }
                  }}
                >
                  {/* Label — PBE appended as plain muted text, no badge */}
                  <span>
                    {mode.label}
                    {mode.isPbe === true && (
                      <span
                        style={{ color: "var(--color-launcher-text-muted)" }}
                      >
                        {" "}PBE
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
