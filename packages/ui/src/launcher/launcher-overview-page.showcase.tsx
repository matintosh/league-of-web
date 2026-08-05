/**
 * Showcase entry for LauncherOverviewPage.
 *
 * Server-safe — no 'use client'. Renders the overview composition at a fixed
 * 1080×660 container matching the center content area at a ~1536px viewport.
 * Stateful behaviour (carousel selection, play button dropdown) lives in
 * launcher-overview-page.demo.tsx (client component).
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherOverviewPage } from "./launcher-overview-page";
import { LauncherOverviewPageDemo } from "./launcher-overview-page.demo";

export const launcherOverviewPageShowcase: ShowcaseEntry = {
  slug: "launcher-overview-page",
  name: "LauncherOverviewPage",
  area: "launcher",
  referenceImage: "launcher-overview.png",
  referenceNote: "Real League launcher — Overview tab (hero splash + featured card + play button + carousel)",
  description:
    "Overview tab content: hero splash (Warwick) + Featured Card (League Classic Cinematic) + gold Play button (▶ Play ▾) + Content Carousel. Composed from LauncherOverviewHero + LauncherFeaturedCard + LauncherPlayButton + LauncherContentCarousel. Issues #694, #720.",
  variants: [
    {
      name: "Overview composition — interactive (1080×660)",
      notes:
        "Full interactive overview with play button. Carousel thumbnail, carousel index, and play button dropdown are all wired. Click ▶ Play or the caret ▾ to test the game-mode picker. Requires client JS.",
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
          <LauncherOverviewPageDemo />
        </div>
      ),
    },
    {
      name: "Overview composition — static (1080×660)",
      notes:
        "Static render: carousel index 0, play button closed, mode lol. Verifies server-side render without client state.",
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
    {
      name: "Play button dropdown — open",
      notes:
        "Static snapshot with the play button dropdown open, showing LoL + PBE game modes. No click interaction needed.",
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
          <LauncherOverviewPage
            playButtonOpen={true}
            selectedModeId="lol"
          />
        </div>
      ),
    },
  ],
};
