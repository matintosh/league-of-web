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
// GameModeCardInfoPanel types (used by GameModeCardRow)
// ---------------------------------------------------------------------------

export interface QueueType {
  /** Display label, e.g. "BLIND PICK", "RANKED FLEX". */
  label: string;
  /**
   * When true, a warning triangle icon is shown next to the label.
   * Use for restricted or unavailable queue types (e.g. "RANKED FLEX" when unranked).
   */
  warning?: boolean;
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
          "h-40 w-40",
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
          "font-display text-4xl uppercase tracking-widest text-center leading-tight",
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

// ---------------------------------------------------------------------------
// GameModeCardRow
// ---------------------------------------------------------------------------

export interface GameModeCardRowProps {
  /**
   * The individual mode cards to render in the row.
   * Pass an array of <GameModeCard> elements.
   */
  cards: ReactNode;
  /**
   * Description paragraph for the selected mode.
   * Rendered below the gold separator when provided.
   */
  description?: string;
  /**
   * Queue type bullet list for the selected mode.
   * Each entry renders a ◈ diamond glyph + label.
   * Items with `warning: true` additionally show a warning triangle icon.
   */
  queueTypes?: QueueType[];
}

/**
 * GameModeCardRow wraps a row of GameModeCards with the selected-state info panel.
 *
 * Layout (matches the PvP mode-select ref):
 *   1. Full-width row of mode cards (cards slot).
 *   2. Full-width gold-4 horizontal separator.
 *   3. Selected mode description paragraph (left-aligned, grey-1).
 *   4. Queue-type bullet list — ◈ diamond + label per entry; warning items add a triangle icon.
 *
 * Presentational: description/queueTypes are passed by the parent;
 * card selection state lives in the parent via GameModeCard's `selected`/`onSelect`.
 */
export function GameModeCardRow({
  cards,
  description,
  queueTypes,
}: GameModeCardRowProps) {
  const hasPanel = description !== undefined || (queueTypes && queueTypes.length > 0);

  return (
    <div className="flex flex-col w-full">
      {/* Card row */}
      <div
        role="radiogroup"
        aria-label="Game mode"
        className="flex items-start justify-around w-full"
      >
        {cards}
      </div>

      {/* Gold separator — always visible to mirror ref */}
      <div className="w-full border-t border-gold-4 mt-4" />

      {/* Selected-state info panel */}
      {hasPanel && (
        <div className="flex flex-col gap-4 pt-5 px-2">
          {/* Description paragraph */}
          {description && (
            <p className="font-body text-sm text-grey-1 leading-relaxed max-w-xs">
              {description}
            </p>
          )}

          {/* Queue type bullets */}
          {queueTypes && queueTypes.length > 0 && (
            <ul className="flex flex-col gap-2">
              {queueTypes.map((qt, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 font-display text-xs uppercase tracking-widest"
                >
                  {/* ◈ diamond glyph — gold-3 for available, grey-2 for warned */}
                  <span
                    className={qt.warning ? "text-grey-2" : "text-gold-3"}
                    aria-hidden="true"
                  >
                    ◈
                  </span>

                  {/* Warning triangle icon — only shown when warning=true */}
                  {qt.warning && (
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-ban-red-1 shrink-0"
                    >
                      <path
                        d="M7 1.5L12.5 11.5H1.5L7 1.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <line
                        x1="7"
                        y1="5.5"
                        x2="7"
                        y2="8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="7" cy="10" r="0.75" fill="currentColor" />
                    </svg>
                  )}

                  <span className={qt.warning ? "text-grey-2" : "text-grey-1"}>
                    {qt.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
