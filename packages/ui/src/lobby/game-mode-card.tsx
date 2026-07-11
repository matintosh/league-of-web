"use client";

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GameModeCardProps {
  /** Crest SVG slot — caller provides the SVG, should use currentColor for stroke/fill. */
  icon: ReactNode;
  /** Short player-count label, e.g. "5v5", "3v3", "FFA". */
  countLabel: string;
  /** Game mode name, e.g. "Summoner's Rift", "ARAM". */
  name: string;
  /** Whether this card is the currently selected mode. */
  selected?: boolean;
  /** Called when the user clicks the card. */
  onSelect?: () => void;
}

// ---------------------------------------------------------------------------
// GameModeCard
// ---------------------------------------------------------------------------

/**
 * GameModeCard renders a single game mode selection card.
 *
 * Vertical stack: large crest icon / short count label / mode name.
 * Controlled via `selected` — pass `onSelect` to handle clicks.
 * Uses `group` for hover cascading; SVGs using `currentColor` inherit
 * the correct gold tint from the icon container.
 *
 * Single-select semantics: consumers MUST wrap a row of GameModeCards in an
 * element with role="radiogroup" and an aria-label.
 */
export function GameModeCard({
  icon,
  countLabel,
  name,
  selected = false,
  onSelect,
}: GameModeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      className={[
        // Base layout — vertical stack, centred
        "group flex flex-col items-center gap-3",
        "cursor-pointer select-none",
        // No background, no border — cards float on the dark PvP bg
        "bg-transparent",
        // Focus ring
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        // Transition for text color changes
        "transition-colors duration-150",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Icon container — applies gold tint via currentColor */}
      <div
        className={[
          "flex items-center justify-center",
          "h-32 w-32",
          "transition-colors duration-150",
          // Selected: bright gold; unselected: dimmed gold; hover: brighten
          selected
            ? "text-gold-2"
            : "text-gold-4 group-hover:text-gold-2",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon}
      </div>

      {/* Count label — e.g. "5v5" */}
      <span
        className={[
          "font-display text-xs uppercase tracking-widest",
          "transition-colors duration-150",
          selected
            ? "text-grey-1"
            : "text-grey-2 group-hover:text-grey-1",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {countLabel}
      </span>

      {/* Mode name — e.g. "Summoner's Rift" */}
      <span
        className={[
          "font-display text-2xl uppercase tracking-widest text-center leading-tight",
          "transition-colors duration-150",
          selected
            ? "text-gold-1"
            : "text-grey-1 group-hover:text-gold-1",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {name}
      </span>
    </button>
  );
}
