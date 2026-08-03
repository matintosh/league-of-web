import { MerchPageClient } from "./merch-page-client";

/**
 * /merch page — Riot merch store homepage.
 * Layout: Header → MerchHeroBanner → MerchProductGrid(cards) → Footer.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * All interactive callbacks are delegated to MerchPageClient.
 */
export default function MerchPage() {
  return <MerchPageClient />;
}
