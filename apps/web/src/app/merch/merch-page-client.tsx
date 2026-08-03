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
import { championSplashUrl, MERCH_PRODUCTS, merchAssetUrl } from "@low/fixtures";
import type { MerchCartItem } from "@low/fixtures";
import type { MerchHeroSlide } from "@low/ui";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";

// Real 8 products from merch.riotgames.com — sourced from MERCH_PRODUCTS fixture.
const PRODUCTS = MERCH_PRODUCTS;

// Real hero banners — full-art campaign banners sourced from cdn.sanity.io (hotlinkable).
// Slide A: League of Legends Classic campaign (consumer_products_live, 3296x1030) — vivid
//   warm beige tones, LoL Classic logo, merch + product art, reads well full-bleed.
// Slide B: Riftbound Vendetta Akali (consumer_products_live, 3296x1030) — vivid
//   crimson background, character art centered, wide landscape ~3.2:1 ratio.
// DROPPED: d9528f9cc6c88034bb963709002e0dfde2520fb7-1680x589 (consumer_products) — purple
//   duotone text-backdrop; reads as flat purple wash when shown bare without overlaid text.
const HERO_SLIDES: MerchHeroSlide[] = [
  {
    id: "slide-classic",
    imageUrl: merchAssetUrl("3dbbf5ce0d30940b0db3741cdb9d1bed12afce48-3296x1030.png", {
      w: 1920,
      dataset: "consumer_products_live",
    }),
    imageAlt: "League of Legends Classic — Shop the Collection",
    ctaLabel: "Shop All",
    ctaVariant: "light",
    ctaCorner: "bottom-right",
    align: "left",
  },
  {
    id: "slide-vendetta",
    imageUrl: merchAssetUrl("a01262bae9dcf03621b7f850c89b86535b76638a-3296x1030.jpg", {
      w: 1920,
      dataset: "consumer_products_live",
    }),
    imageAlt: "Riftbound Vendetta — New TCG Products",
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
  const handleNavSelect = useMerchNav();
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
        onCategoryClick={handleNavSelect}
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

        {/* Product grid — real 2-col flush listing matching merch.riotgames.com */}
        <MerchProductGrid
          columns={2}
          resultCount={PRODUCTS.length}
          onRefineClick={() => {}}
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
              badges={product.badges}
              franchiseLabel={product.franchiseLabel}
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
