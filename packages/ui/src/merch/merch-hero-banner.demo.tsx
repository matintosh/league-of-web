"use client";

/**
 * MerchHeroBannerDemo — client-side interactive showcase demo for MerchHeroBanner.
 * Separated so the .showcase.tsx file itself stays server-safe.
 */

import { championSplashUrl } from "@low/fixtures";
import { MerchHeroBanner } from "./merch-hero-banner";

const SLIDES = [
  {
    id: "slide-jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    imageAlt: "Jinx splash art",
    eyebrow: "New Arrivals",
    headline: "Riftbound Origins",
    body: "Collect the champions. Build your deck. Dominate the Rift.",
    ctaLabel: "Shop Now",
    onCtaClick: () => {},
    align: "left" as const,
  },
  {
    id: "slide-lux",
    imageUrl: championSplashUrl("Lux", 0),
    imageAlt: "Lux splash art",
    eyebrow: "Limited Edition",
    headline: "PROJECT Collection",
    body: "Exclusive apparel and collectibles for the Rift's elite.",
    ctaLabel: "Explore",
    onCtaClick: () => {},
    align: "center" as const,
  },
  {
    id: "slide-ahri",
    imageUrl: championSplashUrl("Ahri", 0),
    imageAlt: "Ahri splash art",
    eyebrow: "Sale",
    headline: "Up to 40% Off",
    body: "Limited-time markdowns on selected fan favorites.",
    ctaLabel: "View Deals",
    onCtaClick: () => {},
    align: "left" as const,
  },
];

export function MerchHeroBannerDemo() {
  return <MerchHeroBanner slides={SLIDES} autoPlayMs={4000} />;
}

export function MerchHeroBannerSingleDemo() {
  return (
    <MerchHeroBanner
      slides={[SLIDES[0]!]}
      autoPlayMs={0}
    />
  );
}
