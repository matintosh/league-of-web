"use client";

/**
 * MerchPageClient — client shell for the /merch homepage.
 * Extracted so the server page.tsx can delegate all callback-bearing props here.
 * Receives pre-built product cards and hero slides as children/props.
 */

import { useState } from "react";
import {
  MerchHeader,
  MerchProductCard,
  MerchFooter,
  MerchGiftCardBand,
  MerchHeroBanner,
  MerchProductGrid,
  MerchCategoryStrip,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchContactFormValues, MerchGiftCard, MerchFranchiseChip } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct, MerchCartItem } from "@low/fixtures";
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
  {
    slug: "ahri-spirit-blossom-preorder",
    title: "Ahri Spirit Blossom Statue — Limited Preorder",
    imageUrl: championSplashUrl("Ahri", 1),
    price: "$89.99",
    badge: "Preorder",
  },
  {
    slug: "arcane-caitlyn-restock",
    title: "Arcane Caitlyn Collector's Resin Figure",
    imageUrl: championSplashUrl("Caitlyn", 0),
    price: "$49.99",
    badge: "Restock",
  },
  {
    slug: "league-classic-cap",
    title: "League of Legends Classic Logo Cap",
    imageUrl: championSplashUrl("Lux", 2),
    price: "$27.99",
  },
  {
    slug: "riftbound-deluxe-set",
    title: "Riftbound Origins Deluxe Champion Set",
    imageUrl: championSplashUrl("Jinx", 3),
    price: "$74.99",
    badge: "Limited",
  },
];

const HERO_SLIDES: MerchHeroSlide[] = [
  {
    id: "slide-jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    imageAlt: "Riftbound Origins Champion Deck — Jinx",
    ctaLabel: "Shop All",
    ctaVariant: "light",
    ctaCorner: "bottom-right",
    align: "left",
  },
  {
    id: "slide-lux",
    imageUrl: championSplashUrl("Lux", 0),
    imageAlt: "PROJECT Lux — Collector's Art Print",
    ctaLabel: "Shop All",
    ctaVariant: "light",
    ctaCorner: "bottom-right",
    align: "left",
  },
  {
    id: "slide-vi",
    imageUrl: championSplashUrl("Vi", 0),
    imageAlt: "Arcane Vi Graphic Hoodie",
    ctaLabel: "Shop Now",
    ctaVariant: "red",
    ctaCorner: "bottom-right",
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

const FRANCHISE_CATEGORIES: MerchFranchiseChip[] = [
  { slug: "league-of-legends", label: "League of Legends", colorVar: "--color-merch-cat-lol", textColorVar: "--color-merch-on-dark" },
  { slug: "riftbound", label: "Riftbound", colorVar: "--color-merch-cat-riftbound", textColorVar: "--color-merch-on-dark", subLabel: "League of Legends" },
  { slug: "lol-esports", label: "LoL Esports", colorVar: "--color-merch-cat-esports", textColorVar: "--color-merch-ink" },
  { slug: "tft", label: "Teamfight Tactics", colorVar: "--color-merch-cat-tft", textColorVar: "--color-merch-on-dark" },
  { slug: "vct", label: "VCT", colorVar: "--color-merch-cat-vct", textColorVar: "--color-merch-on-dark" },
  { slug: "valorant", label: "Valorant", colorVar: "--color-merch-cat-valorant", textColorVar: "--color-merch-on-dark" },
  { slug: "2xko", label: "2XKO", colorVar: "--color-merch-cat-2xko", textColorVar: "--color-merch-ink" },
];

const ANNOUNCEMENT =
  "We're upgrading our warehouse! Orders placed between July 3–7 may be delayed. We apologize for the inconvenience.";

/** /merch interactive page shell — client component hosting all callbacks. */
export function MerchPageClient() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<string | undefined>(ANNOUNCEMENT);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);

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
      <MerchHeader
        activeCategory="shop-all"
        cartCount={cartItems.length}
        announcement={announcement}
        onDismissAnnouncement={() => setAnnouncement(undefined)}
        onCategoryClick={(slug) => {
          if (slug === "shop-all") router.push("/merch/shop-all");
        }}
        onSearchClick={() => router.push("/merch/search")}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero banner */}
        <MerchHeroBanner slides={HERO_SLIDES} autoPlayMs={5000} />

        {/* Franchise category chip strip */}
        <MerchCategoryStrip
          categories={FRANCHISE_CATEGORIES}
          onSelectFranchise={(slug) => router.push(`/merch/collection/${slug}`)}
        />

        {/* Product grid — brand-rail collection layout matching merch.riotgames.com */}
        <MerchProductGrid
          brandRail="League of Legends"
          filterBadges={[
            { label: "New" },
            { label: "Limited Edition" },
            { label: "Preorder" },
          ]}
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
              onClick={() => router.push(`/merch/product/${product.slug}`)}
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

      <MerchCartDrawer
        open={cartOpen}
        items={cartItems}
        subtotal="$0.00"
        onClose={() => setCartOpen(false)}
        onContinueShopping={() => setCartOpen(false)}
        onCheckout={() => router.push("/merch/cart")}
      />
    </div>
  );
}
