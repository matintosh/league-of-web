import { MERCH_PRODUCTS } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { CollectionPageClient } from "./collection-page-client";

/**
 * /merch/collection/[handle] — collection/category browse page.
 * Composed of: MerchHeader + white breadcrumb bar (Home / <Name>(N) + REFINE) +
 *              MerchFilterSortBar + MerchProductGrid(cards) + MerchFooter.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * All interactive callbacks are delegated to CollectionPageClient.
 */

// ---------------------------------------------------------------------------
// Fixture data — all collections filter MERCH_PRODUCTS by franchise/slug
// ---------------------------------------------------------------------------

interface CollectionPageMeta {
  heading: string;
  /**
   * Real item count for this category — shown in the breadcrumb count sup "(N)".
   * Reflects real merch.riotgames.com category depths; fixtures demonstrate paging.
   */
  totalCount: number;
  products: MerchProduct[];
}

/** Look up collection metadata from the URL handle. */
function getCollectionMeta(handle: string): CollectionPageMeta {
  switch (handle) {
    case "apparel":
      // Apparel: real category has ~138 items. Fixtures demonstrate 8-per-page LOAD MORE.
      // Includes the classic hoodie/tee plus the dedicated apparel/* slugs added in #867.
      return {
        heading: "Apparel",
        totalCount: 138,
        products: MERCH_PRODUCTS.filter((p) =>
          [
            "lol-classic-hoodie",
            "lol-classic-yearbook-tee",
            "apparel-lol-classic-zip-hoodie",
            "apparel-lol-classic-varsity-jacket",
            "apparel-msi-2026-polo",
            "apparel-arcane-jinx-bomber",
            "apparel-valorant-tactical-hoodie",
            "apparel-vct-windbreaker",
            "apparel-2xko-launch-hoodie",
            "apparel-lol-classic-crewneck",
            "apparel-tft-choncc-tee",
            "apparel-arcane-vi-track-jacket",
          ].includes(p.slug)
        ),
      };
    case "collectibles":
      // Collectibles / figures / plush from real products
      return {
        heading: "Collectibles",
        totalCount: 64,
        products: MERCH_PRODUCTS.filter((p) =>
          [
            "league-classic-collectors-box",
            "rocklove-lol-heart-of-gold-ring",
            "twitch-7in-limited-edition-statue",
            "amumu-plush",
          ].includes(p.slug)
        ),
      };
    case "riftbound":
      return {
        heading: "Riftbound",
        totalCount: MERCH_PRODUCTS.filter((p) => p.franchiseLabel === "Riftbound").length,
        products: MERCH_PRODUCTS.filter((p) => p.franchiseLabel === "Riftbound"),
      };
    case "league-of-legends":
      return {
        heading: "League of Legends",
        totalCount: MERCH_PRODUCTS.filter((p) => p.franchiseLabel === "League of Legends").length,
        products: MERCH_PRODUCTS.filter((p) => p.franchiseLabel === "League of Legends"),
      };
    case "sale":
      return {
        heading: "Sale",
        totalCount: MERCH_PRODUCTS.filter(
          (p) => p.badge === "Sale" || p.badges?.includes("Sale")
        ).length,
        products: MERCH_PRODUCTS.filter(
          (p) => p.badge === "Sale" || p.badges?.includes("Sale")
        ),
      };
    default:
      return { heading: "Collection", totalCount: MERCH_PRODUCTS.length, products: MERCH_PRODUCTS };
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
}

/** /merch/collection/[handle] server component shell. */
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const { heading, totalCount, products } = getCollectionMeta(handle);

  return (
    <CollectionPageClient
      handle={handle}
      heading={heading}
      totalCount={totalCount}
      products={products}
    />
  );
}
