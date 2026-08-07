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
 * Real 2-col grid (measured from merch.riotgames.com shop-all at 1280px):
 *   - Grid: 2 columns, 0 gap (flush cards sharing 1px border dividers)
 *   - Card width: ~640px each
 *   - REFINE button: top-right, red bg, white text, sliders icon, uppercase
 *   - Result count: shown left of (or near) heading, e.g. "(16)"
 *   - Section padding: py-0 for the 2-col listing (no extra spacing, flush to hero)
 *
 * Brand-rail layout (homepage model):
 *   - Left vertical brand label + optional top-right filter-badge chips
 *   - 4-column grid, 20px gap (the real homepage uses the narrower 4-col)
 */

import { useId, Children, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";

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
   * Used in the brand-rail homepage layout only.
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
   * Number of columns at the desktop breakpoint.
   * - 2: real 2-col flush listing (shop-all, collection, search) — gap 0, border dividers
   * - 3: 3-col at md+
   * - 4: 4-col at lg+ (homepage brand-rail default)
   * @default 4
   */
  columns?: 2 | 3 | 4;
  /** Shown when children is empty or undefined. */
  emptyMessage?: string;
  /**
   * Total result count shown in the listing header (e.g. 16).
   * Rendered as "(16)" beside the heading/breadcrumb. Only shown when > 0.
   */
  resultCount?: number;
  /**
   * Called when the "REFINE" button is clicked.
   * When provided (or `showRefine` is true), the REFINE button renders top-right.
   */
  onRefineClick?: () => void;
  /**
   * Force-render the REFINE button even without an onRefineClick handler.
   * Useful for presentational showcase demos.
   */
  showRefine?: boolean;
  /**
   * Called when the "LOAD MORE" button is clicked.
   * When provided (or `showLoadMore` is true), the LOAD MORE button renders below the grid.
   * Measured from real merch.riotgames.com: 239×50 centered at desktop; full-width 50px at mobile.
   * riotSans 16/600 uppercase, ls 0.32px.
   */
  onLoadMore?: () => void;
  /**
   * Force-render the LOAD MORE button even without an onLoadMore handler.
   * Useful for presentational showcase demos.
   * @default false
   */
  showLoadMore?: boolean;
  /**
   * Visual treatment for the LOAD MORE button in the 2-col listing layout.
   *
   * - `"red"` (default for columns=2): solid red fill (--color-merch-refine) +
   *   white text (--color-merch-on-dark). Used on shop-all, category, and sale pages.
   *   Measured from real merch.riotgames.com: 239×50 centered @1280, full-width @390;
   *   riotSans 16/600, ls 0.32px, no border/outline.
   * - `"gold-framed"`: gold fill (--color-merch-gold-cta) + black text
   *   (--color-merch-ink-dark) with an OUTER offset 1px light outline ~6px outside
   *   the fill and a corner notch top-left. Used on the homepage.
   *
   * Only has effect when `columns === 2`.
   * @default "red"
   */
  loadMoreVariant?: "red" | "gold-framed";
  /**
   * When true, the first child spans both columns (grid-column: 1 / -1),
   * creating the "featured first card" layout seen at the top of each
   * franchise group on the real homepage.
   * Real: first product container 1280×750, image 600px tall, object-contain on #F7F7F7.
   * Only effective when columns=2.
   * @default false
   */
  featuredFirst?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns Tailwind grid-cols classes for a given columns value. */
function gridColsClasses(columns: 2 | 3 | 4): string {
  switch (columns) {
    case 2:
      // 2-col flush at sm+; single col on very narrow (below sm)
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 md:grid-cols-3";
    case 4:
    default:
      return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }
}

// ---------------------------------------------------------------------------
// Refine button icon (sliders / filter icon)
// ---------------------------------------------------------------------------

function RefineIcon({ id }: { id: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      style={{ width: 14, height: 14, display: "block" }}
      aria-labelledby={id}
    >
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
      <circle cx="5" cy="4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductGrid — section wrapper that renders a responsive product grid.
 * Pass `MerchProductCard` elements as children.
 *
 * Supports three layout models:
 * 1. **2-col flush listing** (columns=2) — the real shop-all/collection design:
 *    gap-0 (flush cards sharing border dividers), REFINE button top-right,
 *    result count beside heading. Pass `resultCount` and `onRefineClick`.
 * 2. **Brand-rail collection grid** (brandRail prop) — homepage model:
 *    vertical brand label left, filter-badge chips top-right.
 * 3. **Legacy heading + Shop All** — fallback for older page clients.
 *
 * @example
 * // 2-col flush listing (shop-all, collection, search)
 * <MerchProductGrid columns={2} resultCount={products.length} onRefineClick={() => {}}>
 *   {products.map(p => <MerchProductCard key={p.slug} {...p} />)}
 * </MerchProductGrid>
 *
 * @example
 * // Brand-rail model (homepage)
 * <MerchProductGrid
 *   brandRail="League of Legends"
 *   filterBadges={[{ label: "New" }, { label: "Limited Edition" }]}
 * >
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
  resultCount,
  onRefineClick,
  showRefine,
  onLoadMore,
  showLoadMore = false,
  featuredFirst = false,
  loadMoreVariant = "red",
}: MerchProductGridProps) {
  const refineIconId = useId();

  const isEmpty =
    children === undefined ||
    children === null ||
    (Array.isArray(children) && children.length === 0);

  const hasBrandRail = Boolean(brandRail);
  const hasFilterBadges = filterBadges && filterBadges.length > 0;
  const hasLegacyHeader = Boolean(heading || onShopAll);
  const showRefineButton = Boolean(onRefineClick) || Boolean(showRefine);
  const showResultCount = resultCount !== undefined && resultCount > 0;
  const showLoadMoreButton = Boolean(onLoadMore) || Boolean(showLoadMore);

  // ── 2-col flush listing layout ────────────────────────────────────────────
  if (columns === 2) {
    return (
      <section
        style={{ fontFamily: "var(--font-merch)" }}
      >
        {/* Listing header: result count (left) + REFINE button (right) */}
        {(showResultCount || showRefineButton || heading) && (
          <div
            className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          >
            <div className="flex items-baseline gap-2">
              {heading && (
                <h2
                  className="text-[18px] font-bold uppercase tracking-[0.04em]"
                  style={{ color: "var(--color-merch-ink)" }}
                >
                  {heading}
                </h2>
              )}
              {showResultCount && (
                <span
                  className="text-[14px]"
                  style={{ color: "var(--color-merch-muted)" }}
                >
                  ({resultCount})
                </span>
              )}
            </div>

            {showRefineButton && (
              <button
                type="button"
                onClick={onRefineClick}
                className="flex items-center gap-1.5 pl-2 pr-4 text-[16px] font-bold uppercase transition-colors duration-150"
                style={{
                  width: 113,
                  height: 40,
                  backgroundColor: "var(--color-merch-refine)",
                  color: "var(--color-merch-on-dark)",
                  border: "none",
                  borderRadius: 2,
                  cursor: "pointer",
                  flexShrink: 0,
                  letterSpacing: "normal",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-refine-dark)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-refine)";
                }}
              >
                <RefineIcon id={refineIconId} />
                Refine
              </button>
            )}
          </div>
        )}

        {/* Flush 2-col grid — no padding, no outer gap.
            featuredFirst: first child spans both columns (grid-column: 1 / -1),
            matching the real homepage franchise-group featured card layout.
            Real: first product container full-width, image 600px tall, object-contain
            on #F7F7F7. Remaining cards are standard 640px-wide 2-col tiles. */}
        {isEmpty ? (
          <div className="mx-auto max-w-7xl px-6">
            <p
              className="py-16 text-center text-sm"
              style={{ color: "var(--color-merch-muted)" }}
            >
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2"
            style={{ borderTop: "1px solid var(--color-merch-on-dark)" }}
          >
            {featuredFirst
              ? Children.map(children, (child, index) => {
                  if (index === 0 && isValidElement(child)) {
                    // First child spans both columns — the "featured" card.
                    // Wrap in a div so we don't mutate the child's own style prop.
                    return (
                      <div style={{ gridColumn: "1 / -1" }}>
                        {cloneElement(child as ReactElement<{ imageHeight?: number }>, {
                          imageHeight: (child as ReactElement<{ imageHeight?: number }>).props.imageHeight ?? 600,
                        })}
                      </div>
                    );
                  }
                  return child;
                })
              : children}
          </div>
        )}

        {/* LOAD MORE — centered 239×50 at desktop; full-width 50px at mobile.
            Per-page treatment controlled by loadMoreVariant prop:
            - "red" (default, shop-all/category/sale): solid red fill
              (--color-merch-refine = #eb0029), white riotSans 16/600 text,
              ls 0.32px, no border/outline. 239×50 @1280; full-width 50px @390.
            - "gold-framed" (homepage): gold fill (--color-merch-gold-cta),
              black text, outer offset frame + corner notch (see merch-layout.css). */}
        {showLoadMoreButton && (
          <div
            className="flex justify-center px-0 py-8 md:py-10"
          >
            {loadMoreVariant === "gold-framed" ? (
              /* Gold-framed variant: outer offset frame + corner notch.
                 data-hp-load-more picked up by merch-layout.css for the frame. */
              <button
                type="button"
                data-hp-load-more
                onClick={onLoadMore}
                className="w-full md:w-auto"
                style={{
                  height: 50,
                  minWidth: 239,
                  paddingLeft: 32,
                  paddingRight: 32,
                  backgroundColor: "var(--color-merch-gold-cta)",
                  color: "var(--color-merch-ink-dark)",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "var(--font-merch-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.32px",
                  transition: "opacity 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                Load More
              </button>
            ) : (
              /* Red variant (default) — shop-all, category, sale pages.
                 Solid red fill, white text, no outline/frame. */
              <button
                type="button"
                onClick={onLoadMore}
                className="w-full md:w-auto"
                style={{
                  height: 50,
                  minWidth: 239,
                  paddingLeft: 32,
                  paddingRight: 32,
                  backgroundColor: "var(--color-merch-refine)",
                  color: "var(--color-merch-on-dark)",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "var(--font-merch-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.32px",
                  transition: "background-color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-refine-dark)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-refine)";
                }}
              >
                Load More
              </button>
            )}
          </div>
        )}
      </section>
    );
  }

  // ── Brand-rail layout (homepage) ──────────────────────────────────────────
  if (hasBrandRail) {
    return (
      <section
        className="py-12"
        style={{ fontFamily: "var(--font-merch)" }}
      >
        <div className="mx-auto max-w-7xl px-6">
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
        </div>
      </section>
    );
  }

  // ── Legacy layout — optional heading + Shop All row ───────────────────────
  return (
    <section
      className="py-12"
      style={{ fontFamily: "var(--font-merch)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
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
      </div>
    </section>
  );
}
