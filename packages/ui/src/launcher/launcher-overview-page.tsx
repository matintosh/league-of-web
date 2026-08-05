/**
 * LauncherOverviewPage — Overview tab content for the /launcher section.
 *
 * Composes LauncherOverviewHero + LauncherFeaturedCard + LauncherContentCarousel
 * into the full Overview tab layout. Fixture data is hardcoded here (types from
 * @low/fixtures, values supplied inline), matching the issue #694 spec and
 * lol-launcher-ref screenshots.
 *
 * This component is NOT a page route — it is the content rendered when the
 * "overview" tab is active inside the launcher client shell.
 *
 * Server-safe: no 'use client'. Stateful demos (carousel active index) belong
 * in launcher-overview-page.demo.tsx.
 */

import { championSplashUrl } from "@low/fixtures";

import { LauncherOverviewHero } from "./launcher-overview-hero";
import { LauncherFeaturedCard } from "./launcher-featured-card";
import { LauncherContentCarousel } from "./launcher-content-carousel";
import type { LauncherContentItem } from "./launcher-content-carousel";

// ---------------------------------------------------------------------------
// Fixture data — all values hardcoded, types from @low/fixtures
// ---------------------------------------------------------------------------

/** Hero splash — Warwick skin 1 for a vivid, dynamic composition. */
const HERO_SPLASH_URL = championSplashUrl("Warwick", 1);

/** Featured card content — League Classic Cinematic announcement. */
const FEATURED_ITEM = {
  categoryLabel: "League Classic Cinematic",
  title: "Welcome Back, Summoners",
  description:
    "Time to grab your friends and relive a golden era with League of Legends Classic. Now live.",
  ctaLabel: "Watch Now",
} as const;

/** Carousel items — 5 champion splash thumbnails with titles. */
const CAROUSEL_ITEMS: LauncherContentItem[] = [
  {
    id: "carousel-lissandra",
    thumbnailUrl: championSplashUrl("Lissandra", 0),
    title: "Lissandra — New Lore Spotlight",
  },
  {
    id: "carousel-jinx",
    thumbnailUrl: championSplashUrl("Jinx", 0),
    title: "Jinx — Arcane Celebration",
  },
  {
    id: "carousel-ahri",
    thumbnailUrl: championSplashUrl("Ahri", 0),
    title: "Ahri — K/DA Returns",
  },
  {
    id: "carousel-yasuo",
    thumbnailUrl: championSplashUrl("Yasuo", 0),
    title: "Yasuo — Way of the Wanderer",
  },
  {
    id: "carousel-thresh",
    thumbnailUrl: championSplashUrl("Thresh", 0),
    title: "Thresh — Chain of Corruption",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface LauncherOverviewPageProps {
  /** Currently active carousel index. Default 0. */
  carouselActiveIndex?: number;
  /** Called when a carousel thumbnail is selected. */
  onCarouselSelect?: (index: number) => void;
  /** Called when the featured card CTA is clicked. */
  onCta?: () => void;
}

/**
 * Overview tab content — hero + featured card + content carousel.
 *
 * Renders inside the center content area of LauncherShell, below LauncherTabBar
 * and above the bottom edge. Fills remaining height (flex-1 in parent).
 */
export function LauncherOverviewPage({
  carouselActiveIndex = 0,
  onCarouselSelect,
  onCta,
}: LauncherOverviewPageProps) {
  return (
    <LauncherOverviewHero
      splashUrl={HERO_SPLASH_URL}
      featuredCard={
        <LauncherFeaturedCard
          categoryLabel={FEATURED_ITEM.categoryLabel}
          title={FEATURED_ITEM.title}
          description={FEATURED_ITEM.description}
          ctaLabel={FEATURED_ITEM.ctaLabel}
          onCta={onCta}
        />
      }
      carousel={
        <LauncherContentCarousel
          items={CAROUSEL_ITEMS}
          activeIndex={carouselActiveIndex}
          onSelect={onCarouselSelect}
        />
      }
    />
  );
}
