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
    "Real 640×375 listing card anatomy matching merch.riotgames.com shop-all (remeasured 2026-08-06). Header row (~57px) above the 225px contain image: franchise wordmark left (grey #666, 16px/400), badge chips + heart right. Badge chips: 14px mixed-case, black text; New=#8CD50B, Limited Edition=#FFD700, Preorder=#666666. Price: 16px/400 pure black. Sale: struck original grey + current dark ink + green -NN% bottom-left of image. In-card CTA button (onAddToCart). Card bg: --color-merch-surface-alt (#f7f7f7), 1px border frame (flush tessellation at 1280 and 390).",
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
      name: "Sale — green %-badge + dark price + grey struck original",
      notes:
        "Sale treatment per real /category/sales/: green -NN% badge top-left of image (below franchise label), current price in dark ink (not red), struck original in grey (#666) at 16px. The 'Sale' label is not rendered as a chip — the %-badge signals the discount.",
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
      name: "Sale — originalPrice only (no Sale badge), %-badge computed",
      notes:
        "When originalPrice differs from price but no explicit 'Sale' badge is passed, the card still shows the green %-badge and correct price treatment.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="lol-classic-hoodie-sale"
            title="League of Legends Classic Logo Pullover Hoodie"
            imageUrl={PLACEHOLDER_DARK}
            price="$19.99"
            originalPrice="$39.99"
            franchiseLabel="League of Legends"
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
      name: "In-card CTA — Login to purchase",
      notes: "ctaLabel='Login to purchase' for unauthenticated users; onAddToCart callback wired.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="arcane-jinx-statue"
            title="Arcane Jinx Collector Resin Statue"
            imageUrl={PLACEHOLDER_RED}
            price="$89.99"
            badges={["Limited Edition"]}
            franchiseLabel="Arcane"
            ctaLabel="Login to purchase"
          />
        </div>
      ),
    },
    {
      name: "Real 2-col flush grid of 4 cards — mixed sale and non-sale",
      notes:
        "2 columns, 0 gap, flush border — matches real shop-all layout at 1280px. Sale card (p2) shows green %-badge + dark price + grey struck; non-sale cards unchanged.",
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
