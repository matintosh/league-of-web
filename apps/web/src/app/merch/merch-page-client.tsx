"use client";

/**
 * MerchPageClient — client shell for the /merch homepage.
 * Extracted so the server page.tsx can delegate all callback-bearing props here.
 * Receives pre-built product cards and hero slides as children/props.
 */

import {
  MerchHeader,
  MerchProductCard,
  MerchFooter,
  MerchGiftCardBand,
  MerchHeroBanner,
  MerchProductGrid,
} from "@low/ui";
import type { MerchContactFormValues, MerchGiftCard } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import type { MerchHeroSlide } from "@low/ui";
import { useRouter } from "next/navigation";

const PRODUCTS: MerchProduct[] = [
  {
    slug: "riftbound-origins-champion-deck-jinx",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$24.99",
    badge: "New",
  },
  {
    slug: "arcane-vi-hoodie",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 0),
    price: "$39.99",
    originalPrice: "$59.99",
    badge: "Sale",
  },
  {
    slug: "project-lux-art-print",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 0),
    price: "$34.99",
  },
  {
    slug: "poro-plush-limited",
    title: "Poro Limited Edition Plush — Season 14",
    imageUrl: championSplashUrl("Jinx", 2),
    price: "$29.99",
    badge: "Out of Stock",
  },
  {
    slug: "arcane-jinx-enamel-pin",
    title: "Arcane Jinx & Vi Enamel Pin Set",
    imageUrl: championSplashUrl("Jinx", 1),
    price: "$14.99",
    badge: "New",
  },
  {
    slug: "riot-wordmark-tee",
    title: "Riot Games Wordmark Essential T-Shirt",
    imageUrl: championSplashUrl("Ahri", 0),
    price: "$24.99",
  },
  {
    slug: "valorant-agent-hoodie",
    title: "VALORANT Agent Collection Pullover Hoodie",
    imageUrl: championSplashUrl("Lux", 1),
    price: "$54.99",
    badge: "Limited",
  },
  {
    slug: "ruination-teemo-plush",
    title: 'Ruined Teemo 12" Collector Plush',
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$19.99",
  },
];

const HERO_SLIDES: MerchHeroSlide[] = [
  {
    id: "slide-jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    imageAlt: "Riftbound Origins Champion Deck — Jinx",
    eyebrow: "New Arrivals",
    headline: "Riftbound Origins",
    body: "Collect the champions. Build your deck. Dominate the Rift.",
    ctaLabel: "Shop Now",
    align: "left",
  },
  {
    id: "slide-lux",
    imageUrl: championSplashUrl("Lux", 0),
    imageAlt: "PROJECT Lux — Collector's Art Print",
    eyebrow: "Limited Edition",
    headline: "PROJECT Collection",
    body: "Exclusive apparel and collectibles for the Rift's elite.",
    ctaLabel: "Explore",
    align: "center",
  },
  {
    id: "slide-vi",
    imageUrl: championSplashUrl("Vi", 0),
    imageAlt: "Arcane Vi Graphic Hoodie",
    eyebrow: "Sale — Up to 40% Off",
    headline: "Arcane Collection",
    body: "Gear up with officially licensed merch from the hit animated series.",
    ctaLabel: "View Deals",
    align: "left",
  },
];

const GIFT_CARDS: [MerchGiftCard, MerchGiftCard] = [
  {
    imageUrl: championSplashUrl("Jinx", 0),
    label: "Riot merch gift card — OMEN 16 Edition",
  },
  {
    imageUrl: championSplashUrl("Vi", 0),
    label: "Riot merch gift card — VALORANT Edition",
  },
];

/** /merch interactive page shell — client component hosting all callbacks. */
export function MerchPageClient() {
  const router = useRouter();

  function handleContactSubmit(values: MerchContactFormValues) {
    // Presentational stub — a real implementation would POST to a support API.
    console.log("[MerchFooter] Contact form submitted:", values);
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* Header */}
      <MerchHeader activeCategory="shop-all" cartCount={0} />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero banner */}
        <MerchHeroBanner slides={HERO_SLIDES} autoPlayMs={5000} />

        {/* Product grid */}
        <MerchProductGrid
          heading="New Arrivals"
          onShopAll={() => router.push("/merch/shop-all")}
          shopAllLabel="Shop All"
        >
          {PRODUCTS.map((product) => (
            <MerchProductCard
              key={product.slug}
              slug={product.slug}
              title={product.title}
              imageUrl={product.imageUrl}
              price={product.price}
              originalPrice={product.originalPrice}
              badge={product.badge}
            />
          ))}
        </MerchProductGrid>
      </main>

      {/* Gift card promo band — above footer, ~447px */}
      <MerchGiftCardBand
        cards={GIFT_CARDS}
        onCtaClick={() => router.push("/merch/shop-all")}
      />

      {/* Footer */}
      <MerchFooter
        copyrightText="Copyright Riot Games 2025"
        onContactSubmit={handleContactSubmit}
      />
    </div>
  );
}
