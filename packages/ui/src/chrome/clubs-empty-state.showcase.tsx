import type { ShowcaseEntry } from "../showcase";
import { ClubsEmptyStateDefaultDemo } from "./clubs-empty-state.demo";

export const clubsEmptyStateShowcase: ShowcaseEntry = {
  slug: "clubs-empty-state",
  name: "Clubs Empty State",
  area: "chrome",
  description:
    "Full-width promotional empty-state for the Profile → Clubs tab. Shown when the viewer has not joined any clubs. Includes a three-column feature strip with Hextech diamond glyphs and a CREATE CLUB CTA.",
  variants: [
    {
      name: "Default — no clubs joined",
      notes:
        "The only state per spec. Background: bg-blue-7 with teal corner filigree. Header zone, three-column feature strip, hr divider, and centred CREATE CLUB button.",
      render: () => <ClubsEmptyStateDefaultDemo />,
    },
  ],
};
