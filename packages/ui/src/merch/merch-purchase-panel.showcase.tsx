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
    "PDP right column: 14px/600 uppercase category trail (no '/' glyphs), H1 (clamp 38–48px/700/uppercase/-0.02em), heart+share 40×40 icon row with badge at end (green #8cd50b 'New', mixed-case, 16px/400), price 28px/400/lh35px (no dividers), variant chips (8px×16px, active ink bg), 16px BLACK notices, 239px CTA (riotSans 16/600/0.02em). showQuantity=false hides stepper (real PDP has none). Measured from merch.riotgames.com (amumu-plush, 2026-08).",
  variants: [
    {
      name: "Normal PDP — category trail + heart/share row + New badge + notices",
      notes:
        "No qty stepper (showQuantity=false). Heart and share icon buttons. 'New' badge on the icon row. 14px uppercase trail. Notices in 16px black. 239px CTA.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            categoryTrail={["Collectibles", "Plush", "League of Legends"]}
            title="Amumu Plush"
            price="$39.99"
            badges={["New"]}
            notices={[
              "This product is not intended as a toy or children's product.",
              "This item typically ships within 2 weeks from purchase.",
            ]}
            showQuantity={false}
          />
        </div>
      ),
    },
    {
      name: "With size variants — size guide link + M selected",
      notes:
        "Variant selector shown; M selected (active chip); L/XXL disabled. Size Guide link in label row. No qty stepper.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            categoryTrail={["Apparel", "T-Shirts", "League of Legends"]}
            title="MSI 2026 Tee"
            price="$39.99"
            badges={["New"]}
            notices={[
              "This product is not intended as a toy or children's product.",
              "This item typically ships within 2 weeks from purchase.",
            ]}
            variants={SIZES}
            variantLabel="Size"
            selectedVariant="M"
            showSizeGuideLink
            showQuantity={false}
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
            badges={["Limited Edition"]}
            variants={SIZES}
            variantLabel="Size"
            selectedVariant="S"
            showQuantity={false}
          />
        </div>
      ),
    },
    {
      name: "With qty stepper shown (showcase-only demo use)",
      notes: "showQuantity=true renders the −/1/+ stepper. Not shown on the real PDP.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchPurchasePanel
            title="LoL Classic Hoodie"
            price="$59.99"
            notices={[
              "This product is not intended as a toy or children's product.",
              "This item typically ships within 2 weeks from purchase.",
            ]}
            variants={SIZES}
            variantLabel="Size"
            selectedVariant="M"
            showQuantity
            quantity={2}
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
            outOfStock
          />
        </div>
      ),
    },
  ],
};
