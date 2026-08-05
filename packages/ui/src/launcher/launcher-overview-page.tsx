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

import type { ReactNode } from "react";
import { championSplashUrl } from "@low/fixtures";

import { LauncherOverviewHero } from "./launcher-overview-hero";
import { LauncherFeaturedCard } from "./launcher-featured-card";
import { LauncherContentCarousel } from "./launcher-content-carousel";
import type { LauncherContentItem } from "./launcher-content-carousel";
import { LauncherPlayButton } from "./launcher-play-button";
import type { LauncherGameMode } from "./launcher-play-button";

// ---------------------------------------------------------------------------
// Fixture data — all values hardcoded, types from @low/fixtures
// ---------------------------------------------------------------------------

/** Hero splash — Warwick skin 1 for a vivid, dynamic composition. */
const HERO_SPLASH_URL = championSplashUrl("Warwick", 1);

/** Default game modes for the play button — LoL + PBE. */
const DEFAULT_GAME_MODES: LauncherGameMode[] = [
  { id: "lol", label: "League of Legends" },
  { id: "lol-pbe", label: "League of Legends", isPbe: true },
];

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
  /**
   * Optional play button node to render in the hero's play-button slot.
   * Defaults to a <LauncherPlayButton> with LoL + PBE game modes.
   * Pass null to suppress the play button entirely. Controlled open/close
   * state belongs in a demo client wrapper (see launcher-overview-page.demo.tsx).
   */
  playButton?: ReactNode;
  /** Game modes for the default LauncherPlayButton. Ignored if playButton is supplied. */
  gameModes?: LauncherGameMode[];
  /** Whether the default play button dropdown is open. */
  playButtonOpen?: boolean;
  /** Currently selected game mode id for the default play button. */
  selectedModeId?: string;
  /** Called when the main Play segment is clicked. */
  onPlay?: () => void;
  /** Called to toggle the play button dropdown. */
  onToggleDropdown?: () => void;
  /** Called when a game mode is selected from the play button dropdown. */
  onSelectMode?: (id: string) => void;
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
  playButton,
  gameModes = DEFAULT_GAME_MODES,
  playButtonOpen = false,
  selectedModeId = "lol",
  onPlay,
  onToggleDropdown,
  onSelectMode,
}: LauncherOverviewPageProps) {
  // Resolve the play button node:
  //   - If `playButton` is explicitly provided (including null), use it.
  //   - Otherwise, render the default LauncherPlayButton with LoL/PBE modes.
  const resolvedPlayButton =
    playButton !== undefined ? (
      playButton
    ) : (
      <LauncherPlayButton
        gameModes={gameModes}
        selectedModeId={selectedModeId}
        open={playButtonOpen}
        onPlay={onPlay}
        onToggleDropdown={onToggleDropdown}
        onSelectMode={onSelectMode}
      />
    );

  return (
    <LauncherOverviewHero
      splashUrl={HERO_SPLASH_URL}
      playButton={resolvedPlayButton}
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
