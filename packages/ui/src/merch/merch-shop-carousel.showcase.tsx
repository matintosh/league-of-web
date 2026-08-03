import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchShopCarousel } from "./merch-shop-carousel";
import { MerchShopCarouselDemo } from "./merch-shop-carousel.demo";

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

const LOL_PRODUCTS: MerchProduct[] = [
  { slug: "arcane-vi-hoodie",            title: "Arcane Vi Graphic Hoodie",               imageUrl: championSplashUrl("Vi", 0),      price: "$39.99", originalPrice: "$59.99", badge: "Sale" },
  { slug: "jinx-chaos-tee",              title: "Jinx Chaos Agent Graphic Tee",           imageUrl: championSplashUrl("Jinx", 0),    price: "$24.99", badge: "New" },
  { slug: "lol-classic-cap",             title: "League of Legends Classic Logo Cap",     imageUrl: championSplashUrl("Lux", 0),     price: "$27.99" },
  { slug: "project-lux-art-print",       title: "PROJECT: Lux Collector's Art Print",     imageUrl: championSplashUrl("Lux", 0),     price: "$34.99", badge: "Limited" },
  { slug: "poro-plush-s14",              title: "Poro Limited Edition Plush — Season 14", imageUrl: championSplashUrl("Lux", 0),     price: "$29.99", badge: "Preorder" },
  { slug: "arcane-caitlyn-figure",       title: "Arcane Caitlyn Collector's Resin Figure",imageUrl: championSplashUrl("Caitlyn", 0), price: "$49.99", badge: "Restock" },
  { slug: "league-classic-collectors-box", title: "League Classic Collector's Box",       imageUrl: championSplashUrl("Jinx", 0),    price: "$89.99" },
];

/** Two-product edge case for the partial-fill variant. */
const FEW_PRODUCTS: MerchProduct[] = [
  { slug: "arcane-vi-hoodie",  title: "Arcane Vi Graphic Hoodie",     imageUrl: championSplashUrl("Vi", 0),   price: "$39.99", badge: "Sale" },
  { slug: "jinx-chaos-tee",   title: "Jinx Chaos Agent Graphic Tee", imageUrl: championSplashUrl("Jinx", 0), price: "$24.99" },
];

/** Banner placeholder — a wide landscape splash from Data Dragon. */
const BANNER_URL   = championSplashUrl("Vi", 0);
/** Logo placeholder — a portrait splash (we scale it down to ~200px wide). */
const LOGO_URL     = championSplashUrl("Lux", 0);

// ---------------------------------------------------------------------------
// Showcase entry
// ---------------------------------------------------------------------------

export const merchShopCarouselShowcase: ShowcaseEntry = {
  slug: "merch-shop-carousel",
  name: "Merch Shop Carousel",
  area: "merch",
  description:
    "Franchise-branded product carousel for the merch PDP. Composed of: a 320px tall banner (bg image + optional franchise logo + 'Shop Now' red CTA), a 16px/700 franchise h2 label, and a horizontal CSS scroll-snap track of 355×375px MerchProductCard tiles (~3+ visible at 1280px) with prev/next arrow controls. Measured from merch.riotgames.com/en-us/product/league-classic-collectors-box/.",
  variants: [
    {
      name: "Default — League of Legends, 7 cards",
      notes:
        "Full carousel with banner, logo, CTA, franchise label, and 7 product cards. At 1280px the track shows ~3 full cards + a partial 4th. Use the arrows to scroll.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchShopCarousel
            franchiseName="League of Legends"
            bannerImageUrl={BANNER_URL}
            franchiseLogoUrl={LOGO_URL}
            shopNowHref="/merch/shop-all"
            products={LOL_PRODUCTS}
          />
        </div>
      ),
    },
    {
      name: "No franchise logo",
      notes:
        "Banner without a logo — only the 'Shop Now' CTA is shown. Useful for franchises that bake the logo into the banner image itself.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchShopCarousel
            franchiseName="VALORANT"
            bannerImageUrl={BANNER_URL}
            shopNowHref="/merch/shop-all"
            products={LOL_PRODUCTS}
          />
        </div>
      ),
    },
    {
      name: "Partial fill — 2 products",
      notes:
        "Edge case: fewer products than the visible window. Cards are left-aligned; no overflow, arrows still render but do nothing meaningful.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchShopCarousel
            franchiseName="Arcane"
            bannerImageUrl={BANNER_URL}
            franchiseLogoUrl={LOGO_URL}
            shopNowHref="/merch/shop-all"
            products={FEW_PRODUCTS}
          />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes:
        "Client-side demo: onProductClick fires an alert. Scroll the card track with the arrows or drag.",
      backgrounds: ["light"],
      render: () => <MerchShopCarouselDemo />,
    },
  ],
};
