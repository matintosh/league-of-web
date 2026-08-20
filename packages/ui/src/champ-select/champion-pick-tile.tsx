"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChampionPickTileProps {
  /** DDragon champion name, e.g. "Morgana". */
  name: string;
  /** Champion square icon URL from `championSquareUrl` in @low/fixtures. */
  imageSrc: string;
  /** Whether this tile is the currently selected champion. */
  selected?: boolean;
  /**
   * Whether this champion is taken (locked by another player).
   * When true: grayscale + dimmed, click is a no-op, aria-disabled="true".
   */
  disabled?: boolean;
  /**
   * Optional badge count rendered as a blue hex chip at the top-right.
   * Rendered only when != null — guard against badge={0} zero-trap.
   */
  badge?: number;
  /**
   * Called when the tile is clicked (not fired when disabled).
   */
  onSelect?: () => void;
}

// ---------------------------------------------------------------------------
// Style maps — exhaustive Records to catch union additions at typecheck time
// ---------------------------------------------------------------------------

type TileState = "default" | "hover" | "selected" | "disabled";

/** Border classes per visual state. */
const BORDER_CLASS: Record<TileState, string> = {
  default: "border-gold-5",
  hover: "border-gold-3",
  selected: "border-blue-2",
  disabled: "border-gold-5",
};

/** Text color for the champion name. */
const NAME_COLOR: Record<TileState, string> = {
  default: "text-grey-1",
  hover: "text-gold-1",
  selected: "text-gold-2",
  disabled: "text-grey-3",
};

// ---------------------------------------------------------------------------
// ChampionPickTile
// ---------------------------------------------------------------------------

/**
 * ChampionPickTile — a single champion cell in the pick-phase champion grid.
 *
 * ~64px champion square icon with the champion name truncated below.
 * Visual states:
 * - default: muted gold-5 border
 * - hover: gold-3 border (CSS hover — cannot be a Record value, applied via group-hover)
 * - selected: blue-2 (teal) border + subtle teal drop-shadow glow
 * - disabled-taken: grayscale + dimmed, aria-disabled, click no-op
 *
 * The optional `badge` prop renders a small blue-2 hex chip (the "6" badges
 * visible in the reference screenshot). It is rendered only when `badge != null`
 * to avoid the zero-trap where `badge={0}` would otherwise render a "0" chip.
 *
 * Drop-shadow glow on the selected state lives on an unclipped parent div
 * (not on the img directly) so it follows the element silhouette correctly
 * and is not clipped by overflow-hidden on the image container.
 *
 * The SVG filter id is derived from `useId()` to prevent collisions when
 * multiple tiles render in the showcase (hardcoded ids collide — recurring trap).
 *
 * @param name        Champion display name shown below the square.
 * @param imageSrc    Champion square icon URL (120×120 from DDragon).
 * @param selected    Whether this is the active selection (gold border + glow).
 * @param disabled    When true: grayscale, dimmed, aria-disabled, no click.
 * @param badge       Optional number chip in top-right corner (rendered only when != null).
 * @param onSelect    Called on click when not disabled.
 */
export function ChampionPickTile({
  name,
  imageSrc,
  selected = false,
  disabled = false,
  badge,
  onSelect,
}: ChampionPickTileProps) {
  const uid = useId();
  const filterId = `pick-tile-glow-${uid}`;

  const handleClick = () => {
    if (!disabled && onSelect) onSelect();
  };

  // Resolve which static state to key into Records.
  // Hover state is applied via CSS group-hover on the root element — children use group-hover: classes.
  const staticState: TileState = disabled ? "disabled" : selected ? "selected" : "default";

  return (
    <button
      type="button"
      aria-disabled={disabled ? "true" : undefined}
      aria-pressed={selected ? "true" : "false"}
      aria-label={`${name}${disabled ? " (taken)" : ""}${selected ? " (selected)" : ""}`}
      onClick={handleClick}
      className={[
        // Layout
        "group relative flex flex-col items-center gap-1 p-1",
        // Sizing — fixed to accommodate 64px tile + name + badge
        "w-[80px]",
        // Cursor
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        // Focus ring
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        // Opacity for disabled state
        disabled && "opacity-50",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Outer glow wrapper — drop-shadow on parent avoids clip-path issues   */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={[
          "relative shrink-0",
          // Selected glow via filter drop-shadow (applied after clipping, follows silhouette)
          selected ? "[filter:drop-shadow(0_0_6px_var(--color-blue-2))]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Champion square icon — 64×64                                      */}
        {/* ---------------------------------------------------------------- */}
        <div
          className={[
            "relative h-[72px] w-[72px] overflow-hidden border",
            BORDER_CLASS[staticState],
            // Hover border upgrade via group-hover (self → no group self-descendant trap)
            !disabled && !selected && "group-hover:border-gold-3",
            // Grayscale + dim for disabled
            disabled && "grayscale",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img
            src={imageSrc}
            alt={name}
            width={64}
            height={64}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Badge — small blue hex chip top-right; only when badge != null     */}
        {/* ---------------------------------------------------------------- */}
        {badge != null && (
          <div
            aria-label={`${badge} mastery`}
            className={[
              "absolute -top-1 -right-1",
              "flex h-4 w-4 items-center justify-center",
              "bg-blue-2 text-hextech-black",
              "font-body text-[9px] font-bold leading-none",
              // Hexagonal clip via clip-path polygon
              "[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]",
            ].join(" ")}
          >
            {badge}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Champion name — xs, truncated, below the icon                       */}
      {/* ------------------------------------------------------------------ */}
      <span
        className={[
          "w-full truncate text-center font-body text-xs leading-tight",
          NAME_COLOR[staticState],
          !disabled && !selected && "group-hover:text-gold-1",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {name}
      </span>
    </button>
  );
}
