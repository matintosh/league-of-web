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
    "Real 2-col listing card for the Riot merch store grid. Franchise label text overlay top-left (uppercase white on dark scrim), multi-badge chips stacked top-right, heart/wishlist icon bottom-right, 1px border frame (flush tessellation), image 1/1 aspect-ratio with hover scale. Badge colors: New=green (#7ac043), Limited/Limited Edition=yellow (#e8c33c), Preorder/Restock=grey (#5a5a5a), Sale=red, Out of Stock=muted. Measured from merch.riotgames.com (~640px wide, 2-col flush grid).",
  variants: [
    {
      name: "Default — in-stock, franchise label, no badge",
      notes: "Standard 2-col card with franchise label overlay but no badge.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="riftbound-origins-jinx-deck"
            title="Riftbound Origins Champion Deck - Jinx"
            imageUrl={PLACEHOLDER_IMG}
            price="$24.99"
            franchiseLabel="Riftbound"
          />
        </div>
      ),
    },
    {
      name: "Sale badge — with sale + original price",
      notes: "Badge 'Sale' in red; original price struck through, sale price in red.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-vi-hoodie"
            title="Arcane Vi Graphic Hoodie"
            imageUrl={PLACEHOLDER_RED}
            price="$39.99"
            originalPrice="$59.99"
            badges={["Sale"]}
            franchiseLabel="Arcane"
          />
        </div>
      ),
    },
    {
      name: "New badge — green",
      notes: "Badge 'New' in green (#7ac043) with white text, matching real store chip.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="project-lux-art-print"
            title="PROJECT: Lux Collector's Art Print"
            imageUrl={PLACEHOLDER_DARK}
            price="$34.99"
            badges={["New"]}
            franchiseLabel="League of Legends"
          />
        </div>
      ),
    },
    {
      name: "Limited Edition badge — yellow",
      notes: "Badge 'Limited Edition' in yellow (#e8c33c) with ink text.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="valorant-agent-hoodie"
            title="VALORANT Agent Collection Pullover Hoodie"
            imageUrl={PLACEHOLDER_DARK}
            price="$54.99"
            badges={["Limited Edition"]}
            franchiseLabel="Valorant"
          />
        </div>
      ),
    },
    {
      name: "Multi-badge — Preorder + Limited Edition",
      notes: "Two stacked badges top-right: Preorder (grey) + Limited Edition (yellow).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="ahri-spirit-blossom-preorder"
            title="Ahri Spirit Blossom Statue — Limited Preorder"
            imageUrl={PLACEHOLDER_IMG}
            price="$89.99"
            badges={["Preorder", "Limited Edition"]}
            franchiseLabel="League of Legends"
          />
        </div>
      ),
    },
    {
      name: "Restock badge — green",
      notes: "Badge 'Restock' shares the green badge color with 'New'.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-caitlyn-restock"
            title="Arcane Caitlyn Collector's Resin Figure"
            imageUrl={PLACEHOLDER_RED}
            price="$49.99"
            badges={["Restock"]}
            franchiseLabel="Arcane"
          />
        </div>
      ),
    },
    {
      name: "Out of Stock badge",
      notes: "Muted border badge — card still renders, user can see product.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="poro-plush-limited"
            title="Poro Limited Edition Plush — Season 14"
            imageUrl={PLACEHOLDER_IMG}
            price="$29.99"
            badges={["Out of Stock"]}
            franchiseLabel="League of Legends"
          />
        </div>
      ),
    },
    {
      name: "imageFit=contain — packshot on white",
      notes: "object-contain on white bg for product photography; image is not cropped.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="league-classic-cap"
            title="League of Legends Classic Logo Cap"
            imageUrl={PLACEHOLDER_DARK}
            price="$27.99"
            imageFit="contain"
            franchiseLabel="League of Legends"
          />
        </div>
      ),
    },
    {
      name: "Long title — line-clamp 2",
      notes: "Title exceeding two lines is clamped with ellipsis; price remains visible.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-collector-box"
            title="Arcane Season 2 Collector's Box Set — Vi, Jinx, Caitlyn, Jayce Limited Premium Edition"
            imageUrl={PLACEHOLDER_DARK}
            price="$119.99"
            badges={["Limited Edition"]}
            franchiseLabel="Arcane"
          />
        </div>
      ),
    },
    {
      name: "Back-compat: single badge= prop",
      notes: "Legacy single badge prop still renders correctly (back-compat path).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="riftbound-deluxe-set"
            title="Riftbound Origins Deluxe Champion Set"
            imageUrl={PLACEHOLDER_IMG}
            price="$74.99"
            badge="Limited"
            franchiseLabel="Riftbound"
          />
        </div>
      ),
    },
    {
      name: "Real 2-col flush grid of 4 cards",
      notes: "2 columns, 0 gap, flush border — matches real shop-all layout at 1280px.",
      backgrounds: ["light"],
      render: () => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 0,
            maxWidth: 1280,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <MerchProductCard slug="p1" title="Riftbound Origins Deck" imageUrl={PLACEHOLDER_IMG} price="$24.99" badges={["New"]} franchiseLabel="Riftbound" />
          <MerchProductCard slug="p2" title="Arcane Vi Hoodie" imageUrl={PLACEHOLDER_RED} price="$39.99" originalPrice="$59.99" badges={["Sale"]} franchiseLabel="Arcane" />
          <MerchProductCard slug="p3" title="PROJECT: Lux Art Print" imageUrl={PLACEHOLDER_DARK} price="$34.99" badges={["Limited Edition"]} franchiseLabel="League of Legends" />
          <MerchProductCard slug="p4" title="Poro Plush Season 14 Limited Edition Collector's Bundle" imageUrl={PLACEHOLDER_IMG} price="$29.99" badges={["Preorder", "Limited Edition"]} franchiseLabel="League of Legends" />
        </div>
      ),
    },
  ],
};
