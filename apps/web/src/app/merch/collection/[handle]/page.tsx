import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { CollectionPageClient } from "./collection-page-client";

/**
 * /merch/collection/[handle] — collection/category browse page.
 * Composed of: MerchHeader + MerchCollectionHero + MerchFilterSortBar +
 *              MerchProductGrid(cards) + MerchFooter.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 * All interactive callbacks are delegated to CollectionPageClient.
 */

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

const APPAREL_PRODUCTS: MerchProduct[] = [
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
  {
    slug: "arcane-jinx-tee",
    title: "Arcane Jinx Typography Tee",
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$29.99",
    badge: "Sale",
    badges: ["Sale"],
    originalPrice: "$39.99",
    franchiseLabel: "Arcane",
  },
  {
    slug: "rift-wanderer-zip-hoodie",
    title: "Rift Wanderer Zip-Up Hoodie",
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$64.99",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "arcane-sisters-crewneck",
    title: "Arcane Sisters Crewneck Sweatshirt",
    imageUrl: championSplashUrl("Vi", 1),
    price: "$49.99",
    badge: "Out of Stock",
    badges: ["Out of Stock"],
    franchiseLabel: "Arcane",
  },
  {
    slug: "legends-crest-cap",
    title: "Legends Crest Structured Cap",
    imageUrl: championSplashUrl("Ahri", 1),
    price: "$29.99",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "arcane-caitlyn-tee",
    title: "Arcane Caitlyn Enforcer Tee",
    imageUrl: championSplashUrl("Caitlyn", 0),
    price: "$34.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "Arcane",
  },
  {
    slug: "rift-classic-polo",
    title: "Rift Classic League Polo",
    imageUrl: championSplashUrl("Jinx", 2),
    price: "$44.99",
    franchiseLabel: "League of Legends",
  },
];

const COLLECTIBLES_PRODUCTS: MerchProduct[] = [
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
    slug: "ruination-teemo-plush",
    title: 'Ruined Teemo 12" Collector Plush',
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$19.99",
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
    slug: "project-lux-art-print",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 0),
    price: "$34.99",
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
    slug: "arcane-teemo-minifig",
    title: "Arcane Teemo Mini Figure Set",
    imageUrl: championSplashUrl("Teemo", 1),
    price: "$39.99",
    badge: "New",
    badges: ["New"],
    franchiseLabel: "Arcane",
  },
  {
    slug: "league-chess-set",
    title: "League of Legends Champion Chess Set",
    imageUrl: championSplashUrl("Ahri", 0),
    price: "$89.99",
    franchiseLabel: "League of Legends",
  },
];

/** Fallback product set for unknown handles. */
const DEFAULT_PRODUCTS: MerchProduct[] = [
  ...APPAREL_PRODUCTS.slice(0, 4),
  ...COLLECTIBLES_PRODUCTS.slice(0, 4),
];

interface CollectionPageMeta {
  heading: string;
  products: MerchProduct[];
}

/** Look up collection metadata from the URL handle. */
function getCollectionMeta(handle: string): CollectionPageMeta {
  switch (handle) {
    case "apparel":
      return { heading: "Apparel", products: APPAREL_PRODUCTS };
    case "collectibles":
      return { heading: "Collectibles", products: COLLECTIBLES_PRODUCTS };
    case "art":
      return {
        heading: "Art",
        products: DEFAULT_PRODUCTS.map((p) => ({
          ...p,
          slug: `art-${p.slug}`,
        })),
      };
    case "accessories":
      return {
        heading: "Accessories",
        products: DEFAULT_PRODUCTS.map((p) => ({
          ...p,
          slug: `acc-${p.slug}`,
        })),
      };
    case "sale":
      return {
        heading: "Sale",
        products: [
          ...APPAREL_PRODUCTS.filter((p) => p.badge === "Sale"),
          ...COLLECTIBLES_PRODUCTS.filter((p) => p.badge === "Sale"),
        ],
      };
    default:
      return { heading: "Collection", products: DEFAULT_PRODUCTS };
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
}

/** /merch/collection/[handle] server component shell. */
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const { heading, products } = getCollectionMeta(handle);

  return (
    <CollectionPageClient
      handle={handle}
      heading={heading}
      products={products}
    />
  );
}
