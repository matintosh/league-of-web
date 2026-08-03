import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCollectionList } from "./merch-collection-list";
import { MerchCollectionListDemo } from "./merch-collection-list.demo";

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

const LOL_PRODUCTS: MerchProduct[] = [
  {
    slug: "league-classic-collectors-box",
    title: "League of Legends Classic Collector's Box",
    imageUrl: championSplashUrl("Ahri", 0),
    price: "$89.99",
    badge: "New",
  },
  {
    slug: "rocklove-lol-heart-of-gold-ring",
    title: "RockLove LoL Heart of Gold Ring",
    imageUrl: championSplashUrl("Lux", 0),
    price: "$199.99",
    badge: "New",
  },
  {
    slug: "twitch-7in-limited-edition-statue",
    title: 'Twitch 7" Limited Edition Statue',
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$84.99",
    badge: "New",
  },
  {
    slug: "amumu-plush",
    title: "Amumu Plush",
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$29.99",
    badge: "New",
  },
];

const RIFTBOUND_PRODUCTS: MerchProduct[] = [
  {
    slug: "riftbound-vendetta-zed-shen-showdown-deck",
    title: "Riftbound: LoL TCG Vendetta Zed vs Shen Showdown Deck",
    imageUrl: championSplashUrl("Zed", 0),
    price: "$34.99",
    badge: "Out of Stock",
  },
  {
    slug: "riftbound-vendetta-booster-display",
    title: "Riftbound: LoL TCG Vendetta Booster Display",
    imageUrl: championSplashUrl("Shen", 0),
    price: "$119.99",
    badge: "Out of Stock",
  },
];

/**
 * Banner placeholder: real banners are Sanity-fingerprinted CDN URLs not
 * reproducible without the exact asset id. Using champion splashes as
 * representative stand-ins (same approach as existing hero/tile fixtures).
 */
const LOL_BANNER_URL = championSplashUrl("Ahri", 0);
const RIFTBOUND_BANNER_URL = championSplashUrl("Zed", 0);

// ---------------------------------------------------------------------------
// Showcase entry
// ---------------------------------------------------------------------------

export const merchCollectionListShowcase: ShowcaseEntry = {
  slug: "merch-collection-list",
  name: "Merch Collection List",
  area: "merch",
  description:
    "Vertically stacked collection strips for the /merch/collection index. Each strip: 4:1-aspect-ratio banner image + rotated vertical collection-name tab (60×185px, 16px/700/uppercase, dark bg) at left ~91px + horizontal scroll row of 253px MerchProductCard tiles. Mirrors merch.riotgames.com/en-us/collection/. ASSET NOTE: banners use champion-splash stand-ins (Sanity-fingerprinted URLs unavailable without exact asset ids).",
  variants: [
    {
      name: "Default — two collections",
      notes:
        "Two stacked strips: League of Legends (4 products) and Riftbound (2 products). Rotated name tabs, banner images, and card rows. View All link is shown when href is supplied.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollectionList
            collections={[
              {
                slug: "league-of-legends",
                name: "League of Legends",
                bannerImageUrl: LOL_BANNER_URL,
                products: LOL_PRODUCTS,
                href: "/merch/collection/league-of-legends",
              },
              {
                slug: "riftbound",
                name: "Riftbound",
                bannerImageUrl: RIFTBOUND_BANNER_URL,
                products: RIFTBOUND_PRODUCTS,
                href: "/merch/collection/riftbound",
              },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Single collection, no view-all",
      notes:
        "Edge case: one collection, no href or onViewAllClick supplied — omits the View All card entirely.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollectionList
            collections={[
              {
                slug: "league-of-legends",
                name: "League of Legends",
                bannerImageUrl: LOL_BANNER_URL,
                products: LOL_PRODUCTS,
              },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Long collection name",
      notes:
        "Tests name tab layout with a long collection label like 'Spirit Blossom'. The tab rotates -90° so text runs bottom-to-top.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollectionList
            collections={[
              {
                slug: "spirit-blossom",
                name: "Spirit Blossom",
                bannerImageUrl: LOL_BANNER_URL,
                products: LOL_PRODUCTS.slice(0, 3),
                href: "/merch/collection/spirit-blossom",
              },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes:
        "Client-side demo with onProductClick and onViewAllClick callbacks that show an alert.",
      backgrounds: ["light"],
      render: () => <MerchCollectionListDemo />,
    },
  ],
};
