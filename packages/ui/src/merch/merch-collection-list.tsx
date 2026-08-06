/**
 * MerchCollectionList — stacked collection strips for the /merch/collection index.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client. Tokens-only, presentational, no 'use client' needed.
 *
 * Measured from merch.riotgames.com/en-us/collection/ at 1280px desktop:
 *   - Layout: vertically stacked strips, one per collection
 *   - Each strip: banner image ~1200×300 (4:1 aspect) with a rotated vertical
 *     collection-name tab at left:~91px (~60×185px, 16px/bold/uppercase, WHITE bg + BLACK text)
 *     + a horizontal scroll row of 355×375 landscape product cards overlapping the banner bottom
 *   - Strip card: 355px wide, 225px landscape image area, franchise label line above title
 *   - Strip separator: border-bottom in --color-merch-border
 *   - Container: max-w-7xl mx-auto
 *
 * Banner images: real banners are Sanity-fingerprinted (not reproducible via CDN
 * without the exact asset id). Pages supply `bannerImageUrl` per collection using
 * available assets (championSplashUrl or merchandised heroes) as placeholders.
 * This is a known asset limitation — see PR notes.
 *
 * Delta #762:
 *   1. Name-tab color INVERTED: white bg (--color-merch-bg) + black text (--color-merch-ink-dark).
 *   2. Strip cards: 355×375 landscape — 225px image area + franchise label + info strip.
 *   3. Card row OVERLAPS banner by ~80px (negative marginTop, not positive).
 */

import type { MerchProduct } from "@low/fixtures";
import { MerchProductCard } from "./merch-product-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single collection strip entry. */
export interface MerchCollectionEntry {
  /** URL-safe slug for the collection, e.g. "league-of-legends". */
  slug: string;
  /** Display name shown in the rotated name tab and as aria label. */
  name: string;
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
   * Optional href for the "View All" CTA. If omitted, no CTA is rendered.
   * Intentionally a string (not an onClick) so the server-safe showcase
   * can supply it without client state.
   */
  href?: string;
}

export interface MerchCollectionListProps {
  /** Ordered list of collection strips to render. */
  collections: MerchCollectionEntry[];
  /** Called when a product card is clicked; passes the product slug. */
  onProductClick?: (slug: string) => void;
  /** Called when "View All" is clicked; passes the collection slug. */
  onViewAllClick?: (collectionSlug: string) => void;
}

// ---------------------------------------------------------------------------
// Sub-component — StripProductCard
// ---------------------------------------------------------------------------

/**
 * StripProductCard — 355×375 landscape card cell used in collection strips.
 *
 * Wraps MerchProductCard (client component) in a fixed-width cell so the
 * card scales to 355px. Overrides MerchProductCard's default 1:1 image
 * ratio with a 225px-tall landscape image area via a wrapping shell.
 *
 * Recipe (measured from merch.riotgames.com/en-us/collection/ at 1280px):
 *   - Cell: 355px wide, 1px border frame, flex column
 *   - Image area: 353×225 (contain, white bg)
 *   - Info strip: franchise label above title + price (supplied via franchiseLabel prop)
 *
 * MerchProductCard is "use client"; rendering it from the server-safe parent is
 * fine — Next.js serialises only its props (all plain values) and handles hydration.
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
        franchiseLabel={product.franchiseLabel}
        /* landscape: contain fits packshot / card artwork in 353×225 area */
        imageFit="contain"
        onClick={onClick}
      />
    </div>
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
 *   - Name-tab: 60×185px at left=91, WHITE bg (#fff) + BLACK text, bottom extends
 *     past banner bottom edge (bottom: -24px to straddle banner/card row boundary)
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
      {/* Banner area — 4:1 aspect, full-width, relative for name-tab overlay */}
      {/* overflow: visible so the name-tab and cards can overlap             */}
      {/* ------------------------------------------------------------------ */}
      <div
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
        {/* Rotated name tab — #762: WHITE bg + BLACK text (inverted from    */}
        {/* original). 60×185px at left=91px, bottom=-24px so it straddles  */}
        {/* the banner's bottom edge into the card row.                       */}
        {/* ---------------------------------------------------------------- */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -24,
            left: 91,
            width: 60,
            height: 185,
            /* WHITE background (was ink-dark) */
            backgroundColor: "var(--color-merch-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <span
            style={{
              display: "block",
              /* BLACK text (was on-dark/white) */
              color: "var(--color-merch-ink-dark)",
              fontSize: 16,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              transformOrigin: "center center",
              transform: "rotate(-90deg)",
            }}
          >
            {entry.name}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Product card row — #762: 355×375 landscape cards; NEGATIVE          */}
      {/* marginTop so cards overlap the banner's bottom ~80px.               */}
      {/* Left padding (167px) = name-tab left (91) + tab width (60) + 16px  */}
      {/* gutter, so cards start just right of the tab.                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          marginTop: -80, /* overlap up into the banner's lower region */
          paddingLeft: 167,
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
            gap: 16,
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
                        d="M2 2l6 6-6 6"
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
    </article>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCollectionList — vertically stacked collection strips.
 *
 * Each strip: banner (4:1 aspect, cover) with a rotated vertical name tab
 * (60×185px, white bg, black text) at left=91px, followed by a horizontal
 * scroll row of 355×375 landscape StripProductCard tiles. The card row starts
 * with a −80px margin so it overlaps the banner's lower region, matching the
 * real merch.riotgames.com/en-us/collection/ layout.
 *
 * @example
 * <MerchCollectionList
 *   collections={[
 *     { slug: "league-of-legends", name: "League of Legends", bannerImageUrl, products },
 *     { slug: "riftbound",         name: "Riftbound",         bannerImageUrl, products },
 *   ]}
 *   onProductClick={(slug) => router.push(`/merch/product/${slug}`)}
 *   onViewAllClick={(slug) => router.push(`/merch/collection/${slug}`)}
 * />
 */
export function MerchCollectionList({
  collections,
  onProductClick,
  onViewAllClick,
}: MerchCollectionListProps) {
  if (!collections.length) return null;

  return (
    <div
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
    </div>
  );
}
