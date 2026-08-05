/**
 * LauncherContentCarousel showcase — server-safe (no 'use client').
 * Interactive demo lives in launcher-content-carousel.demo.tsx.
 */

import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LauncherContentCarousel } from "./launcher-content-carousel";
import type { LauncherContentItem } from "./launcher-content-carousel";
import { LauncherContentCarouselDemo } from "./launcher-content-carousel.demo";

const DEMO_ITEMS: LauncherContentItem[] = [
  { id: "1", thumbnailUrl: championSplashUrl("Warwick", 0), title: "League Classic Cinematic" },
  { id: "2", thumbnailUrl: championSplashUrl("Jinx", 0), title: "Patch 14.24 Highlights" },
  { id: "3", thumbnailUrl: championSplashUrl("Ahri", 0), title: "New Champion Reveal" },
  { id: "4", thumbnailUrl: championSplashUrl("Yasuo", 0), title: "Esports Weekly Recap" },
  { id: "5", thumbnailUrl: championSplashUrl("Thresh", 0), title: "Dev Update: Season 2025" },
];

export const launcherContentCarouselShowcase: ShowcaseEntry = {
  slug: "launcher-content-carousel",
  name: "LauncherContentCarousel",
  area: "launcher",
  description:
    "Horizontal thumbnail strip at the bottom of the Overview tab. 4–5 thumbnail cards (160px wide, 16/9 image + title below), active item highlighted with gold border (--color-launcher-thumb-active). Controlled active index; interactive demo below. Issue #685.",
  variants: [
    {
      name: "Static — activeIndex=0",
      notes: "First item active (gold border). Static controlled prop, no interaction.",
      render: () => (
        <LauncherContentCarousel
          items={DEMO_ITEMS}
          activeIndex={0}
        />
      ),
    },
    {
      name: "Static — activeIndex=2",
      notes: "Third item active to verify non-zero active index renders correctly.",
      render: () => (
        <LauncherContentCarousel
          items={DEMO_ITEMS}
          activeIndex={2}
        />
      ),
    },
    {
      name: "Interactive — click thumbnails to select",
      notes: "Stateful demo (client component). Click any thumbnail to change active selection.",
      render: () => <LauncherContentCarouselDemo />,
    },
  ],
};
