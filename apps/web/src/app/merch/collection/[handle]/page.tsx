import { MERCH_PRODUCTS } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { CollectionPageClient } from "./collection-page-client";

/**
 * /merch/collection/[handle] — collection/category browse page.
 * Composed of: MerchHeader + white breadcrumb bar (Home / <Name> (N) + REFINE) +
 *              MerchFilterSortBar + MerchProductGrid(cards) + MerchFooter.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * All interactive callbacks are delegated to CollectionPageClient.
 */

// ---------------------------------------------------------------------------
// Fixture data — all collections use the real 8 products, filtered by franchise
// ---------------------------------------------------------------------------

interface CollectionPageMeta {
  heading: string;
  products: MerchProduct[];
}

/** Look up collection metadata from the URL handle. */
function getCollectionMeta(handle: string): CollectionPageMeta {
  switch (handle) {
    case "apparel":
      // Apparel items from real products
      return {
        heading: "Apparel",
        products: MERCH_PRODUCTS.filter((p) =>
          ["lol-classic-hoodie", "lol-classic-yearbook-tee"].includes(p.slug)
        ),
      };
    case "collectibles":
      // Collectibles / figures / plush from real products
      return {
        heading: "Collectibles",
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
        products: MERCH_PRODUCTS.filter((p) => p.franchiseLabel === "Riftbound"),
      };
    case "league-of-legends":
      return {
        heading: "League of Legends",
        products: MERCH_PRODUCTS.filter((p) => p.franchiseLabel === "League of Legends"),
      };
    case "sale":
      return {
        heading: "Sale",
        products: MERCH_PRODUCTS.filter(
          (p) => p.badge === "Sale" || p.badges?.includes("Sale")
        ),
      };
    default:
      return { heading: "Collection", products: MERCH_PRODUCTS };
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
  const { heading, products } = getCollectionMeta(handle);

  return (
    <CollectionPageClient
      handle={handle}
      heading={heading}
      products={products}
    />
  );
}
