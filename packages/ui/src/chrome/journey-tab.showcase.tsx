import type { ShowcaseEntry } from "../showcase";
import {
  JourneyTabOverviewDemo,
  LevelUpRewardsDetailDemo,
  JourneyTabZeroProgressDemo,
  JourneyTabCompletedDemo,
  JourneyTabMultiPageCarouselDemo,
} from "./journey-tab.demo";

export const journeyTabShowcase: ShowcaseEntry = {
  slug: "journey-tab",
  name: "JourneyTab",
  area: "chrome",
  description:
    "Home → JOURNEY sub-tab. Two-column NPE layout: Champion Starter Pack card (L1), Awakening Missions chain (L2), Level Up Rewards + Daily Play Rewards progress panels (R1+R2). VIEW REWARDS navigates to LevelUpRewardsDetail — a 5×2 level reward grid with a right-side detail panel. Era: 2021 NPE redesign (V11.8).",
  variants: [
    {
      name: "Overview — journey tab default (9/10 levels, 1/7 days)",
      notes: "Matches docs/reference/client-home-journey-npe.jpg",
      render: () => <JourneyTabOverviewDemo />,
    },
    {
      name: "Level Up Rewards detail — level 1 selected (Journey Begins)",
      notes: "Matches docs/reference/client-home-journey-level-rewards.jpg",
      render: () => <LevelUpRewardsDetailDemo />,
    },
    {
      name: "Overview — zero progress (0/8 missions, 1/10 levels, 0/7 days)",
      notes: "Progress bars at minimum; starter pack fully available",
      render: () => <JourneyTabZeroProgressDemo />,
    },
    {
      name: "Overview — all complete (8/8 missions, 10/10 levels, 7/7 days)",
      notes: "All progress bars filled",
      render: () => <JourneyTabCompletedDemo />,
    },
    {
      name: "Starter Pack carousel — 6 champions, 2 pages (prev/next + dots)",
      notes:
        "DEMO_STARTER_PACK_MULTI_PAGE: 6 champions, pageSize=3. Clicking the right chevron advances to page 2 (Garen, Annie, Jinx); the active dot updates. Left chevron is disabled on page 1; right chevron is disabled on page 2. Bonus icons (BE + mastery) are always visible and not paginated.",
      render: () => <JourneyTabMultiPageCarouselDemo />,
    },
  ],
};
