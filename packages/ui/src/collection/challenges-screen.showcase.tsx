import type { ShowcaseEntry } from "../showcase";
import { ChallengesScreenAllDemo, ChallengesScreenFilteredDemo } from "./challenges-screen.demo";

export const challengesScreenShowcase: ShowcaseEntry = {
  slug: "challenges-screen",
  name: "Challenges Screen",
  area: "collection",
  description:
    "Profile → CHALLENGES tab (era: 2022+). Left sidebar with hexagonal crystal, total score, tier label, and 6 category filter buttons. Right: 5-column ChallengeCard grid with hover tooltips showing progress bar, tier, player %, and next reward.",
  variants: [
    {
      name: "All challenges — SILVER tier",
      notes:
        "Default state: all 10 sample challenges visible in a 5-column grid. Sidebar shows 4,725 SILVER. Hover any card to see the floating tooltip with progress bar and next-level reward.",
      render: () => <ChallengesScreenAllDemo />,
    },
    {
      name: "Filtered — TEAMWORK & STRATEGY",
      notes:
        "Category filter active on 'teamwork-strategy'. Only 2 cards visible. Empty category path: select a category with no data to see the empty state message.",
      render: () => <ChallengesScreenFilteredDemo />,
    },
  ],
};
