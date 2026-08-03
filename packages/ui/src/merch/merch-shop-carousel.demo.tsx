"use client";

/**
 * MerchShopCarouselDemo — stateful client wrapper for the showcase.
 * Wires onProductClick to an alert so interactive behaviour is testable
 * without leaving the /showcase page.
 */

import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { MerchShopCarousel } from "./merch-shop-carousel";

const DEMO_PRODUCTS: MerchProduct[] = [
  { slug: "arcane-vi-hoodie",        title: "Arcane Vi Graphic Hoodie",               imageUrl: championSplashUrl("Vi", 0),      price: "$39.99", originalPrice: "$59.99", badge: "Sale" },
  { slug: "jinx-chaos-tee",          title: "Jinx Chaos Agent Graphic Tee",           imageUrl: championSplashUrl("Jinx", 0),    price: "$24.99", badge: "New" },
  { slug: "lol-classic-cap",         title: "League of Legends Classic Logo Cap",     imageUrl: championSplashUrl("Lux", 0),     price: "$27.99" },
  { slug: "project-lux-art-print",   title: "PROJECT: Lux Collector's Art Print",     imageUrl: championSplashUrl("Lux", 0),     price: "$34.99", badge: "Limited" },
  { slug: "poro-plush-s14",          title: "Poro Limited Edition Plush — Season 14", imageUrl: championSplashUrl("Lux", 0),     price: "$29.99", badge: "Preorder" },
  { slug: "arcane-caitlyn-figure",   title: "Arcane Caitlyn Collector's Resin Figure",imageUrl: championSplashUrl("Caitlyn", 0), price: "$49.99", badge: "Restock" },
  { slug: "lol-classic-collectors",  title: "League Classic Collector's Box",         imageUrl: championSplashUrl("Jinx", 0),    price: "$89.99" },
];

export function MerchShopCarouselDemo() {
  return (
    <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
      <MerchShopCarousel
        franchiseName="League of Legends"
        bannerImageUrl={championSplashUrl("Vi", 0)}
        franchiseLogoUrl={championSplashUrl("Lux", 0)}
        products={DEMO_PRODUCTS}
        onProductClick={(slug) => alert(`Clicked: ${slug}`)}
        onShopNowClick={() => alert("Shop Now clicked")}
      />
    </div>
  );
}
