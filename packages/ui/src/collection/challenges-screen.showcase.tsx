import type { ShowcaseEntry } from "../showcase";
import {
  ChallengesScreenAllDemo,
  ChallengesScreenFilteredDemo,
  ChallengesScreenStaticCrystalDemo,
} from "./challenges-screen.demo";

export const challengesScreenShowcase: ShowcaseEntry = {
  slug: "challenges-screen",
  name: "Challenges Screen",
  area: "collection",
  description:
    "Profile → CHALLENGES tab (era: 2022+). Left sidebar with hexagonal crystal, total score, tier label, and 6 category filter buttons. Right: 5-column ChallengeCard grid with hover tooltips showing progress bar, tier, player %, and next reward. The sidebar crystal accepts an optional real-client crystal-level celebration webm (issue #319) that layers over the static crystal.",
  variants: [
    {
      name: "All challenges — SILVER tier (animated crystal)",
      notes:
        "Default state: all 10 sample challenges visible in a 5-column grid. Sidebar shows 4,725 SILVER with the real-client crystal-level celebration webm layered over the static crystal (crystalVideoSrc). The gem loops with straight alpha; pointer-events-none and hidden under prefers-reduced-motion (static crystal remains).",
      render: () => <ChallengesScreenAllDemo />,
    },
    {
      name: "BRONZE tier — static crystal (no video)",
      notes:
        "crystalVideoSrc omitted: the sidebar shows the pure static CrystalIcon glyph, unchanged — the additive/no-regression fallback (also the reduced-motion and video-error look). Sidebar shows 2,350 BRONZE.",
      render: () => <ChallengesScreenStaticCrystalDemo />,
    },
    {
      name: "Filtered — TEAMWORK & STRATEGY",
      notes:
        "Category filter active on 'teamwork-strategy'. Only 2 cards visible. Empty category path: select a category with no data to see the empty state message.",
      render: () => <ChallengesScreenFilteredDemo />,
    },
  ],
};
