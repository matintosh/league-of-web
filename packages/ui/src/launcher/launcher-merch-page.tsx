/**
 * LauncherMerchPage — Merch tab composition for the /launcher section.
 *
 * Composes:
 *   - "Merch" heading (display font, white)
 *   - LauncherFeaturedMerchBanner — featured product (MERCH_PRODUCTS[5], lol-classic-yearbook-tee)
 *   - Horizontal product card row — 4 MerchProductCard tiles (MERCH_PRODUCTS[0..3])
 *
 * LAUNCHER COMPONENT — uses `--color-launcher-*` tokens for the page chrome.
 * MerchProductCard retains its `--color-merch-*` tokens (white cards on dark bg
 * is intentional per ref: image-4.png).
 *
 * Props: none — fixture data is hardcoded here (types from @low/fixtures,
 * values supplied inline at page level per the component contract).
 *
 * Server-safe: no 'use client'. No data fetching; no callbacks required.
 */

import { MERCH_PRODUCTS } from "@low/fixtures";

import { LauncherFeaturedMerchBanner } from "./launcher-featured-merch-banner";
import { MerchProductCard } from "../merch/merch-product-card";

// ---------------------------------------------------------------------------
// Fixture data — values at page level, types from @low/fixtures
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
/** lol-classic-yearbook-tee — MERCH_PRODUCTS[5], matching image-4.png. */
const FEATURED_PRODUCT = MERCH_PRODUCTS[5]!;

/**
 * 4-product row — indices 0..3:
 *   0: League Classic Collectors Box
 *   1: RockLove Heart of Gold Ring
 *   2: Twitch Limited Statue
 *   3: Amumu Plush
 */
const PRODUCT_ROW = MERCH_PRODUCTS.slice(0, 4);

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
 * - LauncherFeaturedMerchBanner (yearbook tee, matching ref)
 * - Horizontal row of 4 MerchProductCard tiles (Collectors Box, Ring, Twitch Statue, Amumu Plush)
 */
export function LauncherMerchPage() {
  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{
        backgroundColor: "var(--color-launcher-content-bg)",
        padding: "24px 28px",
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

      {/* Featured banner — lol-classic-yearbook-tee */}
      <div style={{ marginBottom: 20 }}>
        <LauncherFeaturedMerchBanner
          product={FEATURED_PRODUCT}
          description={FEATURED_DESCRIPTION}
        />
      </div>

      {/* Product card row — 4 tiles, horizontal, overflow-x scroll */}
      <div
        className="flex flex-row"
        style={{
          gap: 12,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {PRODUCT_ROW.map((product) => (
          <div
            key={product.slug}
            style={{ width: 200, flexShrink: 0 }}
          >
            <MerchProductCard
              slug={product.slug}
              title={product.title}
              imageUrl={product.imageUrl}
              price={product.price}
              originalPrice={product.originalPrice}
              badge={product.badge}
              badges={product.badges}
              franchiseLabel={product.franchiseLabel}
              imageFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
