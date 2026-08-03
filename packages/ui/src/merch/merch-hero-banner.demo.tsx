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
    ctaLabel: "Shop All",
    ctaVariant: "light" as const,
    ctaCorner: "bottom-right" as const,
    onCtaClick: () => {},
    align: "left" as const,
  },
  {
    id: "slide-lux",
    imageUrl: championSplashUrl("Lux", 0),
    imageAlt: "Lux splash art",
    ctaLabel: "Shop All",
    ctaVariant: "light" as const,
    ctaCorner: "bottom-right" as const,
    onCtaClick: () => {},
    align: "left" as const,
  },
  {
    id: "slide-ahri",
    imageUrl: championSplashUrl("Ahri", 0),
    imageAlt: "Ahri splash art",
    ctaLabel: "Shop Now",
    ctaVariant: "red" as const,
    ctaCorner: "bottom-right" as const,
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
