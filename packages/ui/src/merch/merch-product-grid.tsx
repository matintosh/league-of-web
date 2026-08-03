"use client";

/**
 * MerchProductGrid — responsive product grid wrapper for the Riot merch store.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens; NO hardcoded hex fallbacks in
 * var(--color-merch-*)), presentational (props in/callbacks out, NO fetching
 * in @low/ui, types from @low/fixtures — reuse the existing MerchProduct type;
 * product image URLs via championSplashUrl from the page, never fetched in
 * @low/ui), showcase server-safe (no 'use client'), SVG/gradient ids from useId.
 *
 * Measured from merch.riotgames.com (~1280px desktop, shop-all / collection pages):
 *   - Grid: 4 columns, ~20px gap at md+; 2 columns, 12px gap below md
 *   - Section heading: 24px, font-weight 700, uppercase, letter-spacing 0.04em, ink
 *   - Heading bottom margin: 24px (mb-6)
 *   - "Shop All →" link: 13px, uppercase, letter-spacing 0.08em, red / red-dark on hover
 *   - Section padding: py-12 (48px top + bottom)
 *   - Container: max-w-7xl mx-auto px-6
 */

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchProductGridProps {
  /** Optional section heading, e.g. "New Arrivals". */
  heading?: string;
  /**
   * Optional "Shop All" link label.
   * @default "Shop All"
   * Shown only when `onShopAll` is provided.
   */
  shopAllLabel?: string;
  /** Called when the "Shop All" link is clicked. */
  onShopAll?: () => void;
  /** Product card nodes — render MerchProductCard elements here. */
  children?: ReactNode;
  /**
   * Number of columns at the lg breakpoint.
   * @default 4
   */
  columns?: 2 | 3 | 4;
  /** Shown when children is empty or undefined. */
  emptyMessage?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the grid-cols Tailwind class string for a given columns value. */
function gridColsClasses(columns: 2 | 3 | 4): string {
  switch (columns) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 md:grid-cols-3";
    case 4:
    default:
      return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductGrid — section wrapper that renders a responsive product grid.
 * Pass `MerchProductCard` elements as children.
 *
 * @example
 * <MerchProductGrid heading="New Arrivals" onShopAll={() => router.push('/shop-all')}>
 *   {products.map(p => <MerchProductCard key={p.slug} {...p} />)}
 * </MerchProductGrid>
 */
export function MerchProductGrid({
  heading,
  shopAllLabel = "Shop All",
  onShopAll,
  children,
  columns = 4,
  emptyMessage = "No products found.",
}: MerchProductGridProps) {
  const isEmpty =
    children === undefined ||
    children === null ||
    (Array.isArray(children) && children.length === 0);

  return (
    <section
      className="py-12"
      style={{ fontFamily: "var(--font-merch)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading row */}
        {(heading || onShopAll) && (
          <div className="mb-6 flex items-baseline justify-between">
            {heading && (
              <h2
                className="text-2xl font-bold uppercase tracking-[0.04em]"
                style={{ color: "var(--color-merch-ink)" }}
              >
                {heading}
              </h2>
            )}

            {onShopAll && (
              <button
                type="button"
                onClick={onShopAll}
                className="border-0 bg-transparent p-0 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-150 hover:underline"
                style={{ color: "var(--color-merch-red)", cursor: "pointer" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--color-merch-red-dark)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--color-merch-red)";
                }}
              >
                {shopAllLabel} →
              </button>
            )}
          </div>
        )}

        {/* Grid or empty state */}
        {isEmpty ? (
          <p
            className="py-16 text-center text-sm"
            style={{ color: "var(--color-merch-muted)" }}
          >
            {emptyMessage}
          </p>
        ) : (
          <div className={`grid ${gridColsClasses(columns)} gap-3 md:gap-5`}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
