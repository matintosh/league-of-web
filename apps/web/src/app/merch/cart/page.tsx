import { championSplashUrl } from "@low/fixtures";
import type { MerchCartItem } from "@low/fixtures";
import { CartPageClient } from "./cart-page-client";

/**
 * /merch/cart — full-page cart.
 * Composed of: MerchHeader + MerchCartPage (heading + line items + summary) + MerchFooter.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * All interactive callbacks are delegated to CartPageClient.
 */

// ---------------------------------------------------------------------------
// Fixture data — representative filled cart
// ---------------------------------------------------------------------------

const DEMO_CART_ITEMS: MerchCartItem[] = [
  {
    id: "cart-1",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 0),
    variantLabel: "Size: M / Color: Black",
    unitPrice: "$39.99",
    quantity: 1,
  },
  {
    id: "cart-2",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    unitPrice: "$24.99",
    quantity: 2,
  },
  {
    id: "cart-3",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 0),
    variantLabel: "Size: 18×24 in",
    unitPrice: "$34.99",
    quantity: 1,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/** /merch/cart server component shell. */
export default function CartPage() {
  return <CartPageClient initialItems={DEMO_CART_ITEMS} />;
}
