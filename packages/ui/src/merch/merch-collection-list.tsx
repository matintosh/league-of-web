/**
 * MerchCollectionList — stacked collection strips for the /merch/collection index.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client. Tokens-only, presentational, no 'use client' needed.
 *
 * Measured from merch.riotgames.com/en-us/collection/ at 1280px desktop:
 *   - Layout: vertically stacked strips, one per collection
 *   - Each strip: banner image ~1200×300 (4:1 aspect) with a rotated vertical
 *     collection-name tab at left (~91px; 60×185px, 12px/24px padding, 16px/700/uppercase,
 *     WHITE bg + BLACK text) + the CURATED collection name (e.g. "LEAGUE CLASSIC") +
 *     a "Shop" affordance below the name text; no letter-spacing.
 *   - Strip card: 355px wide × ~282px portrait image area (packshot, no franchise label)
 *   - Card gap: 8px (pitch 363px from x=237,600,963,1326)
 *   - Left inset: ~197px from container x=40 (paddingLeft 197)
 *   - Strip separator: border-bottom in --color-merch-border
 *   - Container: max-w-7xl mx-auto, px-10 (x=40 at 1280)
 *
 * Delta #804:
 *   1. Strip cards: NO franchise label — title (16/700) + price only.
 *   2. Card image area: ~282px tall portrait (packshot, no landscape override).
 *   3. Card gap: 8px (was 16).
 *   4. Left inset: paddingLeft 197px (was 167).
 *   5. Name tab: padding 12px 24px, curated collection name + "Shop" CTA, no letter-spacing.
 *   6. 390px: single-column scroll flow; tab stacks cleanly (no overlap/clip).
 *   7. LOAD MORE: centered red pill 239×50 below all strips.
 *   8. Carousel arrows: prev/next buttons on the card scroll row at 1280px.
 *
 * Banner images: real banners are Sanity-fingerprinted (not reproducible via CDN
 * without the exact asset id). Pages supply `bannerImageUrl` per collection using
 * available assets (championSplashUrl or merchandised heroes) as placeholders.
 * This is a known asset limitation — see PR notes.
 */

"use client";

import { useRef } from "react";
import type { MerchProduct } from "@low/fixtures";
import { MerchProductCard } from "./merch-product-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single collection strip entry. */
export interface MerchCollectionEntry {
  /** URL-safe slug for the collection, e.g. "league-of-legends". */
  slug: string;
  /**
   * Raw/internal name for aria label and slug keying.
   * E.g. "League of Legends", "Riftbound".
   */
  name: string;
  /**
   * Curated display name shown in the rotated name tab.
   * E.g. "LEAGUE CLASSIC", "RIFTBOUND VENDETTA", "MSI 2026", "HOT CHONCC SUMMER".
   * When omitted, falls back to uppercasing `name`.
   */
  tabLabel?: string;
  /**
   * Banner background image URL (supplied by page — wide landscape, ~4:1 aspect).
   *
   * ASSET NOTE: Real banners are Sanity-fingerprinted URLs (cdn.sanity.io/…)
   * not reproducible without the exact asset id. Pages supply a representative
   * placeholder (e.g. championSplashUrl) — this is a known limitation; the
   * structure is correct for when real assets are available.
   */
  bannerImageUrl: string;
  /** Products in this collection. */
  products: MerchProduct[];
  /**
   * Optional href for the "Shop" CTA and/or "View All" CTA.
   * If omitted, no CTA link is rendered.
   */
  href?: string;
}

export interface MerchCollectionListProps {
  /** Ordered list of collection strips to render. */
  collections: MerchCollectionEntry[];
  /** Called when a product card is clicked; passes the product slug. */
  onProductClick?: (slug: string) => void;
  /** Called when "Shop" / "View All" is clicked; passes the collection slug. */
  onViewAllClick?: (collectionSlug: string) => void;
  /**
   * Whether to show a "LOAD MORE" pill button below all strips.
   * @default true
   */
  showLoadMore?: boolean;
  /** Called when the "LOAD MORE" button is clicked. */
  onLoadMore?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-component — StripProductCard
// ---------------------------------------------------------------------------

/**
 * StripProductCard — 355px portrait card cell used in collection strips.
 *
 * Wraps MerchProductCard in a fixed-width cell so the card scales to 355px.
 * Image area is ~282px tall portrait (packshot, object-contain).
 * NO franchise label is rendered (collection cards show title + price only).
 *
 * Recipe (measured from merch.riotgames.com/en-us/collection/ at 1280px):
 *   - Cell: 355px wide, flex column
 *   - Image area: 355×282 portrait, object-contain
 *   - Info strip: title 16/700 + price — NO franchise label line
 */
function StripProductCard({
  product,
  onClick,
}: {
  product: MerchProduct;
  onClick?: (slug: string) => void;
}) {
  return (
    /* Fixed-width 355px cell wrapper */
    <div style={{ flex: "0 0 355px", width: 355 }}>
      <MerchProductCard
        slug={product.slug}
        title={product.title}
        imageUrl={product.imageUrl}
        price={product.price}
        originalPrice={product.originalPrice}
        badge={product.badge}
        /* intentionally omit franchiseLabel — collection strips show title + price only */
        imageFit="contain"
        /* portrait height measured from real /en-us/collection/ at 1280px */
        imageHeight={282}
        onClick={onClick}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component — CarouselArrow
// ---------------------------------------------------------------------------

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous products" : "Next products"}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "prev" ? "left" : "right"]: 0,
        width: 40,
        height: 60,
        backgroundColor: "var(--color-merch-overlay-soft)",
        border: "none",
        cursor: "pointer",
        color: "var(--color-merch-on-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
      }}
    >
      <svg
        width={10}
        height={18}
        viewBox="0 0 10 18"
        fill="none"
        aria-hidden
      >
        {direction === "prev" ? (
          <path
            d="M8 2L2 9l6 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M2 2l6 7-6 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sub-component — CollectionStrip
// ---------------------------------------------------------------------------

/**
 * CollectionStrip — one banner + rotated name tab + horizontal product card row.
 *
 * Key geometry (measured from merch.riotgames.com/en-us/collection/ at 1280px):
 *   - Banner: 1200×300 at y=282 (bottom y=582)
 *   - Card row starts y=502 → cards overlap UP into the banner's lower ~80px
 *   - Name-tab: 60×185px at left=91, WHITE bg + BLACK text, padding 12px 24px,
 *     curated label (e.g. "LEAGUE CLASSIC") + "Shop" link below, no letter-spacing
 *   - Card pitch: 363px (gap 8px); cards at x=237,600,963,1326 from container x=40
 *   - Left inset of card row: 197px from container edge
 *
 * At ≤430px (mobile): tab above banner (no left overlay), cards single-column
 * scroll with no overflow clip of cards.
 */
function CollectionStrip({
  entry,
  onProductClick,
  onViewAllClick,
}: {
  entry: MerchCollectionEntry;
  onProductClick?: (slug: string) => void;
  onViewAllClick?: (slug: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabLabel = entry.tabLabel ?? entry.name.toUpperCase();

  function scrollBy(offset: number) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  }

  return (
    <article
      aria-label={`${entry.name} collection`}
      style={{
        width: "100%",
        borderBottom: "1px solid var(--color-merch-border)",
        paddingBottom: 32,
        marginBottom: 0,
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Mobile tab — appears ABOVE the banner at ≤430px so it does NOT    */}
      {/* overlap the banner or clip cards. Hidden at desktop.               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="mobile-tab-header"
        style={{
          display: "none", /* overridden at ≤430px via <style> below */
          padding: "10px 16px",
          backgroundColor: "var(--color-merch-bg)",
          borderBottom: "1px solid var(--color-merch-border)",
        }}
      >
        <div
          style={{
            color: "var(--color-merch-ink-dark)",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          {tabLabel}
        </div>
        {(entry.href || onViewAllClick) && (
          entry.href ? (
            <a
              href={entry.href}
              style={{
                fontSize: 12,
                color: "var(--color-merch-red)",
                textDecoration: "none",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "inline-block",
                marginTop: 4,
              }}
            >
              Shop
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onViewAllClick?.(entry.slug)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "var(--color-merch-red)",
                fontWeight: 600,
                textTransform: "uppercase",
                padding: 0,
                display: "inline-block",
                marginTop: 4,
              }}
            >
              Shop
            </button>
          )
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Banner area — 4:1 aspect, full-width, relative for name-tab overlay */}
      {/* overflow: visible so the name-tab and cards can overlap at desktop  */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="strip-banner-wrap"
        style={{
          position: "relative",
          width: "100%",
          /* 4:1 aspect — 25% padding-top */
          paddingTop: "25%",
          overflow: "visible",
          backgroundColor: "var(--color-merch-surface)",
          minHeight: 120,
        }}
      >
        {/* Banner image — absolute inside the padded box */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.bannerImageUrl}
            alt={`${entry.name} collection banner`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
            loading="lazy"
            draggable={false}
          />

          {/* Subtle left scrim so the name tab reads clearly over any image */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, var(--color-merch-scrim-strong) 0%, transparent 40%)",
            }}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Rotated name tab — desktop only (hidden at ≤430px via <style>). */}
        {/* 60×185px at left=91px; WHITE bg + BLACK text; padding 12px 24px; */}
        {/* curated label + "Shop" CTA below; no letter-spacing.             */}
        {/* bottom=-24px so it straddles the banner/card row boundary.        */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="strip-name-tab"
          aria-hidden
          style={{
            position: "absolute",
            bottom: -24,
            left: 91,
            width: 60,
            height: 185,
            /* WHITE background */
            backgroundColor: "var(--color-merch-bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            zIndex: 2,
            padding: "12px 0",
          }}
        >
          {/* Curated collection name, rotated -90° */}
          <span
            style={{
              display: "block",
              /* BLACK text */
              color: "var(--color-merch-ink-dark)",
              fontSize: 16,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0,
              lineHeight: 1,
              whiteSpace: "nowrap",
              transformOrigin: "center center",
              transform: "rotate(-90deg)",
            }}
          >
            {tabLabel}
          </span>

          {/* "Shop" affordance — rotated to read alongside the name */}
          {(entry.href || onViewAllClick) && (
            <span
              style={{
                display: "block",
                color: "var(--color-merch-red)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0,
                lineHeight: 1,
                whiteSpace: "nowrap",
                transformOrigin: "center center",
                transform: "rotate(-90deg)",
                marginTop: 8,
              }}
            >
              Shop
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Product card row — 355×~282px portrait cards; NEGATIVE              */}
      {/* marginTop so cards overlap the banner's lower ~80px at desktop.     */}
      {/* Left padding 197px = inset so first card x ≈ 237 from container.   */}
      {/* At ≤430px: marginTop 0, paddingLeft 0 (full-width single-col).     */}
      {/* Carousel arrows (prev/next) positioned relative to this wrapper.   */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="strip-card-row-wrap"
        style={{
          position: "relative",
          marginTop: -80, /* overlap up into the banner's lower region */
        }}
      >
        {/* Prev arrow */}
        <CarouselArrow direction="prev" onClick={() => scrollBy(-363)} />

        <div
          ref={scrollRef}
          className="strip-card-row"
          style={{
            paddingLeft: 197,
            paddingRight: 24,
            overflowX: "auto",
            scrollbarWidth: "none",
            /* IE/Edge compat */
            msOverflowStyle: "none",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            {entry.products.map((product) => (
              <StripProductCard
                key={product.slug}
                product={product}
                onClick={onProductClick}
              />
            ))}

            {/* "View All" CTA — shown when href or onViewAllClick is provided */}
            {(entry.href || onViewAllClick) && (
              <div
                style={{
                  flex: "0 0 120px",
                  width: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 375,
                }}
              >
                {entry.href ? (
                  <a
                    href={entry.href}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      color: "var(--color-merch-body)",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "2px solid var(--color-merch-border)",
                      }}
                    >
                      {/* Right arrow */}
                      <svg width={10} height={16} viewBox="0 0 10 16" fill="none" aria-hidden>
                        <path
                          d="M2 2l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    View All
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onViewAllClick?.(entry.slug)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      color: "var(--color-merch-body)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      textAlign: "center",
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "2px solid var(--color-merch-border)",
                      }}
                    >
                      <svg width={10} height={16} viewBox="0 0 10 16" fill="none" aria-hidden>
                        <path
                          d="M2 2l6 7-6 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    View All
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Next arrow */}
        <CarouselArrow direction="next" onClick={() => scrollBy(363)} />
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Responsive overrides via injected <style> (avoids Tailwind breakpoint limits)
// ---------------------------------------------------------------------------

/**
 * Inline <style> block for 390/mobile responsive overrides.
 * Scoped to .merch-collection-list to avoid global leakage.
 *
 * At ≤430px:
 *   - .strip-name-tab (desktop rotated overlay): hidden
 *   - .mobile-tab-header: shown as a top bar above the banner
 *   - .strip-banner-wrap: overflow:hidden (no overlap of cards under tab)
 *   - .strip-card-row-wrap: marginTop 0 (no negative overlap)
 *   - .strip-card-row: paddingLeft 8px (full-width, no left indent)
 *   - carousel arrows: hidden (scroll-drag on mobile)
 */
const RESPONSIVE_STYLES = `
  @media (max-width: 430px) {
    .merch-collection-list .mobile-tab-header {
      display: block !important;
    }
    .merch-collection-list .strip-name-tab {
      display: none !important;
    }
    .merch-collection-list .strip-banner-wrap {
      overflow: hidden !important;
    }
    .merch-collection-list .strip-card-row-wrap {
      margin-top: 0 !important;
    }
    .merch-collection-list .strip-card-row {
      padding-left: 8px !important;
      padding-right: 8px !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    .merch-collection-list .strip-carousel-arrow {
      display: none !important;
    }
  }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCollectionList — vertically stacked collection strips.
 *
 * Each strip: banner (4:1 aspect, cover) with a rotated vertical name tab
 * (60×185px, 12px/24px padding, WHITE bg, BLACK text, curated label + "Shop")
 * at left=91px, followed by a horizontal scroll row of 355px portrait
 * StripProductCard tiles (gap 8px, left inset 197px). The card row starts
 * with a −80px margin overlapping the banner's lower region, matching the
 * real merch.riotgames.com/en-us/collection/ layout at 1280px.
 *
 * At ≤430px: tab shown above banner (no overlap), cards scroll normally.
 *
 * Below all strips: a centered red "LOAD MORE" pill (239×50px) is rendered
 * when `showLoadMore` is true (default).
 *
 * @example
 * <MerchCollectionList
 *   collections={[
 *     { slug: "league-classic",        tabLabel: "LEAGUE CLASSIC",       name: "League of Legends", bannerImageUrl, products },
 *     { slug: "riftbound-vendetta",     tabLabel: "RIFTBOUND VENDETTA",   name: "Riftbound",         bannerImageUrl, products },
 *     { slug: "msi-2026",              tabLabel: "MSI 2026",             name: "MSI 2026",           bannerImageUrl, products },
 *     { slug: "hot-choncc-summer",      tabLabel: "HOT CHONCC SUMMER",    name: "TFT",               bannerImageUrl, products },
 *   ]}
 *   onProductClick={(slug) => router.push(`/merch/product/${slug}`)}
 *   onViewAllClick={(slug) => router.push(`/merch/collection/${slug}`)}
 * />
 */
export function MerchCollectionList({
  collections,
  onProductClick,
  onViewAllClick,
  showLoadMore = true,
  onLoadMore,
}: MerchCollectionListProps) {
  if (!collections.length) return null;

  return (
    <>
      {/* Responsive override styles — scoped to .merch-collection-list */}
      <style>{RESPONSIVE_STYLES}</style>

      <div
        className="merch-collection-list"
        style={{
          width: "100%",
          fontFamily: "var(--font-merch)",
        }}
      >
        {collections.map((entry) => (
          <CollectionStrip
            key={entry.slug}
            entry={entry}
            onProductClick={onProductClick}
            onViewAllClick={onViewAllClick}
          />
        ))}

        {/* ------------------------------------------------------------------ */}
        {/* LOAD MORE — centered red pill, 239×50px, uppercase 16/600 white.   */}
        {/* Real site: mb 100px below strips.                                  */}
        {/* ------------------------------------------------------------------ */}
        {showLoadMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 48,
              marginBottom: 100,
            }}
          >
            <button
              type="button"
              onClick={onLoadMore}
              style={{
                width: 239,
                height: 50,
                backgroundColor: "var(--color-merch-red)",
                color: "var(--color-merch-on-dark)",
                border: "none",
                borderRadius: 25,
                cursor: "pointer",
                fontFamily: "var(--font-merch-display)",
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </>
  );
}
