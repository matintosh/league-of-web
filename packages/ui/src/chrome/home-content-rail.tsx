"use client";

import { useId } from "react";

/** A single selectable featured-content row in the rail. */
export interface HomeContentRailItem {
  /** Stable id passed to `onSelect`. */
  id: string;
  /**
   * Uppercase label shown next to the gem bullet. May contain multiple words
   * that wrap onto 1–2 lines; embed a `\n` to force a specific line break.
   */
  label: string;
  /**
   * Champion portrait / square art URL. Shown only when this row is active.
   * Supplied by the page — the component never fetches.
   */
  thumbnailSrc?: string;
}

export interface HomeContentRailProps {
  /** Ordered list of featured rows, top → bottom. */
  items: HomeContentRailItem[];
  /** Id of the currently active (highlighted) row. */
  activeId: string;
  /** Fired with a row's id when the player selects it (including the pinned item). */
  onSelect: (id: string) => void;
  /**
   * Optional row pinned to the bottom of the rail, separated from the main
   * list (e.g. "PATCH NOTES"). Selecting it also fires `onSelect`.
   */
  pinnedItem?: { id: string; label: string };
}

/**
 * HomeContentRail — the left content-link rail of the current-era LEAGUE HOME.
 *
 * A vertical stack of featured rows the player selects to change the featured
 * splash on the right, plus one row pinned to the bottom (PATCH NOTES). Each
 * row is a gem bullet + a 1–2 line uppercase display label; the active row is
 * brighter gold and shows the item's champion thumbnail when present.
 *
 * Presentational: props in, callbacks out. No fetching — thumbnail art arrives
 * as a `src` string from the page. Rows use vertical tablist semantics
 * (`role="tab"` + `aria-selected`), since selecting a row swaps a featured
 * panel.
 */
export function HomeContentRail({
  items,
  activeId,
  onSelect,
  pinnedItem,
}: HomeContentRailProps) {
  return (
    <div
      data-shot="home-content-rail"
      role="tablist"
      aria-orientation="vertical"
      className="flex h-full w-full min-w-[230px] max-w-[260px] flex-col py-6"
      // #503: SEMI-TRANSPARENT scrim (was opaque `bg-hextech-black`) so the
      // featured splash + flames bleed through behind the rail, matching the
      // reference. Left-heavier gradient: denser hextech-black near the far-left
      // edge for label/bullet legibility, thinning toward the seam so the art
      // stays faintly visible. Overall ~62% opacity — art readable, text crisp.
      style={{
        background:
          "linear-gradient(to right, color-mix(in srgb, var(--color-hextech-black) 72%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 62%, transparent) 60%, color-mix(in srgb, var(--color-hextech-black) 52%, transparent) 100%)",
      }}
    >
      <div className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <ContentRailRow
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>

      {pinnedItem != null && (
        <div className="mt-6 border-t border-gold-5 pt-4">
          <ContentRailRow
            item={pinnedItem}
            isActive={pinnedItem.id === activeId}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
}

interface ContentRailRowProps {
  item: HomeContentRailItem;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function ContentRailRow({ item, isActive, onSelect }: ContentRailRowProps) {
  const showThumb = isActive && item.thumbnailSrc != null;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(item.id)}
      className={[
        "group flex w-full cursor-pointer items-center gap-3 px-5 py-1.5 text-left transition-colors duration-150",
        isActive ? "text-gold-1" : "text-gold-cream hover:text-gold-1",
      ].join(" ")}
    >
      {showThumb ? (
        <img
          src={item.thumbnailSrc}
          alt=""
          aria-hidden="true"
          className="h-8 w-8 shrink-0 rounded-sm border border-gold-5 object-cover"
        />
      ) : (
        <GemBullet className="h-4 w-4 shrink-0" />
      )}

      <span
        className={[
          "whitespace-pre-line font-display text-[13px] uppercase leading-tight tracking-wide",
          isActive ? "font-semibold" : "",
        ].join(" ")}
      >
        {item.label}
      </span>
    </button>
  );
}

/**
 * Gold gem/diamond bullet glyph — a faceted diamond, token-filled via
 * `currentColor` so it inherits the row's active/inactive gold. Decorative.
 */
function GemBullet({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="1" x2="8" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d="M8 1 15 8 8 15 1 8 8 1Z" fill={`url(#${gradientId})`} />
      <path d="M8 1 15 8 8 15 1 8 8 1Z" stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
      <path d="M8 1 8 15M1 8 15 8" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.55" />
    </svg>
  );
}
