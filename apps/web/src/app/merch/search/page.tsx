import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { SearchPageClient } from "./search-page-client";

/**
 * /merch/search — search results page.
 * Server component shell: reads the ?q= search param, filters the static
 * product fixture list, and passes results to the interactive client component.
 *
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 */

// ---------------------------------------------------------------------------
// Fixture data — shared with shop-all, all 16 products
// ---------------------------------------------------------------------------

export const ALL_PRODUCTS: MerchProduct[] = [
  // Apparel
  {
    slug: "arcane-vi-hoodie",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 0),
    price: "$39.99",
    originalPrice: "$59.99",
    badge: "Sale",
    badges: ["Sale"],
    franchiseLabel: "Arcane",
  },
  {
    slug: "riot-wordmark-tee",
    title: "Riot Games Wordmark Essential T-Shirt",
    imageUrl: championSplashUrl("Ahri", 0),
    price: "$24.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "Riot Games",
  },
  {
    slug: "valorant-agent-hoodie",
    title: "VALORANT Agent Collection Pullover Hoodie",
    imageUrl: championSplashUrl("Lux", 1),
    price: "$54.99",
    badge: "Limited",
    badges: ["Limited Edition"],
    franchiseLabel: "Valorant",
  },
  {
    slug: "project-lux-bomber",
    title: "PROJECT: Lux Embroidered Bomber Jacket",
    imageUrl: championSplashUrl("Lux", 0),
    price: "$89.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "League of Legends",
  },
  // Collectibles
  {
    slug: "poro-plush-limited",
    title: "Poro Limited Edition Plush — Season 14",
    imageUrl: championSplashUrl("Jinx", 2),
    price: "$29.99",
    badge: "Out of Stock",
    badges: ["Out of Stock"],
    franchiseLabel: "League of Legends",
  },
  {
    slug: "riftbound-origins-jinx-deck",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$24.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "Riftbound",
  },
  {
    slug: "ahri-statue-limited",
    title: "Ahri Spirit Blossom Limited Statue",
    imageUrl: championSplashUrl("Ahri", 2),
    price: "$129.99",
    badge: "Limited",
    badges: ["Limited Edition"],
    franchiseLabel: "League of Legends",
  },
  {
    slug: "arcane-jinx-enamel-pin",
    title: "Arcane Jinx & Vi Enamel Pin Set",
    imageUrl: championSplashUrl("Jinx", 1),
    price: "$14.99",
    badge: "Sale",
    badges: ["Sale"],
    originalPrice: "$19.99",
    franchiseLabel: "Arcane",
  },
  // Art
  {
    slug: "project-lux-art-print",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 2),
    price: "$34.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "League of Legends",
  },
  {
    slug: "arcane-vi-jinx-art-print",
    title: "Arcane Vi & Jinx Lithograph (24×36)",
    imageUrl: championSplashUrl("Vi", 1),
    price: "$49.99",
    franchiseLabel: "Arcane",
  },
  // Accessories
  {
    slug: "legends-crest-cap",
    title: "Legends Crest Structured Cap",
    imageUrl: championSplashUrl("Ahri", 1),
    price: "$29.99",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "ruined-king-backpack",
    title: "Ruined King Premium Backpack",
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$79.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "League of Legends",
  },
  // Misc
  {
    slug: "rift-wanderer-zip-hoodie",
    title: "Rift Wanderer Zip-Up Hoodie",
    imageUrl: championSplashUrl("Teemo", 1),
    price: "$64.99",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "arcane-caitlyn-tee",
    title: "Arcane Caitlyn Enforcer Tee",
    imageUrl: championSplashUrl("Caitlyn", 0),
    price: "$34.99",
    badge: "Sale",
    badges: ["Sale"],
    originalPrice: "$44.99",
    franchiseLabel: "Arcane",
  },
  {
    slug: "ruination-teemo-plush",
    title: 'Ruined Teemo 12" Collector Plush',
    imageUrl: championSplashUrl("Teemo", 2),
    price: "$19.99",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "arcane-sisters-crewneck",
    title: "Arcane Sisters Crewneck Sweatshirt",
    imageUrl: championSplashUrl("Vi", 2),
    price: "$49.99",
    badge: "Out of Stock",
    badges: ["Out of Stock"],
    franchiseLabel: "Arcane",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Filter products by a query string (case-insensitive title match). */
function filterProducts(products: MerchProduct[], query: string): MerchProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.title.toLowerCase().includes(q));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

/** /merch/search server component shell. */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const initialResults = filterProducts(ALL_PRODUCTS, query);

  return (
    <SearchPageClient
      allProducts={ALL_PRODUCTS}
      initialQuery={query}
      initialResults={initialResults}
    />
  );
}
