import { merchAssetUrl } from "@low/fixtures";
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
// Real Sanity CDN asset IDs: hoodie + Riftbound deck + collectibles box detail.
// ---------------------------------------------------------------------------

const DEMO_CART_ITEMS: MerchCartItem[] = [
  {
    id: "cart-1",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: merchAssetUrl("74c1cee04be48521280fd81d65a7ded689500c53-2560x2560.png"),
    variantLabel: "Size: M / Color: Black",
    unitPrice: "$39.99",
    quantity: 1,
  },
  {
    id: "cart-2",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: merchAssetUrl("7f07ffee92dabe0e6b2dac03d219e574eebdb870-2560x2560.png"),
    unitPrice: "$24.99",
    quantity: 2,
  },
  {
    id: "cart-3",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: merchAssetUrl("6c5085455d8e8802cb29dd2d38b660e16aa446e4-2560x2560.png"),
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
