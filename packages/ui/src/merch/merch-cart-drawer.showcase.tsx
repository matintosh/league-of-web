import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCartDrawer } from "./merch-cart-drawer";

const ITEMS = [
  {
    id: "item-1",
    title: "MSI 2026 Tee",
    imageUrl: championSplashUrl("Jinx", 0),
    variantLabel: "Size: M",
    unitPrice: "$39.99",
    quantity: 1,
  },
  {
    id: "item-2",
    title: "MSI 2026 Bomber Jacket",
    imageUrl: championSplashUrl("Vi", 0),
    variantLabel: "Size: S",
    unitPrice: "$129.99",
    quantity: 2,
  },
];

export const merchCartDrawerShowcase: ShowcaseEntry = {
  slug: "merch-cart-drawer",
  name: "Merch Cart Drawer",
  area: "merch",
  description:
    "400px right slide-in cart: scrim rgba(0,0,0,0.4), header 'YOUR CART' (14px/700/uppercase), line items (80×80 thumb + title + variant + compact 28×28 stepper + price + remove), sticky footer (subtotal + shipping note + 52px red checkout btn), empty state (bag icon + muted text + red 'Continue Shopping'). Controlled via open/items/onClose/onQtyChange/onRemove/onCheckout.",
  variants: [
    {
      name: "Open — 2 line items",
      notes:
        "Shows full line item list with subtotal, shipping note, and checkout button.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ position: "relative", height: 600, overflow: "hidden" }}>
          <MerchCartDrawer open={true} items={ITEMS} subtotal="$299.97" />
        </div>
      ),
    },
    {
      name: "Open — empty cart",
      notes: "items=[] renders the empty state: bag icon + message + Continue Shopping.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ position: "relative", height: 600, overflow: "hidden" }}>
          <MerchCartDrawer open={true} items={[]} subtotal="$0.00" />
        </div>
      ),
    },
    {
      name: "Closed — not visible",
      notes: "open=false: drawer translated off-screen (translateX(100%)).",
      backgrounds: ["light"],
      render: () => (
        <div
          style={{
            position: "relative",
            height: 120,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: "var(--color-merch-muted)",
              fontSize: 13,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Drawer is closed (open=false) — no visible content
          </p>
          <MerchCartDrawer open={false} items={ITEMS} subtotal="$299.97" />
        </div>
      ),
    },
  ],
};
