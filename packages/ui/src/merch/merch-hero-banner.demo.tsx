"use client";

/**
 * MerchHeroBannerDemo — client-side interactive showcase demos for MerchHeroBanner.
 * Separated so the .showcase.tsx file itself stays server-safe.
 */

import { championSplashUrl } from "@low/fixtures";
import { MerchHeroBanner } from "./merch-hero-banner";
import type { MerchHeroFranchise } from "./merch-hero-banner";
import {
  LolWordmark,
  RiftboundLogo,
  LolEsportsLogo,
  TftLogo,
  VctLogo,
  ValorantLogo,
  TwoXkoLogo,
  ArcaneLogo,
} from "./franchise-logos";

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

/**
 * Franchise tiles matching the real merch.riotgames.com control bar.
 * Background colors sampled via Playwright at 1280px.
 * slideId wires the first two tiles to the demo's slides; the rest route out.
 */
const DEMO_FRANCHISES: MerchHeroFranchise[] = [
  {
    slug: "league-of-legends",
    label: "League of Legends",
    logo: <LolWordmark />,
    colorVar: "--color-merch-cat-lol",
    textColorVar: "--color-merch-on-dark",
    slideId: "slide-jinx",
  },
  {
    slug: "riftbound",
    label: "Riftbound",
    logo: <RiftboundLogo />,
    colorVar: "--color-merch-cat-riftbound",
    textColorVar: "--color-merch-on-dark",
    slideId: "slide-lux",
  },
  {
    slug: "lol-esports",
    label: "LoL Esports",
    logo: <LolEsportsLogo />,
    colorVar: "--color-merch-cat-esports",
    textColorVar: "--color-merch-ink",
    // No slideId — routes to collection
  },
  {
    slug: "tft",
    label: "Teamfight Tactics",
    logo: <TftLogo />,
    colorVar: "--color-merch-cat-tft",
    textColorVar: "--color-merch-on-dark",
    slideId: "slide-ahri",
  },
  {
    slug: "vct",
    label: "VCT",
    logo: <VctLogo />,
    colorVar: "--color-merch-cat-vct",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "valorant",
    label: "VALORANT",
    logo: <ValorantLogo />,
    colorVar: "--color-merch-cat-valorant",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "2xko",
    label: "2XKO",
    logo: <TwoXkoLogo />,
    colorVar: "--color-merch-cat-2xko",
    textColorVar: "--color-merch-ink",
  },
  {
    slug: "arcane",
    label: "Arcane",
    logo: <ArcaneLogo />,
    colorVar: "--color-merch-cat-arcane",
    textColorVar: "--color-merch-ink",
  },
];

/** Demo with the franchise control bar — 1:1 with real site. */
export function MerchHeroBannerWithFranchisesDemo() {
  return (
    <MerchHeroBanner
      slides={SLIDES}
      autoPlayMs={5000}
      franchises={DEMO_FRANCHISES}
      onSelectFranchise={(slug) => {
        // In showcase: no-op; in production this routes to /merch/collection/<slug>
        console.log("[MerchHeroBanner showcase] onSelectFranchise:", slug);
      }}
    />
  );
}

/** Legacy multi-slide carousel (no franchise bar). */
export function MerchHeroBannerDemo() {
  return <MerchHeroBanner slides={SLIDES} autoPlayMs={4000} />;
}

/** Legacy single-slide (no franchise bar). */
export function MerchHeroBannerSingleDemo() {
  return (
    <MerchHeroBanner
      slides={[SLIDES[0]!]}
      autoPlayMs={0}
    />
  );
}
