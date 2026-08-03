import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchProductCard } from "./merch-product-card";

/** Product placeholder images sourced from the Data Dragon CDN (ddragon.leagueoflegends.com). */
const PLACEHOLDER_IMG = championSplashUrl("Jinx", 0);
const PLACEHOLDER_DARK = championSplashUrl("Lux", 0);
const PLACEHOLDER_RED  = championSplashUrl("Vi", 0);

export const merchProductCardShowcase: ShowcaseEntry = {
  slug: "merch-product-card",
  name: "Merch Product Card",
  area: "merch",
  description:
    "Atomic product tile for the Riot merch store grid: square image (hover scale), title 16px/700 (line-clamp 2), price, optional badge. Badge colors: New=green (#7ac043), Limited=yellow (#e8c33c), Preorder/Restock=grey (#5a5a5a), Sale=red. imageFit='contain' for packshot photography on white. Measured from merch.riotgames.com (~280px wide, 4-column grid with 20px gap).",
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
      name: "New badge — green",
      notes: "Badge 'New' in green (#7ac043) with white text, matching real store filter chip.",
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
      name: "Limited badge — yellow",
      notes: "Badge 'Limited' in yellow (#e8c33c) with ink text, matching real store filter chip.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="valorant-agent-hoodie"
            title="VALORANT Agent Collection Pullover Hoodie"
            imageUrl={PLACEHOLDER_DARK}
            price="$54.99"
            badge="Limited"
          />
        </div>
      ),
    },
    {
      name: "Preorder badge — grey",
      notes: "Badge 'Preorder' in grey (#5a5a5a) with white text, matching real store filter chip.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="ahri-spirit-blossom-preorder"
            title="Ahri Spirit Blossom Statue — Limited Preorder"
            imageUrl={PLACEHOLDER_IMG}
            price="$89.99"
            badge="Preorder"
          />
        </div>
      ),
    },
    {
      name: "Restock badge — green",
      notes: "Badge 'Restock' shares the green badge color with 'New'.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-caitlyn-restock"
            title="Arcane Caitlyn Collector's Resin Figure"
            imageUrl={PLACEHOLDER_RED}
            price="$49.99"
            badge="Restock"
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
      name: "imageFit=contain — packshot on white",
      notes: "object-contain on white bg for product photography; image is not cropped.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="league-classic-cap"
            title="League of Legends Classic Logo Cap"
            imageUrl={PLACEHOLDER_DARK}
            price="$27.99"
            imageFit="contain"
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
      notes: "Cards inside a typical 4-column grid at ~280px each, 20px gap — all badge variants.",
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
          <MerchProductCard slug="p3" title="PROJECT: Lux Art Print" imageUrl={PLACEHOLDER_DARK} price="$34.99" badge="Limited" />
          <MerchProductCard slug="p4" title="Poro Plush Season 14 Limited Edition Collector's Bundle" imageUrl={PLACEHOLDER_IMG} price="$29.99" badge="Preorder" />
        </div>
      ),
    },
  ],
};
