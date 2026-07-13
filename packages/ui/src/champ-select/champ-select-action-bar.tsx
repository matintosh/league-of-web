"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChampSelectActionBarProps {
  /** Rune page name displayed in the dropdown, e.g. "Sorcery: The Calamity". */
  runePageName: string;
  /**
   * Called when the rune-page dropdown button is clicked.
   * v1: logs intent only — no popover; popover is a future enhancement.
   */
  onRunePageClick?: () => void;
  /**
   * Two summoner spell icon URLs (slot 0 = left/top, slot 1 = right/bottom).
   * Use `summonerSpellIconUrl(iconBaseName)` from @low/fixtures to build URLs.
   * Exactly 2 elements — the tuple enforces both slots are always supplied.
   */
  spellSrcs: [string, string];
  /**
   * Called when a summoner spell slot is clicked.
   * Index 0 = first slot, 1 = second slot.
   * v1: logs intent only — no picker popover.
   */
  onSpellClick?: (slotIndex: 0 | 1) => void;
  /**
   * Called when the emote button is clicked.
   * v1: no-op; future emote picker.
   */
  onEmoteClick?: () => void;
}

// ---------------------------------------------------------------------------
// Color mapping note (tokens-only rule)
// ---------------------------------------------------------------------------
// Bar background: #0c1a1d (measured) → closest token is grey-cool (#1e282d).
//   We use bg-grey-cool as the nearest dark teal-grey token.
// Rune dropdown border: #672725 (measured) — no token match.
//   Known divergence: uses CSS custom property --color-rune-border (#672725)
//   defined inline via style prop. Documented here per project policy.
// Rune dropdown bg: #252324 (measured) → nearest token is hextech-black (#010a13)
//   or grey-4 (#1e2328). We use bg-grey-4 as the closest available surface.
// Divider/separator lines: gold-5 (confirmed token match).
// Spell slot placeholder: bg-grey-4.
// Dropdown text: text-gold-cream (near-white gold, closest to measured near-white).
// Emote button border: border-gold-5 (matches divider family).

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ChampSelectActionBar — the rune-page selector, summoner-spell slots, and
 * emote button strip shown at the bottom of both champ-select screens
 * (pick phase and loadout phase).
 *
 * Layout (left → right):
 *   horizontal gold-5 accent line · spellbook glyph circle · rune-page dropdown
 *   · spell slot 0 · spell slot 1 · vertical gold-5 divider · emote button
 *   · horizontal gold-5 accent line
 *
 * Fully presentational — all interactions emit callbacks, no internal state.
 * Era: 2019 (matches champ-select corpus).
 */
export function ChampSelectActionBar({
  runePageName,
  onRunePageClick,
  spellSrcs,
  onSpellClick,
  onEmoteClick,
}: ChampSelectActionBarProps) {
  return (
    <div
      className="flex h-full w-full items-center gap-2 px-3"
      style={{ backgroundColor: "var(--color-grey-cool)" }}
    >
      {/* Left accent line — ~40px horizontal gold-5 rule */}
      <div className="h-px w-10 shrink-0 bg-gold-5" aria-hidden="true" />

      {/* Spellbook glyph circle — rune-book icon placeholder */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-5 text-gold-cream"
        aria-hidden="true"
        style={{ fontSize: "0.85rem" }}
      >
        {/* Stylised pen/rune glyph — matches the circular icon in the reference */}
        ✎
      </div>

      {/* Rune-page dropdown button */}
      {/* Known divergence: border color #672725 has no token — documented above */}
      <button
        type="button"
        onClick={onRunePageClick}
        aria-label={`Rune page: ${runePageName}. Click to change.`}
        className={[
          "group relative flex items-center justify-between gap-2",
          "h-9 min-w-0 shrink-0 px-3",
          "bg-grey-4",
          "transition-colors duration-150",
          onRunePageClick ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
        style={{
          width: 200,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#672725",
          borderRadius: 6,
        }}
      >
        {/* Rune page name */}
        <span
          className="truncate font-display text-sm text-gold-cream group-hover:text-gold-1"
          style={{ transition: "color 0.15s" }}
        >
          {runePageName}
        </span>

        {/* Up/down chevron arrows */}
        <div
          aria-hidden="true"
          className="flex shrink-0 flex-col items-center leading-none text-grey-2"
        >
          <span style={{ fontSize: "0.45rem", lineHeight: 1 }}>▲</span>
          <span style={{ fontSize: "0.45rem", lineHeight: 1 }}>▼</span>
        </div>
      </button>

      {/* Summoner spell slot 0 */}
      <button
        type="button"
        onClick={onSpellClick ? () => onSpellClick(0) : undefined}
        aria-label="Summoner spell slot 1. Click to change."
        className={[
          "group relative h-10 w-10 shrink-0 overflow-hidden",
          "border border-gold-5",
          onSpellClick ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
      >
        {spellSrcs[0] ? (
          <img
            src={spellSrcs[0]}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover transition-[filter] duration-150 group-hover:brightness-125"
          />
        ) : (
          <div className="h-full w-full bg-grey-4" />
        )}
      </button>

      {/* Summoner spell slot 1 */}
      <button
        type="button"
        onClick={onSpellClick ? () => onSpellClick(1) : undefined}
        aria-label="Summoner spell slot 2. Click to change."
        className={[
          "group relative h-10 w-10 shrink-0 overflow-hidden",
          "border border-gold-5",
          onSpellClick ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
      >
        {spellSrcs[1] ? (
          <img
            src={spellSrcs[1]}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover transition-[filter] duration-150 group-hover:brightness-125"
          />
        ) : (
          <div className="h-full w-full bg-grey-4" />
        )}
      </button>

      {/* Vertical divider */}
      <div className="mx-1 h-8 w-px shrink-0 bg-gold-5" aria-hidden="true" />

      {/* Emote button */}
      <button
        type="button"
        onClick={onEmoteClick}
        aria-label="Emote wheel. Click to open."
        className={[
          "group flex h-9 w-9 shrink-0 items-center justify-center",
          "border border-gold-5 bg-grey-4",
          "transition-colors duration-150",
          "hover:bg-grey-3",
          onEmoteClick ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
      >
        {/* Smiley face — matches the emote icon glyph in the reference */}
        <span
          className="text-gold-cream transition-colors duration-150 group-hover:text-gold-1"
          style={{ fontSize: "1.1rem", lineHeight: 1 }}
          aria-hidden="true"
        >
          🙂
        </span>
      </button>

      {/* Right accent line */}
      <div className="h-px flex-1 bg-gold-5" aria-hidden="true" />
    </div>
  );
}
