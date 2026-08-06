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
 *     WHITE bg + BLACK text) + "SHOP" (top) + collection name (bottom) in a SINGLE
 *     rotated box — whole box uses matrix(0,-1,1,0); riotSans font; no letter-spacing.
 *   - Strip card: 355px wide × 225px portrait image area (packshot, no franchise label)
 *   - Card gap: 8px (pitch 363px from x=216,579,942,1305)
 *   - Left inset: ~176px from container x=40 (paddingLeft 176)
 *   - Strip paddingBottom: 48px
 *   - Strip separator: border-bottom in --color-merch-border
 *   - Container: max-w-7xl mx-auto, px-10 (x=40 at 1280)
 *
 * Delta #827:
 *   1. Card image area: 225px tall portrait (was 282px).
 *   2. Left inset: paddingLeft 176px (was 197px).
 *   3. Name tab: SINGLE whole-box rotation — SHOP label (top) + collection name (bottom);
 *      no per-span rotation; riotSans font.
 *   4. Strip paddingBottom: 48px (was 32px).
 *   5. LOAD MORE: flat transparent rectangular button — bg transparent, border-radius 0,
 *      padding 0 16px, white riotSans 16/600, letter-spacing 0.32px (not red pill).
 *   6. @390: portrait banner ~310×347 (~1:1 aspect); collection name bar + badges overlaid
 *      lower-LEFT on the banner; cards scroll below. No thin 4:1 + horizontal tab-header.
 *   7. @390 H1: 32px single line (was 48px wrapping to 2 lines).
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
 * Image area is 225px tall portrait (packshot, object-contain) — remeasured
 * from merch.riotgames.com/en-us/collection/ (real card 353×225 image area).
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
        /* portrait height remeasured from real /en-us/collection/ at 1280px (was 282px) */
        imageHeight={225}
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
 *     SINGLE box rotated matrix(0,-1,1,0) — SHOP label (top) + collection name (bottom);
 *     riotSans 16/700/uppercase; no letter-spacing; no per-span rotation
 *   - Card pitch: 363px (gap 8px); cards at x=216,579,942,1305 from container x=40
 *   - Left inset of card row: 176px from container edge
 *   - Strip paddingBottom: 48px
 *
 * At ≤430px (mobile): portrait ~310×347 banner (~1:1 aspect); name/SHOP bar
 * overlaid lower-LEFT on the banner image; cards scroll below.
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
        /* paddingBottom 48px (was 32px, remeasured #827) */
        paddingBottom: 48,
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
        {/* Rotated name tab — desktop only (hidden at ≤430px via <style>). */}
        {/* 60×185px at left=91px; WHITE bg + BLACK text; padding 12px 24px. */}
        {/* SINGLE box rotation: transform matrix(0,-1,1,0) on the container */}
        {/* → whole box rotates -90deg; content reads bottom-to-top (LTR).   */}
        {/* Inside the rotated box: SHOP (left=top when rotated) + name.     */}
        {/* bottom=-24px straddles the banner/card-row boundary.             */}
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
            zIndex: 2,
            /* Rotate the WHOLE box — same as matrix(0,-1,1,0) from real site */
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
            /* Inside the rotated box: SHOP + separator + collection name    */
            /* Use a horizontal flex row (they appear stacked when rotated)  */
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 24px",
          }}
        >
          {/* SHOP label — appears at top (left in rotated box) */}
          <span
            style={{
              display: "block",
              color: "var(--color-merch-red)",
              fontFamily: "var(--font-merch-display)",
              fontSize: 16,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            SHOP
          </span>

          {/* Thin separator line between SHOP and collection name */}
          <span
            aria-hidden
            style={{
              display: "block",
              width: 1,
              height: 14,
              backgroundColor: "var(--color-merch-ink-dark)",
              opacity: 0.25,
              flexShrink: 0,
            }}
          />

          {/* Collection name — appears at bottom (right in rotated box) */}
          <span
            style={{
              display: "block",
              color: "var(--color-merch-ink-dark)",
              fontFamily: "var(--font-merch-display)",
              fontSize: 16,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {tabLabel}
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Mobile name overlay — lower-LEFT of banner at ≤430px.           */}
        {/* Hidden at desktop; shown by RESPONSIVE_STYLES at ≤430px.        */}
        {/* White box with collection name + SHOP label, overlaid on banner. */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="strip-mobile-name-overlay"
          aria-hidden
          style={{
            display: "none", /* overridden at ≤430px via <style> below */
            position: "absolute",
            bottom: 16,
            left: 16,
            backgroundColor: "var(--color-merch-bg)",
            padding: "8px 12px",
            zIndex: 3,
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: "var(--color-merch-red)",
              fontFamily: "var(--font-merch-display)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0,
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            SHOP
          </div>
          <div
            style={{
              color: "var(--color-merch-ink-dark)",
              fontFamily: "var(--font-merch-display)",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {tabLabel}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Product card row — 355×225px portrait cards; NEGATIVE               */}
      {/* marginTop so cards overlap the banner's lower ~80px at desktop.     */}
      {/* Left padding 176px = inset so first card x ≈ 216 from container.   */}
      {/* At ≤430px: marginTop 0, paddingLeft 8px (full-width scroll).       */}
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
 * At ≤430px (#827 remeasured):
 *   - .strip-banner-wrap: portrait ~1:1 aspect (~112% padding-top) + overflow:hidden
 *   - .strip-name-tab (desktop rotated overlay): hidden
 *   - .strip-mobile-name-overlay: shown (lower-LEFT of banner image)
 *   - .strip-card-row-wrap: marginTop 0 (no negative overlap on mobile)
 *   - .strip-card-row: paddingLeft 8px (full-width scroll, no left indent)
 *   - carousel arrows: hidden (scroll-drag on mobile)
 */
const RESPONSIVE_STYLES = `
  @media (max-width: 430px) {
    .merch-collection-list .strip-banner-wrap {
      /* Portrait ~1:1 aspect: 310×347 ≈ 112% padding-top */
      padding-top: 112% !important;
      overflow: hidden !important;
    }
    .merch-collection-list .strip-name-tab {
      display: none !important;
    }
    .merch-collection-list .strip-mobile-name-overlay {
      display: block !important;
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
    .merch-collection-list-h1 {
      font-size: 32px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
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
 * SINGLE rotated name tab (60×185px, 12px/24px padding, WHITE bg, whole box
 * rotated -90deg, SHOP label + collection name inside) at left=91px, followed by
 * a horizontal scroll row of 355px portrait StripProductCard tiles (225px image
 * height, gap 8px, left inset 176px). The card row starts with a −80px margin
 * overlapping the banner's lower region, matching the real layout at 1280px.
 *
 * At ≤430px: portrait banner (~1:1 aspect), name overlay on lower-left of banner,
 * no negative card margin, cards scroll below banner.
 *
 * Below all strips: a flat transparent "LOAD MORE" button (no border-radius,
 * transparent bg, white riotSans 16/600, ls 0.32px) is rendered when
 * `showLoadMore` is true (default). Matches the real site's rectangular CTA.
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
        {/* LOAD MORE — flat transparent rectangle, no border-radius, no bg.   */}
        {/* Real site: bg transparent, borderRadius 0, padding 0 16px,         */}
        {/* white riotSans 16/600, ls 0.32px. NOT a red pill (#827 fix).       */}
        {/* Centered; mb 100px below strips.                                    */}
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
                height: 50,
                minWidth: 160,
                backgroundColor: "transparent",
                color: "var(--color-merch-ink-dark)",
                border: "1px solid var(--color-merch-border)",
                borderRadius: 0,
                cursor: "pointer",
                fontFamily: "var(--font-merch-display)",
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                lineHeight: 1,
                padding: "0 32px",
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
