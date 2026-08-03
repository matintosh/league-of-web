import { MERCH_PRODUCTS } from "@low/fixtures";
import { SalePageClient } from "./sale-page-client";

/**
 * /merch/sale — sale items listing page.
 * 1:1 clone of merch.riotgames.com/en-us/sale/ (or /collection/sale).
 * Filters MERCH_PRODUCTS to items with a "Sale" badge or an originalPrice,
 * then delegates to SalePageClient for all interactive state.
 * Merch tokens (--color-merch-*) loaded by the /merch layout.
 */

/** /merch/sale server component shell. */
export default function SalePage() {
  const saleProducts = MERCH_PRODUCTS.filter(
    (p) => p.badge === "Sale" || p.originalPrice !== undefined,
  );

  return <SalePageClient products={saleProducts} />;
}
