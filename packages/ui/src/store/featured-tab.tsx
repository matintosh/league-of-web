"use client";

import type { StoreItem, HeroSlide } from "@low/fixtures";
import { HeroCarousel } from "./hero-carousel";
import { StoreItemTile } from "./store-item-tile";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeaturedTabProps {
  /** Slides for the hero carousel (first slide shown by default). */
  heroSlides: HeroSlide[];
  /** Index of the currently active carousel slide. */
  activeSlideIndex: number;
  /**
   * Featured items rendered in the 2×2 right-column grid.
   * Exactly 4 items are expected; extra items are ignored.
   */
  featuredItems: StoreItem[];
  /**
   * Top-seller items rendered in the horizontal strip below the hero.
   * 4–5 items typical.
   */
  topSellers: StoreItem[];
  /** Called when the active carousel slide changes (dot clicked). */
  onSlideChange: (index: number) => void;
  /** Called when any item tile is clicked. */
  onItemClick: (id: string) => void;
  /** Called when the wishlist heart is toggled on any item. */
  onWishlist: (id: string) => void;
  /** URL for the RP coin icon — passed down to child components. */
  rpIconSrc?: string;
}

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="font-display text-xs uppercase tracking-widest text-grey-1">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// FeaturedTab
// ---------------------------------------------------------------------------

/**
 * FeaturedTab is the landing screen for the Store section.
 *
 * Two-column layout (≈1080px content width, 65/35 split):
 *
 * Left column:
 * - HeroCarousel (460×300px) — featured skin splash with dot navigation
 * - TOP SELLERS strip — horizontal row of StoreItemTile (strip variant)
 *
 * Right column:
 * - 2×2 grid of StoreItemTile (grid variant) — bundles and passes
 *
 * Presentational only. All state (active slide, wishlist) is owned by the parent.
 */
export function FeaturedTab({
  heroSlides,
  activeSlideIndex,
  featuredItems,
  topSellers,
  onSlideChange,
  onItemClick,
  onWishlist,
  rpIconSrc,
}: FeaturedTabProps) {
  const gridItems = featuredItems.slice(0, 4);

  return (
    <div className="flex flex-1 min-h-0 gap-3 p-3 bg-blue-7 overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Left column — hero + top sellers                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-2 shrink-0" style={{ width: 460 }}>
        {/* Hero carousel */}
        <HeroCarousel
          slides={heroSlides}
          activeIndex={activeSlideIndex}
          onSlideChange={onSlideChange}
          rpIconSrc={rpIconSrc}
        />

        {/* TOP SELLERS strip */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Top Sellers</SectionLabel>
          <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Top sellers">
            {topSellers.map((item) => (
              <div key={item.id} role="listitem">
                <StoreItemTile
                  item={item}
                  size="strip"
                  onClick={onItemClick}
                  onWishlist={onWishlist}
                  rpIconSrc={rpIconSrc}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right column — 2×2 featured bundle/pass grid                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "230px 230px" }}
          role="list"
          aria-label="Featured items"
        >
          {gridItems.map((item) => (
            <div key={item.id} role="listitem">
              <StoreItemTile
                item={item}
                size="grid"
                onClick={onItemClick}
                onWishlist={onWishlist}
                rpIconSrc={rpIconSrc}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
