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
    "Real 640×375 listing card anatomy matching merch.riotgames.com shop-all (remeasured 2026-08-06). Header row (~57px) above the 225px contain image: franchise wordmark left (grey #666, 16px/400), badge chips in a HORIZONTAL ROW + heart right. Badge chips: 14px mixed-case, black text; New=#8CD50B, Limited Edition=#FFD700, Preorder=#666666, OOS=#666666 white-text. At 390px badges wrap to 2nd row; always-visible red cart button beside price. Image carousel: prev/next arrows revealed on hover. Price: 16px/400 pure black. Sale: struck original grey + current dark ink + green -NN% badge. Card bg: transparent (listing pages are white). 1px white border seam for flush tessellation.",
  variants: [
    {
      name: "Default — in-stock, franchise label, no badge",
      notes: "Standard 2-col card with franchise label overlay but no badge. Transparent bg.",
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
        "Sale treatment per real /category/sales/: green -NN% badge top-right of header, current price in dark ink (not red), struck original in grey (#666) at 16px. The 'Sale' label is not rendered as a chip — the %-badge signals the discount.",
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
      notes: "Badge 'New' in green (#8CD50B) with black text, matching real store chip.",
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
      notes: "Badge 'Limited Edition' in yellow (#FFD700) with ink text.",
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
      name: "Multi-badge horizontal row — New + Limited Edition + Preorder",
      notes:
        "Three badges in ONE horizontal row (flex-row gap-1) matching real shop-all @1280 (badges y=211 all equal). At 390px they wrap to a second row — Preorder drops below New+LE.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="ahri-spirit-blossom-preorder"
            title="Ahri Spirit Blossom Statue — Limited Preorder"
            imageUrl={PLACEHOLDER_IMG}
            price="$89.99"
            badges={["New", "Limited Edition", "Preorder"]}
            franchiseLabel="League of Legends"
          />
        </div>
      ),
    },
    {
      name: "Multi-badge — Preorder + Limited Edition (2 badges)",
      notes: "Two badges in a horizontal row top-right: Preorder (grey/white) + Limited Edition (yellow).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="ahri-spirit-blossom-limited"
            title="Ahri Spirit Blossom Statue — Limited Edition"
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
      name: "Out of Stock chip — grey solid, white text",
      notes:
        "OOS chip: same chip family as Preorder — solid #666666 bg, white text, radius 2, padding 4x8. Real: Inter 14/400 sentence-case, no border. Previous incorrect style had white bg + border + dark text.",
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
      name: "Image carousel — multiple imageSrcs",
      notes:
        "When imageSrcs has 2+ entries, prev/next circular arrow buttons appear on card hover. Clicking prev/next cycles through images without navigating.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 640, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductCard
            slug="poro-plush-carousel"
            title="Poro Plush — Season 14 (3 images)"
            imageUrl={PLACEHOLDER_IMG}
            imageSrcs={[PLACEHOLDER_IMG, PLACEHOLDER_DARK, PLACEHOLDER_RED]}
            price="$29.99"
            badges={["New"]}
            franchiseLabel="League of Legends"
          />
        </div>
      ),
    },
    {
      name: "imageFit=contain — packshot on white",
      notes: "object-contain on transparent bg for product photography; image is not cropped.",
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
      name: "Long title — no clamp, wraps naturally",
      notes:
        "Title wraps naturally at 2-col width — no line-clamp. Real site shows full titles never ellipsized.",
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
      name: "Real 2-col flush grid of 4 cards — mixed badges and sale",
      notes:
        "2 columns, 0 gap, flush border — matches real shop-all layout at 1280px. Badges are horizontal rows. Sale card (p2) shows green %-badge + dark price + grey struck. Card bg transparent (white page shows). Check column alignment: titles and prices should be at equal y per column.",
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
          <MerchProductCard slug="p1" title="Riftbound Origins Champion Deck" imageUrl={PLACEHOLDER_IMG} price="$24.99" badges={["New"]} franchiseLabel="Riftbound" />
          <MerchProductCard slug="p2" title="Arcane Vi Graphic Hoodie" imageUrl={PLACEHOLDER_RED} price="$39.99" originalPrice="$59.99" badges={["Sale"]} franchiseLabel="Arcane" />
          <MerchProductCard slug="p3" title="PROJECT: Lux Collector's Art Print" imageUrl={PLACEHOLDER_DARK} price="$34.99" badges={["Limited Edition"]} franchiseLabel="League of Legends" />
          <MerchProductCard slug="p4" title="Poro Plush Season 14 Limited Edition Collector's Bundle" imageUrl={PLACEHOLDER_IMG} price="$29.99" badges={["Preorder", "Limited Edition"]} franchiseLabel="League of Legends" />
        </div>
      ),
    },
    {
      name: "2-col grid @390 — badge wrap + mobile cart button",
      notes:
        "Simulate 390px viewport: 2-col grid, cards ~195px wide. Badges wrap to 2nd row. Always-visible red cart button (48×40) appears beside the price at mobile. No horizontal overflow.",
      backgrounds: ["light"],
      render: () => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 0,
            maxWidth: 390,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <MerchProductCard slug="m1" title="Riftbound Origins Deck" imageUrl={PLACEHOLDER_IMG} price="$24.99" badges={["New", "Limited Edition"]} franchiseLabel="Riftbound" />
          <MerchProductCard slug="m2" title="Arcane Vi Graphic Hoodie" imageUrl={PLACEHOLDER_RED} price="$39.99" originalPrice="$59.99" badges={["Sale"]} franchiseLabel="Arcane" />
        </div>
      ),
    },
  ],
};
