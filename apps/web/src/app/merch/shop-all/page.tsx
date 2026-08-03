import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { ShopAllPageClient } from "./shop-all-page-client";

/**
 * /merch/shop-all — all-products browse page.
 * Composed of: MerchHeader(activeCategory="shop-all") + MerchCollectionHero +
 *              MerchFilterSortBar + MerchProductGrid(cards) + MerchFooter.
 * Same template as a collection page but shows all categories.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * Interactive state (sort, filter, cart) delegated to ShopAllPageClient.
 */

// ---------------------------------------------------------------------------
// Fixture data — all categories, 16 products
// ---------------------------------------------------------------------------

const ALL_PRODUCTS: MerchProduct[] = [
  // Apparel
  {
    slug: "arcane-vi-hoodie",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 0),
    price: "$39.99",
    originalPrice: "$59.99",
    badge: "Sale",
  },
  {
    slug: "riot-wordmark-tee",
    title: "Riot Games Wordmark Essential T-Shirt",
    imageUrl: championSplashUrl("Ahri", 0),
    price: "$24.99",
    badge: "New",
  },
  {
    slug: "valorant-agent-hoodie",
    title: "VALORANT Agent Collection Pullover Hoodie",
    imageUrl: championSplashUrl("Lux", 1),
    price: "$54.99",
    badge: "Limited",
  },
  {
    slug: "project-lux-bomber",
    title: "PROJECT: Lux Embroidered Bomber Jacket",
    imageUrl: championSplashUrl("Lux", 0),
    price: "$89.99",
    badge: "New",
  },
  // Collectibles
  {
    slug: "poro-plush-limited",
    title: "Poro Limited Edition Plush — Season 14",
    imageUrl: championSplashUrl("Jinx", 2),
    price: "$29.99",
    badge: "Out of Stock",
  },
  {
    slug: "riftbound-origins-jinx-deck",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$24.99",
    badge: "New",
  },
  {
    slug: "ahri-statue-limited",
    title: "Ahri Spirit Blossom Limited Statue",
    imageUrl: championSplashUrl("Ahri", 2),
    price: "$129.99",
    badge: "Limited",
  },
  {
    slug: "arcane-jinx-enamel-pin",
    title: "Arcane Jinx & Vi Enamel Pin Set",
    imageUrl: championSplashUrl("Jinx", 1),
    price: "$14.99",
    badge: "Sale",
    originalPrice: "$19.99",
  },
  // Art
  {
    slug: "project-lux-art-print",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 2),
    price: "$34.99",
    badge: "New",
  },
  {
    slug: "arcane-vi-jinx-art-print",
    title: "Arcane Vi & Jinx Lithograph (24×36)",
    imageUrl: championSplashUrl("Vi", 1),
    price: "$49.99",
  },
  // Accessories
  {
    slug: "legends-crest-cap",
    title: "Legends Crest Structured Cap",
    imageUrl: championSplashUrl("Ahri", 1),
    price: "$29.99",
  },
  {
    slug: "ruined-king-backpack",
    title: "Ruined King Premium Backpack",
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$79.99",
    badge: "New",
  },
  // Misc
  {
    slug: "rift-wanderer-zip-hoodie",
    title: "Rift Wanderer Zip-Up Hoodie",
    imageUrl: championSplashUrl("Teemo", 1),
    price: "$64.99",
  },
  {
    slug: "arcane-caitlyn-tee",
    title: "Arcane Caitlyn Enforcer Tee",
    imageUrl: championSplashUrl("Caitlyn", 0),
    price: "$34.99",
    badge: "Sale",
    originalPrice: "$44.99",
  },
  {
    slug: "ruination-teemo-plush",
    title: 'Ruined Teemo 12" Collector Plush',
    imageUrl: championSplashUrl("Teemo", 2),
    price: "$19.99",
  },
  {
    slug: "arcane-sisters-crewneck",
    title: "Arcane Sisters Crewneck Sweatshirt",
    imageUrl: championSplashUrl("Vi", 2),
    price: "$49.99",
    badge: "Out of Stock",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/** /merch/shop-all server component shell. */
export default function ShopAllPage() {
  return <ShopAllPageClient products={ALL_PRODUCTS} />;
}
