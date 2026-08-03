import { MERCH_PRODUCTS } from "@low/fixtures";
import { ShopAllPageClient } from "./shop-all-page-client";

/**
 * /merch/shop-all — all-products browse page.
 * Composed of: MerchHeader(activeCategory="shop-all") + MerchCollectionHero +
 *              MerchFilterSortBar + MerchProductGrid(cards) + MerchFooter.
 * Same template as a collection page but shows all categories.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * Interactive state (sort, filter, cart) delegated to ShopAllPageClient.
 */

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/** /merch/shop-all server component shell. */
export default function ShopAllPage() {
  return <ShopAllPageClient products={MERCH_PRODUCTS} />;
}
