/**
 * Showcase entry for LauncherOverviewPage.
 *
 * Server-safe — no 'use client'. Renders the overview composition at a fixed
 * 1080×660 container matching the center content area at a ~1536px viewport.
 * Stateful behaviour (carousel selection) belongs in launcher-overview-page.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherOverviewPage } from "./launcher-overview-page";

export const launcherOverviewPageShowcase: ShowcaseEntry = {
  slug: "launcher-overview-page",
  name: "LauncherOverviewPage",
  area: "launcher",
  referenceImage: "launcher-overview.png",
  referenceNote: "Real League launcher — Overview tab (hero splash + featured card + carousel)",
  description:
    "Overview tab content: hero splash (Warwick) + Featured Card (League Classic Cinematic) + Content Carousel (5 champion thumbnails). Composed from LauncherOverviewHero + LauncherFeaturedCard + LauncherContentCarousel. Issue #694.",
  variants: [
    {
      name: "Overview composition (1080×660)",
      notes:
        "Full overview at approximate launcher content area dimensions. Warwick skin 1 splash, League Classic Cinematic featured card, carousel at index 0.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
            position: "relative",
          }}
        >
          <LauncherOverviewPage />
        </div>
      ),
    },
    {
      name: "Carousel — item 2 active",
      notes:
        "Same composition with carousel activeIndex=2 (Ahri) to verify gold border renders on a non-first item.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
            position: "relative",
          }}
        >
          <LauncherOverviewPage carouselActiveIndex={2} />
        </div>
      ),
    },
  ],
};
