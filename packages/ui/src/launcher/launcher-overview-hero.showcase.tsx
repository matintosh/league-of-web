/**
 * LauncherOverviewHero showcase — server-safe (no 'use client').
 * Stateful demos live in launcher-overview-hero.demo.tsx.
 */

import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LauncherOverviewHero } from "./launcher-overview-hero";
import { LauncherFeaturedCard } from "./launcher-featured-card";
import { LauncherPlayButton } from "./launcher-play-button";
import { LauncherContentCarousel } from "./launcher-content-carousel";
import type { LauncherContentItem } from "./launcher-content-carousel";

const DEMO_ITEMS: LauncherContentItem[] = [
  { id: "1", thumbnailUrl: championSplashUrl("Warwick", 0), title: "League Classic Cinematic" },
  { id: "2", thumbnailUrl: championSplashUrl("Jinx", 0), title: "Patch 14.1 Highlights" },
  { id: "3", thumbnailUrl: championSplashUrl("Ahri", 0), title: "New Champion Reveal" },
  { id: "4", thumbnailUrl: championSplashUrl("Yasuo", 0), title: "Esports Weekly Recap" },
  { id: "5", thumbnailUrl: championSplashUrl("Thresh", 0), title: "Dev Update: Season 2025" },
];

export const launcherOverviewHeroShowcase: ShowcaseEntry = {
  slug: "launcher-overview-hero",
  name: "LauncherOverviewHero",
  area: "launcher",
  referenceImage: "launcher-overview-hero-crop.png",
  referenceNote: "Real launcher — hero splash area (cropped from Overview): tab bar + full-bleed champion splash + LEAGUE OF LEGENDS wordmark + Play button + featured card",
  description:
    "Full-bleed champion splash background for the Overview tab. Renders splash image as object-cover, \"LEAGUE OF LEGENDS\" 2-row wordmark bottom-left, bottom scrim, and render slots for playButton + featuredCard + carousel. Issues #681, #720.",
  variants: [
    {
      name: "Hero — splash + wordmark only",
      notes:
        "Splash fills container, wordmark bottom-left, bottom scrim gradient visible. No featured card or carousel slotted.",
      render: () => (
        <div style={{ height: 480, position: "relative" }}>
          <LauncherOverviewHero splashUrl={championSplashUrl("Warwick", 0)} />
        </div>
      ),
    },
    {
      name: "Hero — with play button + featured card + carousel",
      notes:
        "Fully composed: playButton slotted between wordmark and featuredCard (matching image.png), carousel strip at bottom. Mirrors the launcher ref layout.",
      render: () => (
        <div style={{ height: 520, position: "relative" }}>
          <LauncherOverviewHero
            splashUrl={championSplashUrl("Warwick", 0)}
            playButton={
              <LauncherPlayButton
                gameModes={[
                  { id: "lol", label: "League of Legends" },
                  { id: "lol-pbe", label: "League of Legends", isPbe: true },
                ]}
                selectedModeId="lol"
                open={false}
              />
            }
            featuredCard={
              <LauncherFeaturedCard
                categoryLabel="League Classic Cinematic"
                title="Welcome Back, Summoners"
                description="Time to grab your friends and relive a golden era with League of Legends Classic. Now live."
                ctaLabel="Watch Now"
              />
            }
            carousel={
              <LauncherContentCarousel
                items={DEMO_ITEMS}
                activeIndex={0}
              />
            }
          />
        </div>
      ),
    },
    {
      name: "Hero — Jinx splash variant",
      notes: "Different champion splash to verify object-cover works for any splash art.",
      render: () => (
        <div style={{ height: 480, position: "relative" }}>
          <LauncherOverviewHero
            splashUrl={championSplashUrl("Jinx", 0)}
            featuredCard={
              <LauncherFeaturedCard
                categoryLabel="Champion News"
                title="Jinx: The Loose Cannon"
                description="Experience the chaos. Jinx brings mayhem to the rift — and the launcher."
                ctaLabel="Learn More"
              />
            }
          />
        </div>
      ),
    },
  ],
};
