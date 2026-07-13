import type { ShowcaseEntry } from "../showcase";
import { StatsTabDefaultDemo, StatsTabWithDataDemo } from "./stats-tab.demo";

export const statsTabShowcase: ShowcaseEntry = {
  slug: "stats-tab",
  name: "Stats Tab",
  area: "collection",
  description:
    "Profile → STATS sub-tab. Left sidebar with a pentagon radar chart (Play Style), season label, aggregate stats row (Games Played / Time Played / KDA Ratio), and filter controls. Right column shows an empty state Poro mascot when no games have been played.",
  variants: [
    {
      name: "Empty state — no games played",
      notes:
        "All season stats are null (render as dashes). Radar chart shows equal minimal values at all 5 axes. Poro mascot visible in right column with both copy lines.",
      render: () => <StatsTabDefaultDemo />,
    },
    {
      name: "With data — asymmetric radar",
      notes:
        "Non-null stats populated. Radar polygon fills asymmetrically per role values, showing a skewed pentagon. Right column still shows Poro empty state (non-empty champion rows are out of scope for this issue).",
      render: () => <StatsTabWithDataDemo />,
    },
  ],
};
