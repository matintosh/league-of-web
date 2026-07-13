import type { ShowcaseEntry } from "../showcase";
import {
  ProfileRankedDefaultDemo,
  ProfileRankedInProgressDemo,
  ProfileRankedSplitCompleteDemo,
} from "./profile-ranked-screen.demo";

export const profileRankedScreenShowcase: ShowcaseEntry = {
  slug: "profile-ranked-screen",
  name: "Profile Ranked Screen",
  area: "collection",
  description:
    "Profile → RANKED sub-tab content. Season overview with 3-column feature strip (Conquer the Rift / Start Your Climb / Earn Rewards), centred QUEUE UP CTA button, and a split SP progress bar with milestone medallion nodes.",
  variants: [
    {
      name: "Default — pre-placement",
      notes:
        "All milestones unreached (0 SP). Feature strip thumbnails shown. QUEUE UP button centred above the progress bar. Progress track uses unranked crests dimmed at 30% opacity.",
      render: () => <ProfileRankedDefaultDemo />,
    },
    {
      name: "In-season progress — first milestone reached",
      notes:
        "First milestone (Iron/150 SP) reached — arc ring gold-3, crest at full opacity. Connector line between first and second milestone fills gold-3. Second and third milestones remain hollow.",
      render: () => <ProfileRankedInProgressDemo />,
    },
    {
      name: "Split complete — all milestones reached",
      notes:
        "All three milestones reached, all arc rings gold-3, all connector lines gold-3. Time remaining shows 0D 0H 0M.",
      render: () => <ProfileRankedSplitCompleteDemo />,
    },
  ],
};
