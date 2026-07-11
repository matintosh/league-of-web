"use client";

import type { ChampionSummary } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type ChampionCardSize = "default" | "large";

export interface ChampionCardProps {
  /** Champion data — id + display name */
  champion: ChampionSummary;
  /**
   * Resolved art URL — caller derives with `loadingArtUrl(champion.id)` from `@low/fixtures`.
   * Loading art is 308×560 portrait (versionless CDN path).
   */
  artSrc: string;
  /**
   * Card size.
   * default: 160×244 (art 160×213, name bar 31px)
   * large:   240×366 (art 240×335, name bar 31px)
   */
  size?: ChampionCardSize;
  /**
   * When provided, the whole card becomes a button that calls onSelect(champion.id).
   */
  onSelect?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const SIZE: Record<"default" | "large", { width: number; artHeight: number; barHeight: number; text: string }> = {
  default: { width: 160, artHeight: 213, barHeight: 31, text: "text-xs" },
  large:   { width: 240, artHeight: 335, barHeight: 31, text: "text-sm" },
};

// ---------------------------------------------------------------------------
// ChampionCard
// ---------------------------------------------------------------------------

/**
 * ChampionCard — grid card for a champion in the collection browser.
 *
 * Loading-art portrait with a name bar. Art zooms on hover (clipped by
 * overflow-hidden — the card itself does NOT scale).
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function ChampionCard({
  champion,
  artSrc,
  size = "default",
  onSelect,
}: ChampionCardProps) {
  const { width, artHeight, barHeight, text } = SIZE[size];

  const artWindow = (
    <div
      className="relative overflow-hidden"
      style={{ width, height: artHeight }}
    >
      <img
        src={artSrc}
        alt={champion.name}
        width={width}
        height={artHeight}
        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
      />
    </div>
  );

  const nameBar = (
    <div
      className="bg-blue-7 flex items-center justify-center px-2"
      style={{ height: barHeight }}
    >
      <span className={`font-display uppercase tracking-widest text-gold-1 truncate ${text}`}>
        {champion.name}
      </span>
    </div>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(champion.id)}
        className="group cursor-pointer overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
        style={{ width }}
      >
        {artWindow}
        {nameBar}
      </button>
    );
  }

  return (
    <div
      className="overflow-hidden"
      style={{ width }}
    >
      {artWindow}
      {nameBar}
    </div>
  );
}
