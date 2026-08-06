/**
 * MerchCollectionList — stacked collection strips for the /merch/collection index.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client. Tokens-only, presentational, no 'use client' needed.
 *
 * Measured from merch.riotgames.com/en-us/collection/ at 1280px desktop:
 *   - Layout: vertically stacked strips, one per collection
 *   - Each strip: banner image ~1200×300 (4:1 aspect) with a rotated vertical
 *     collection-name tab at left (~91px; 60×185px, 12px/24px padding)
 *   - Name tab: WHITE bg + BLACK text. SHOP label Inter 14/600 gray (#888); NO
 *     separator between SHOP and name; collection name Inter 14/600 black uppercase.
 *     Tab visible at BOTH desktop and 390 (matrix(0,-1,1,0); x=91 @1280, x=40 @390).
 *   - Strip card: 355px wide × 225px portrait image area (packshot, no franchise label)
 *   - Card gap: 8px (pitch 363px from x=216,579,942,1305)
 *   - Left inset: ~176px from container x=40 (paddingLeft 176)
 *   - Strip pitch: 715px (strips at y=282/997/1712/2427 measured from real)
 *   - Strip separator: border-bottom in --color-merch-border
 *   - Container: max-w-7xl mx-auto, px-10 (x=40 at 1280)
 *   - Prev arrow: hidden at scrollLeft=0 / not scrollable
 *
 * Delta #860:
 *   1. Strip count: exactly 4 (League Classic, Riftbound Vendetta, MSI 2026,
 *      Hot Choncc Summer) — Arcane + Masters London removed.
 *   2. LOAD MORE: RED fill --color-merch-red, WHITE text --color-merch-on-dark,
 *      239×50 @1280 / 310×50 @390, radius 0, NO border.
 *   3. Rotated name tab: 60×185px at left=91px straddling banner bottom,
 *      reads bottom-to-top — does NOT overlap first card.
 *   4. SHOP label: Inter 14/600, ls 0.28, --color-merch-footer-heading (#888),
 *      uppercase (not riotSans red).
 *   5. No separator between SHOP and collection name.
 *   6. Mobile 390: keep rotated tab (same matrix(0,-1,1,0), x=40) — remove
 *      horizontal overlay.
 *   7. Strip pitch 715px: paddingBottom 106px per strip (was 48px).
 *   8. Prev arrow hidden at scrollLeft=0 / not scrollable.
 *   9. 390 card cell: 363px wide, first card x=85.
 *
 * Banner images: real banners are Sanity-fingerprinted (not reproducible via CDN
 * without the exact asset id). Pages supply `bannerImageUrl` per collection using
 * available assets (championSplashUrl or merchandised heroes) as placeholders.
 * This is a known asset limitation — see PR notes.
 */

"use client";

import { useRef, useState, useCallback } from "react";
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
   * Whether to show a "LOAD MORE" button below all strips.
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
 * StripProductCard — portrait card cell used in collection strips.
 *
 * Desktop: 355px wide × 225px portrait image area.
 * Mobile 390: 363px wide (remeasured #860 — first card centered, x=85).
 * NO franchise label is rendered (collection cards show title + price only).
 *
 * Recipe (measured from merch.riotgames.com/en-us/collection/ at 1280px):
 *   - Cell: 355px wide, flex column
 *   - Image area: 355×225 portrait, object-contain
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
    /* Fixed-width cell wrapper — overridden to 363px at ≤430px via RESPONSIVE_STYLES */
    <div className="strip-product-card-cell" style={{ flex: "0 0 355px", width: 355 }}>
      <MerchProductCard
        slug={product.slug}
        title={product.title}
        imageUrl={product.imageUrl}
        price={product.price}
        originalPrice={product.originalPrice}
        badge={product.badge}
        /* intentionally omit franchiseLabel — collection strips show title + price only */
        imageFit="contain"
        /* portrait height remeasured from real /en-us/collection/ at 1280px */
        imageHeight={225}
        onClick={onClick}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component — CarouselArrow
// ---------------------------------------------------------------------------

/**
 * CarouselArrow — absolute-positioned next/prev scroll button.
 * Prev arrow is hidden when `visible` is false (at scrollLeft=0 per real site).
 */
function CarouselArrow({
  direction,
  onClick,
  visible = true,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous products" : "Next products"}
      onClick={onClick}
      className="strip-carousel-arrow"
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
 * Key geometry (measured from merch.riotgames.com/en-us/collection/ at 1280px, delta #860):
 *   - Banner: 1200×300 at y=282 (bottom y=582)
 *   - Card row starts y=502 → cards overlap UP into the banner's lower ~80px
 *   - Name-tab: 60×185px, WHITE bg; SHOP label Inter 14/600 gray (#888) at top,
 *     collection name Inter 14/600 black uppercase at bottom; NO separator between them.
 *     Positioned left=91px, bottom=-24px straddling banner bottom. Does NOT overlap
 *     first card. Rotated matrix(0,-1,1,0) — reads bottom-to-top.
 *     Tab visible at BOTH 1280 and 390 (x=91→40 via media query).
 *   - Card pitch: 363px (gap 8px); cards at x=216,579,942,1305 from container x=40
 *   - Left inset of card row: 176px from container edge
 *   - Strip pitch: 715px (paddingBottom 106px, borderBottom included)
 *   - Prev arrow: hidden when scrollLeft=0 (real site does not show prev arrow at rest)
 *
 * At ≤430px (mobile): banner stays ~1:1 portrait; rotated tab shifts to x=40;
 * card cells widen to 363px with left inset ~22px for centered single-card feel.
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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const tabLabel = entry.tabLabel ?? entry.name.toUpperCase();

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setCanScrollPrev(scrollRef.current.scrollLeft > 0);
    }
  }, []);

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
        /*
         * paddingBottom 106px: real strips at y=282/997/1712/2427 → 715px pitch.
         * banner ~300px + card row ~225px + padding ~190px = ~715px total.
         * (Was 48px; +58px to reach 715px pitch.)
         */
        paddingBottom: 106,
        marginBottom: 0,
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Banner area — 4:1 aspect at desktop, ~1:1 portrait at ≤430px.      */}
      {/* overflow: visible so the name-tab and cards can overlap at desktop. */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="strip-banner-wrap"
        style={{
          position: "relative",
          width: "100%",
          /* 4:1 aspect — 25% padding-top (overridden at ≤430px via <style>) */
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
        {/* Rotated name tab — visible at BOTH desktop and mobile (#860).    */}
        {/* Measured: 60×185px at left=91px; WHITE bg; reads bottom-to-top. */}
        {/* SHOP label: Inter 14/600, ls 0.28, --color-merch-footer-heading. */}
        {/* Collection name: Inter 14/600, black uppercase — NO separator.   */}
        {/* bottom=-24px straddles the banner/card-row boundary.             */}
        {/* At ≤430px: left shifts to 40px via RESPONSIVE_STYLES.           */}
        {/* ---------------------------------------------------------------- */}
        <h2
          className="strip-name-tab"
          style={{
            position: "absolute",
            bottom: -24,
            left: 91,
            width: 60,
            height: 185,
            /* WHITE background */
            backgroundColor: "var(--color-merch-bg)",
            zIndex: 2,
            margin: 0,
            /* Rotate the WHOLE box — same as matrix(0,-1,1,0) from real site */
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
            /*
             * Inside the rotated box: SHOP (left) + collection name (right).
             * When box is rotated -90deg, flex-row = visually top-to-bottom.
             * "left" in this context appears at the TOP when rendered vertical.
             */
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 24px",
            lineHeight: "18px",
          }}
        >
          {/* SHOP label — Inter 14/600, gray #888, ls 0.28px (measured #860) */}
          <span
            style={{
              display: "block",
              color: "var(--color-merch-footer-heading)",
              fontFamily: "var(--font-merch)",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.28px",
              lineHeight: "18px",
              whiteSpace: "nowrap",
            }}
          >
            SHOP
          </span>

          {/* Collection name — Inter 14/600, black uppercase (measured #860) */}
          <span
            style={{
              display: "block",
              color: "var(--color-merch-ink-dark)",
              fontFamily: "var(--font-merch)",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.28px",
              lineHeight: "18px",
              whiteSpace: "nowrap",
            }}
          >
            {tabLabel}
          </span>
        </h2>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Product card row — 355×225px portrait cards; NEGATIVE               */}
      {/* marginTop so cards overlap the banner's lower ~80px at desktop.     */}
      {/* Left padding 176px = inset so first card x ≈ 216 from container.   */}
      {/* At ≤430px: marginTop 0, paddingLeft 22px, card cells 363px wide.   */}
      {/* Carousel arrows (prev/next) positioned relative to this wrapper.   */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="strip-card-row-wrap"
        style={{
          position: "relative",
          marginTop: -80, /* overlap up into the banner's lower region */
        }}
      >
        {/* Prev arrow — hidden at scrollLeft=0 per real site */}
        <CarouselArrow
          direction="prev"
          onClick={() => scrollBy(-363)}
          visible={canScrollPrev}
        />

        <div
          ref={scrollRef}
          className="strip-card-row"
          onScroll={handleScroll}
          style={{
            /* left inset 176px → first card x ≈ 216 (container x=40, pad 176) */
            paddingLeft: 176,
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
                  minHeight: 320,
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
 * At ≤430px (#860):
 *   - .strip-banner-wrap: portrait ~1:1 aspect (~112% padding-top) + overflow:hidden
 *   - .strip-name-tab: stays visible, shifts to left=40px (real site @390: x=40)
 *   - .strip-card-row-wrap: marginTop 0 (no negative overlap on mobile)
 *   - .strip-card-row: paddingLeft 22px (so first card x≈85, centered single-card feel)
 *   - .strip-product-card-cell: widened to 363px (measured #860 @390)
 *   - .strip-carousel-arrow: hidden (scroll-drag on mobile)
 *   - .merch-load-more-btn: w=310px (measured @390)
 */
const RESPONSIVE_STYLES = `
  @media (max-width: 430px) {
    .merch-collection-list .strip-banner-wrap {
      /* Portrait ~1:1 aspect: 310×347 ≈ 112% padding-top */
      padding-top: 112% !important;
      overflow: hidden !important;
    }
    .merch-collection-list .strip-name-tab {
      /* Keep rotated tab, shift x to 40px matching real site @390 */
      left: 40px !important;
    }
    .merch-collection-list .strip-card-row-wrap {
      margin-top: 0 !important;
    }
    .merch-collection-list .strip-card-row {
      /* paddingLeft 22px → first card x≈85 (centered single-card feel @390) */
      padding-left: 22px !important;
      padding-right: 8px !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    .merch-collection-list .strip-product-card-cell {
      /* 363px wide at 390 (measured #860) */
      flex: 0 0 363px !important;
      width: 363px !important;
    }
    .merch-collection-list .strip-carousel-arrow {
      display: none !important;
    }
    .merch-collection-list-h1 {
      font-size: 32px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .merch-load-more-btn {
      /* 310px wide at 390 (measured #860) */
      width: 310px !important;
      min-width: 310px !important;
    }
  }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCollectionList — vertically stacked collection strips.
 *
 * Each strip: banner (4:1 aspect at desktop, ~1:1 portrait at mobile) with a
 * rotated name tab (60×185px, bottom=−24px, left=91px, WHITE bg) visible at both
 * viewports. SHOP label: Inter 14/600 gray (--color-merch-footer-heading), ls 0.28px.
 * Collection name: Inter 14/600 black uppercase, ls 0.28px. NO separator between them.
 * Tab shifts left=40px at ≤430px to match real site @390.
 *
 * Below all strips: a solid RED "LOAD MORE" button (--color-merch-red fill,
 * --color-merch-on-dark text, 239×50 @1280, 310×50 @390, border-radius 0, NO border).
 * Matches the real site's red CTA.
 *
 * @example
 * <MerchCollectionList
 *   collections={[
 *     { slug: "league-classic",    tabLabel: "LEAGUE CLASSIC",     name: "League of Legends", bannerImageUrl, products },
 *     { slug: "riftbound-vendetta",tabLabel: "RIFTBOUND VENDETTA", name: "Riftbound",         bannerImageUrl, products },
 *     { slug: "msi-2026",         tabLabel: "MSI 2026",           name: "MSI 2026",           bannerImageUrl, products },
 *     { slug: "hot-choncc-summer", tabLabel: "HOT CHONCC SUMMER",  name: "TFT",               bannerImageUrl, products },
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
        {/* LOAD MORE — solid RED rectangle (#860).                             */}
        {/* Real site: bg --color-merch-red (rgb(235,0,41)), border-radius 0,   */}
        {/* no border, white riotSans 16/600, ls 0.32px. 239×50 @1280;        */}
        {/* 310×50 @390 (via RESPONSIVE_STYLES). Centered; mt 48 mb 100.       */}
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
              className="merch-load-more-btn"
              style={{
                height: 50,
                width: 239,
                minWidth: 239,
                backgroundColor: "var(--color-merch-red)",
                color: "var(--color-merch-on-dark)",
                border: "none",
                borderRadius: 0,
                cursor: "pointer",
                fontFamily: "var(--font-merch-display)",
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.32px",
                lineHeight: 1,
                padding: "0 16px",
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
