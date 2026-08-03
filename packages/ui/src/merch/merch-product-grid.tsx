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
 *   - Brand-rail label: small uppercase, muted, vertical on left or top-left of grid block
 *   - Filter-badge row: top-right filter chips (New / Limited Edition / Preorder)
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

/** A clickable filter chip label shown in the top-right of the grid header. */
export interface MerchFilterBadge {
  /** Display label, e.g. "New", "Limited Edition", "Preorder". */
  label: string;
  /** Whether this badge is currently active/selected. */
  active?: boolean;
  /** Called when the badge is clicked. */
  onClick?: () => void;
}

export interface MerchProductGridProps {
  /**
   * Left brand-rail label, e.g. "LEAGUE OF LEGENDS".
   * Rendered as a small uppercase muted label to the left of the grid block
   * (or above on narrow viewports). Omit for shop-all / collection pages.
   */
  brandRail?: string;
  /** Optional section heading, e.g. "New Arrivals". */
  heading?: string;
  /**
   * Optional filter-badge chips shown in the top-right of the header row
   * (e.g. New / Limited Edition / Preorder). Omit to hide the filter row.
   */
  filterBadges?: MerchFilterBadge[];
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
 * Supports two layout models:
 * 1. Legacy heading + Shop All — pass `heading` and/or `onShopAll`.
 * 2. Brand-rail collection grid — pass `brandRail` and optionally `filterBadges`.
 *    Renders a vertical brand label to the left and filter chips top-right,
 *    matching the real merch.riotgames.com homepage collection grid.
 *
 * @example
 * // Brand-rail model (homepage)
 * <MerchProductGrid
 *   brandRail="League of Legends"
 *   filterBadges={[{ label: "New" }, { label: "Limited Edition" }, { label: "Preorder" }]}
 * >
 *   {products.map(p => <MerchProductCard key={p.slug} {...p} />)}
 * </MerchProductGrid>
 *
 * @example
 * // Shop All model (shop-all / collection pages)
 * <MerchProductGrid heading="New Arrivals" onShopAll={() => router.push('/shop-all')}>
 *   {products.map(p => <MerchProductCard key={p.slug} {...p} />)}
 * </MerchProductGrid>
 */
export function MerchProductGrid({
  brandRail,
  heading,
  filterBadges,
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

  const hasBrandRail = Boolean(brandRail);
  const hasFilterBadges = filterBadges && filterBadges.length > 0;
  const hasLegacyHeader = Boolean(heading || onShopAll);

  return (
    <section
      className="py-12"
      style={{ fontFamily: "var(--font-merch)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* ---------------------------------------------------------------- */}
        {/* Brand-rail layout — left label + top-right filter chips          */}
        {/* ---------------------------------------------------------------- */}
        {hasBrandRail ? (
          <div className="flex gap-8">
            {/* Left brand-rail label — vertical on lg+, top on mobile */}
            <div className="hidden flex-shrink-0 lg:flex lg:w-10 lg:flex-col lg:items-center lg:pt-1">
              <span
                className="rotate-180 select-none text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  writingMode: "vertical-rl",
                  color: "var(--color-merch-muted)",
                }}
              >
                {brandRail}
              </span>
            </div>

            {/* Grid block */}
            <div className="min-w-0 flex-1">
              {/* Mobile brand label + filter row */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 lg:mb-0">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] lg:hidden"
                  style={{ color: "var(--color-merch-muted)" }}
                >
                  {brandRail}
                </span>

                {/* Filter-badge chips */}
                {hasFilterBadges && (
                  <div className="flex flex-wrap items-center gap-2 lg:mb-5 lg:w-full lg:justify-end">
                    {filterBadges.map((fb) => (
                      <button
                        key={fb.label}
                        type="button"
                        onClick={fb.onClick}
                        className="border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150"
                        style={
                          fb.active
                            ? {
                                backgroundColor: "var(--color-merch-ink)",
                                color: "var(--color-merch-on-dark)",
                                borderColor: "var(--color-merch-ink)",
                                cursor: "pointer",
                              }
                            : {
                                backgroundColor: "var(--color-merch-bg)",
                                color: "var(--color-merch-muted)",
                                borderColor: "var(--color-merch-border)",
                                cursor: "pointer",
                              }
                        }
                      >
                        {fb.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid */}
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
          </div>
        ) : (
          /* ---------------------------------------------------------------- */
          /* Legacy layout — optional heading + Shop All row                  */
          /* ---------------------------------------------------------------- */
          <>
            {hasLegacyHeader && (
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
          </>
        )}
      </div>
    </section>
  );
}
