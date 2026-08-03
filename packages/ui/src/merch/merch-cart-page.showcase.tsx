import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCartPage } from "./merch-cart-page";
import type { MerchCartItem } from "@low/fixtures";

const ITEMS: MerchCartItem[] = [
  {
    id: "item-1",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 0),
    variantLabel: "Size: M / Color: Black",
    unitPrice: "$39.99",
    quantity: 1,
  },
  {
    id: "item-2",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    variantLabel: undefined,
    unitPrice: "$24.99",
    quantity: 2,
  },
  {
    id: "item-3",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 0),
    variantLabel: "Size: 18×24 in",
    unitPrice: "$34.99",
    quantity: 1,
  },
];

export const merchCartPageShowcase: ShowcaseEntry = {
  slug: "merch-cart-page",
  name: "Merch Cart Page",
  area: "merch",
  description:
    "Full-page cart layout measured from merch.riotgames.com: 'YOUR CART' heading bar (20px/700 uppercase, ls 0.1em) + two-column desktop layout (flex-1 items left / 380px order summary right, gap 48px) + single-column mobile. Line items: 96×96 thumb, title (14px/500), variant (12px muted), CompactStepper (28×28), price right (14px/600), Remove link. Order Summary card: Subtotal/Shipping/Tax rows, divider, Total (16px/700), promo input, Checkout button (h-52px red full-width), Continue Shopping link. Empty state: bag icon + copy.",
  variants: [
    {
      name: "Filled cart — 3 items",
      notes:
        "Desktop two-column layout. Left: 3 line items with thumb/title/variant/stepper/price/remove. Right: Order Summary with subtotal/shipping/tax/total + promo + checkout.",
      backgrounds: ["light"],
      render: () => (
        <MerchCartPage
          items={ITEMS}
          subtotal="$124.96"
          shipping="Free"
          estimatedTax="$10.00"
          total="$134.96"
          promoCode=""
        />
      ),
    },
    {
      name: "Empty cart",
      notes:
        "Empty state: centered bag icon, 'Your cart is empty' (15px muted), 'Continue Shopping' red link.",
      backgrounds: ["light"],
      render: () => (
        <MerchCartPage
          items={[]}
          subtotal="$0.00"
        />
      ),
    },
    {
      name: "Single item — no variant, tax TBD",
      notes:
        "One item, no variantLabel. Tax shows '—'. Shipping 'Calculated at checkout'.",
      backgrounds: ["light"],
      render: () => (
        <MerchCartPage
          items={[
            {
              id: "item-solo",
              title: "Poro Limited Edition Plush — Season 14",
              imageUrl: championSplashUrl("Jinx", 2),
              unitPrice: "$29.99",
              quantity: 1,
            },
          ]}
          subtotal="$29.99"
          shipping="Calculated at checkout"
          total="$29.99"
        />
      ),
    },
  ],
};
