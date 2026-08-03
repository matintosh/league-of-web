"use client";

import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { MerchCollectionList } from "./merch-collection-list";

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
];

const RIFTBOUND_PRODUCTS: MerchProduct[] = [
  {
    slug: "riftbound-vendetta-zed-shen-showdown-deck",
    title: "Riftbound: LoL TCG Vendetta Zed vs Shen Showdown Deck",
    imageUrl: championSplashUrl("Zed", 0),
    price: "$34.99",
    badge: "Out of Stock",
  },
];

/** Interactive demo — onProductClick and onViewAllClick fire alerts. */
export function MerchCollectionListDemo() {
  return (
    <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
      <MerchCollectionList
        collections={[
          {
            slug: "league-of-legends",
            name: "League of Legends",
            bannerImageUrl: championSplashUrl("Ahri", 0),
            products: LOL_PRODUCTS,
          },
          {
            slug: "riftbound",
            name: "Riftbound",
            bannerImageUrl: championSplashUrl("Zed", 0),
            products: RIFTBOUND_PRODUCTS,
          },
        ]}
        onProductClick={(slug) => alert(`Product clicked: ${slug}`)}
        onViewAllClick={(collectionSlug) => alert(`View All clicked: ${collectionSlug}`)}
      />
    </div>
  );
}
