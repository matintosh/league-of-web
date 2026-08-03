import { MERCH_PRODUCTS } from "@low/fixtures";
import { ShopAllPageClient } from "./shop-all-page-client";

/**
 * /merch/shop-all — all-products browse page.
 * Composed of: MerchHeader(activeCategory="shop-all") + white breadcrumb bar
 *              (Home / Shop All (N) + inline red REFINE) + MerchFilterSortBar +
 *              MerchProductGrid(cards) + MerchFooter.
 * No dark MerchCollectionHero — matches the real /en-us/shop-all/ and the
 * Sale/PDP pattern (#643/#654). Count + REFINE appear once (breadcrumb bar).
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
