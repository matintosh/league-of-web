import type { ShowcaseEntry } from "../showcase";
import { MerchProductCard } from "./merch-product-card";

/** Placeholder image — solid warm grey rect from picsum equivalent, CDN-safe */
const PLACEHOLDER_IMG = "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Jinx_0.jpg";
const PLACEHOLDER_DARK = "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Lux_0.jpg";
const PLACEHOLDER_RED  = "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Vi_0.jpg";

export const merchProductCardShowcase: ShowcaseEntry = {
  slug: "merch-product-card",
  name: "Merch Product Card",
  area: "merch",
  description:
    "Atomic product tile for the Riot merch store grid: square image (hover scale), title (line-clamp 2), price, optional badge (New/Sale/Out of Stock/Limited). Sale state shows struck-through original + red sale price. Measured from merch.riotgames.com (~280px wide, 4-column grid with 20px gap).",
  variants: [
    {
      name: "Default — in-stock, no badge",
      notes: "Standard product tile with no badge.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="riftbound-origins-jinx-deck"
            title="Riftbound Origins Champion Deck - Jinx"
            imageUrl={PLACEHOLDER_IMG}
            price="$24.99"
          />
        </div>
      ),
    },
    {
      name: "Sale badge — with sale + original price",
      notes: "Badge 'Sale' in red; original price struck through, sale price in red.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-vi-hoodie"
            title="Arcane Vi Graphic Hoodie"
            imageUrl={PLACEHOLDER_RED}
            price="$39.99"
            originalPrice="$59.99"
            badge="Sale"
          />
        </div>
      ),
    },
    {
      name: "New badge",
      notes: "Badge 'New' in dark surface with white text.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="project-lux-art-print"
            title="PROJECT: Lux Collector's Art Print"
            imageUrl={PLACEHOLDER_DARK}
            price="$34.99"
            badge="New"
          />
        </div>
      ),
    },
    {
      name: "Out of Stock badge",
      notes: "Muted border badge — card still renders, user can see product.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="poro-plush-limited"
            title="Poro Limited Edition Plush — Season 14"
            imageUrl={PLACEHOLDER_IMG}
            price="$29.99"
            badge="Out of Stock"
          />
        </div>
      ),
    },
    {
      name: "Long title — line-clamp 2",
      notes: "Title exceeding two lines is clamped with ellipsis; price remains visible.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-collector-box"
            title="Arcane Season 2 Collector's Box Set — Vi, Jinx, Caitlyn, Jayce Limited Premium Edition"
            imageUrl={PLACEHOLDER_DARK}
            price="$119.99"
            badge="Limited"
          />
        </div>
      ),
    },
    {
      name: "Grid of 4 cards",
      notes: "Cards inside a typical 4-column grid at ~280px each, 20px gap.",
      backgrounds: ["light"],
      render: () => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "20px",
            maxWidth: 1180,
            fontFamily: "system-ui, sans-serif",
            padding: "16px",
          }}
        >
          <MerchProductCard slug="p1" title="Riftbound Origins Deck" imageUrl={PLACEHOLDER_IMG} price="$24.99" badge="New" />
          <MerchProductCard slug="p2" title="Arcane Vi Hoodie" imageUrl={PLACEHOLDER_RED} price="$39.99" originalPrice="$59.99" badge="Sale" />
          <MerchProductCard slug="p3" title="PROJECT: Lux Art Print" imageUrl={PLACEHOLDER_DARK} price="$34.99" />
          <MerchProductCard slug="p4" title="Poro Plush Season 14 Limited Edition Collector's Bundle" imageUrl={PLACEHOLDER_IMG} price="$29.99" badge="Out of Stock" />
        </div>
      ),
    },
  ],
};
