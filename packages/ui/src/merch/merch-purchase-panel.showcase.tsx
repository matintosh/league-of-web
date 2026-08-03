import type { ShowcaseEntry } from "../showcase";
import { MerchPurchasePanel } from "./merch-purchase-panel";

const SIZES = [
  { label: "XS", available: true },
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: false },
  { label: "XL", available: true },
  { label: "XXL", available: false },
];

export const merchPurchasePanelShowcase: ShowcaseEntry = {
  slug: "merch-purchase-panel",
  name: "Merch Purchase Panel",
  area: "merch",
  description:
    "PDP right column: title (clamp 32–48px/700), inline badge chips, price (16px/400; sale = struck original + red), size chip strip (active ink bg+border, disabled 0.35 opacity+line-through), qty stepper (40×40, minus disabled at 1), full-width Add to Cart (50px, 16px/600, merch-red). Measured from merch.riotgames.com PDP.",
  variants: [
    {
      name: "Normal — sizes, one selected",
      notes:
        "M selected (active chip); XS/S/XL available; L/XXL disabled (out of stock). Qty=1 so minus is disabled.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            breadcrumb={["Home", "Tops", "MSI 2026 Tee"]}
            title="MSI 2026 Tee"
            price="$39.99"
            badges={["New"]}
            variants={SIZES}
            variantLabel="Size"
            selectedVariant="M"
            quantity={1}
            description="Celebrate Midseason Showdown with this officially licensed apparel. 100% cotton preshrunk jersey tee."
          />
        </div>
      ),
    },
    {
      name: "Sale — struck original + red price",
      notes: "originalPrice shown struck-through in muted; price in red.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            title="MSI 2026 Bomber Jacket"
            price="$79.99"
            originalPrice="$129.99"
            badges={["Sale", "Limited Edition"]}
            variants={SIZES}
            variantLabel="Size"
            selectedVariant="S"
            quantity={2}
          />
        </div>
      ),
    },
    {
      name: "No variants — selector hidden",
      notes: "Product has no size options; variant row not rendered.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            title="Riftbound Origins Champion Deck - Jinx"
            price="$24.99"
            quantity={1}
            description="A 60-card competitive champion deck featuring Jinx."
          />
        </div>
      ),
    },
    {
      name: "Out of stock — CTA disabled",
      notes: "outOfStock=true; button greyed with 'Out of Stock' label.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            title="Poro Limited Edition Plush"
            price="$49.99"
            badges={["Limited Edition"]}
            variants={[
              { label: "S", available: false },
              { label: "M", available: false },
              { label: "L", available: false },
            ]}
            selectedVariant="M"
            quantity={1}
            outOfStock
          />
        </div>
      ),
    },
  ],
};
