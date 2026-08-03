/**
 * MerchCategoryTileGrid — responsive grid wrapper for MerchCategoryTile components.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client. Tokens-only, presentational, no 'use client' needed.
 *
 * Measured from merch.riotgames.com/en-us/collection/ (~1280px desktop):
 *   - Grid: 3 columns at lg, 2 at md, 1 at mobile
 *   - Gap: ~24px (gap-6) at lg; ~16px (gap-4) at md/sm
 *   - Container: max-w-7xl mx-auto px-6 py-8
 *   - Section heading: 36px (text-4xl), font-weight 800, uppercase,
 *     letter-spacing 0.04em, --color-merch-ink; py-10 px-6
 */

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchCategoryTileGridProps {
  /**
   * Section heading override.
   * @default "Collections"
   */
  heading?: string;
  /** CategoryTile nodes — render MerchCategoryTile elements here. */
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCategoryTileGrid — heading + responsive 3-column grid of category tiles.
 * Pass `MerchCategoryTile` elements as children.
 *
 * @example
 * <MerchCategoryTileGrid heading="Collections">
 *   {categories.map(c => (
 *     <MerchCategoryTile key={c.slug} {...c} onClick={handleTileClick} />
 *   ))}
 * </MerchCategoryTileGrid>
 */
export function MerchCategoryTileGrid({
  heading = "Collections",
  children,
}: MerchCategoryTileGridProps) {
  return (
    // aria-labelledby ties the section's accessible name to the visible heading
    <section aria-labelledby="collections-heading" style={{ fontFamily: "var(--font-merch)" }}>
      {/* Page heading */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1
          id="collections-heading"
          className="text-4xl font-extrabold uppercase tracking-[0.04em]"
          style={{ color: "var(--color-merch-ink)" }}
        >
          {heading}
        </h1>
      </div>

      {/* Tile grid */}
      <div className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}
