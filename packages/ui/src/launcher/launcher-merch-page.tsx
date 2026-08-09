/**
 * LauncherMerchPage — Merch tab composition for the /launcher section.
 *
 * Composes:
 *   - "Merch" heading (display font, white)
 *   - LauncherFeaturedMerchBanner — featured product (MERCH_PRODUCTS[2], lol-classic-yearbook-tee)
 *   - Horizontal product tile row — 4 LauncherMerchProductTile (dark compact tiles)
 *
 * LAUNCHER COMPONENT — uses `--color-launcher-*` tokens for the page chrome.
 * LauncherMerchProductTile uses dark launcher tokens (no white card bg).
 *
 * Props: none — fixture data is hardcoded here (types from @low/fixtures,
 * values supplied inline at page level per the component contract).
 *
 * Server-safe: no 'use client'. No data fetching; no callbacks required.
 */

import { MERCH_PRODUCTS } from "@low/fixtures";

import { LauncherFeaturedMerchBanner } from "./launcher-featured-merch-banner";
import { LauncherMerchProductTile } from "./launcher-merch-product-tile";

// ---------------------------------------------------------------------------
// Fixture data — values at page level, types from @low/fixtures
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
/** lol-classic-yearbook-tee — MERCH_PRODUCTS[2], matching image-4.png. */
const FEATURED_PRODUCT = MERCH_PRODUCTS[2]!;

/**
 * 4-product row — exclude index 2 (now featured); pick 4 non-featured products:
 *   0: League Classic Collector's Box
 *   1: Twitch 7" Limited Edition Statue
 *   3: RockLove Heart of Gold Ring
 *   5: Amumu Plush
 */
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PRODUCT_ROW = [
  MERCH_PRODUCTS[0]!, // league-classic-collectors-box
  MERCH_PRODUCTS[1]!, // twitch-7in-limited-edition-statue
  MERCH_PRODUCTS[3]!, // rocklove-lol-heart-of-gold-ring
  MERCH_PRODUCTS[5]!, // amumu-plush
];

/** Description for the featured banner, matching the ref copy. */
const FEATURED_DESCRIPTION =
  "Dust off your rune pages with the League of Legends Classic Yearbook — a limited edition tee celebrating the golden era of the Rift.";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LauncherMerchPage — full Merch tab content.
 *
 * - "Merch" heading in display font
 * - LauncherFeaturedMerchBanner (yearbook tee — MERCH_PRODUCTS[2], matching ref)
 * - Horizontal row of 4 LauncherMerchProductTile (compact dark tiles, no white card bg)
 *   Tiles: Collectors Box, Twitch Statue, RockLove Ring, Amumu Plush
 */
export function LauncherMerchPage() {
  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{
        backgroundColor: "var(--color-launcher-content-bg)",
        padding: "24px 82px",
      }}
    >
      {/* "Merch" heading */}
      <h2
        className="font-bold"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          lineHeight: 1.2,
          color: "var(--color-launcher-ink)",
          marginBottom: 16,
        }}
      >
        Merch
      </h2>

      {/* Featured banner — lol-classic-yearbook-tee (MERCH_PRODUCTS[2]) */}
      <div style={{ marginBottom: 20 }}>
        <LauncherFeaturedMerchBanner
          product={FEATURED_PRODUCT}
          description={FEATURED_DESCRIPTION}
        />
      </div>

      {/* Product tile row — 4 compact dark tiles, horizontal, overflow-x scroll */}
      <div
        className="flex flex-row"
        style={{
          gap: 16,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {PRODUCT_ROW.map((product) => (
          <div
            key={product.slug}
            style={{ flex: 1, minWidth: 0 }}
          >
            <LauncherMerchProductTile
              slug={product.slug}
              title={product.title}
              imageUrl={product.imageUrl}
              price={product.price}
              originalPrice={product.originalPrice}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
