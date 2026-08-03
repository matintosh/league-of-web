/**
 * MerchCollectionList — stacked collection strips for the /merch/collection index.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client. Tokens-only, presentational, no 'use client' needed.
 *
 * Measured from merch.riotgames.com/en-us/collection/ at 1280px desktop:
 *   - Layout: vertically stacked strips, one per collection
 *   - Each strip: banner image ~1200×300 (4:1 aspect) with a rotated vertical
 *     collection-name tab at left:~91px (~60×185px, 16px/bold/uppercase, dark bg)
 *     + a horizontal CSS scroll-snap row of ~253px-wide product cards
 *   - Strip separator: border-bottom in --color-merch-border
 *   - Container: max-w-7xl mx-auto
 *
 * Banner images: real banners are Sanity-fingerprinted (not reproducible via CDN
 * without the exact asset id). Pages supply `bannerImageUrl` per collection using
 * available assets (championSplashUrl or merchandised heroes) as placeholders.
 * This is a known asset limitation — see PR notes.
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
// Sub-component — CollectionStrip
// ---------------------------------------------------------------------------

/**
 * CollectionStrip — one banner + rotated name tab + horizontal product card row.
 * The rotated name tab sits at left ~91px, overlapping the banner bottom edge,
 * as seen on the real site.
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
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          /* 4:1 aspect — 25% padding-top */
          paddingTop: "25%",
          overflow: "hidden",
          backgroundColor: "var(--color-merch-surface)",
          minHeight: 120,
        }}
      >
        {/* Banner image — covers the padded box */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.bannerImageUrl}
          alt={`${entry.name} collection banner`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
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

        {/* ---------------------------------------------------------------- */}
        {/* Rotated name tab — positioned over the lower-left of the banner  */}
        {/* ~60px wide × 185px tall, 16px bold uppercase, dark bg            */}
        {/* transform-origin: center so rotation is stable                    */}
        {/* ---------------------------------------------------------------- */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -24,
            left: 91,
            width: 60,
            height: 185,
            backgroundColor: "var(--color-merch-ink-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <span
            style={{
              display: "block",
              color: "var(--color-merch-on-dark)",
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
      {/* Product card row — horizontal scroll, 253px cards                  */}
      {/* Left padding accounts for the name-tab width (91+60=151px) +       */}
      {/* a 16px gutter so cards start just right of the tab.                */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          marginTop: 40, /* clear the name tab that extends below the banner */
          paddingLeft: 167,
          paddingRight: 24,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {entry.products.map((product) => (
            <div
              key={product.slug}
              style={{ flex: "0 0 253px", width: 253 }}
            >
              <MerchProductCard
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                onClick={onProductClick}
              />
            </div>
          ))}

          {/* "View All" card — shown when href or onViewAllClick is provided */}
          {(entry.href || onViewAllClick) && (
            <div
              style={{ flex: "0 0 120px", width: 120, display: "flex", alignItems: "center" }}
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
 * Each strip: banner (4:1 aspect, cover) with rotated vertical name tab at
 * left ~91px, followed by a horizontal scroll row of MerchProductCard tiles
 * (253px wide each). Mirrors the layout of merch.riotgames.com/en-us/collection/.
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
