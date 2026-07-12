'use client';

// ---------------------------------------------------------------------------
// EmoteTile — single emote item in the Collection inventory grid.
//
// ~80×80px square tile with border-grey-3. Emote art is displayed as a
// circular-clipped img inside. Unowned tiles are dimmed (brightness-50).
// Selected tiles get a gold-2 border highlight.
//
// Presentational only — props in, callbacks out. No data fetching.
// ---------------------------------------------------------------------------

export interface EmoteTileProps {
  /** Emote display name — used as aria-label and img alt text. */
  name: string;
  /** Emote art URL (stand-in: profileIconUrl; eventual: ddragon emote url). */
  imageSrc: string;
  /** Whether the player owns this emote. Unowned tiles are dimmed. */
  owned?: boolean;
  /** Whether this tile is currently selected in the inventory. */
  selected?: boolean;
  /** Called when owned tile is clicked. When omitted, root renders as <div>. */
  onSelect?: () => void;
}

/**
 * EmoteTile — inventory tile for an emote in the Collection emotes browser.
 *
 * Layout: ~80×80px square, 1px border-grey-3 background, circular art img
 * centered inside, name label below.
 *
 * Owned: full brightness, clickable (when onSelect provided).
 * Unowned: brightness-50, no pointer events on img (click allowed but
 *   unowned emotes should not be assigned — caller enforces this constraint).
 * Selected: border switches from grey-3 to gold-2.
 *
 * button/div split: renders as <button> when onSelect is provided, <div>
 * otherwise. aria-pressed reflects the selected state on the button variant.
 */
export function EmoteTile({
  name,
  imageSrc,
  owned = true,
  selected = false,
  onSelect,
}: EmoteTileProps) {
  const borderClass = selected
    ? "border border-gold-2"
    : "border border-grey-3";

  const content = (
    <div className="flex flex-col items-center gap-1.5 p-1.5">
      {/* Circular art — clipped to circle, full size of the 56px circle */}
      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-full">
        <img
          src={imageSrc}
          alt={name}
          width={56}
          height={56}
          className={[
            "w-full h-full object-cover transition-[filter] duration-150",
            owned ? "" : "brightness-50",
          ]
            .join(" ")
            .trim()}
        />
      </div>
      {/* Name label — small, truncated */}
      <span
        className={[
          "font-body text-[10px] leading-tight text-center w-full truncate px-0.5",
          owned ? "text-grey-1" : "text-grey-2",
        ].join(" ")}
      >
        {name}
      </span>
    </div>
  );

  // Shared styles — the root is 80×80px with a border
  const rootClass = [
    "relative flex flex-col items-center bg-hextech-black transition-colors duration-150",
    borderClass,
    "w-20 h-20",
  ].join(" ");

  if (onSelect) {
    return (
      <button
        type="button"
        aria-label={name}
        aria-pressed={selected}
        onClick={onSelect}
        className={[
          rootClass,
          "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          !owned ? "opacity-80" : "",
          !selected && owned ? "hover:border-gold-4" : "",
        ].join(" ")}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={rootClass} aria-label={name}>
      {content}
    </div>
  );
}
