import type { ShowcaseEntry } from "../showcase";
import {
  ProfileRankedDefaultDemo,
  ProfileRankedInProgressDemo,
  ProfileRankedSplitCompleteDemo,
  ProfileRankedWingsGoldDemo,
  ProfileRankedWingsEmeraldDemo,
  ProfileRankedWingsChallengerDemo,
} from "./profile-ranked-screen.demo";

export const profileRankedScreenShowcase: ShowcaseEntry = {
  slug: "profile-ranked-screen",
  name: "Profile Ranked Screen",
  area: "collection",
  description:
    "Profile → RANKED sub-tab content. Season overview with 3-column feature strip (Conquer the Rift / Start Your Climb / Earn Rewards), centred QUEUE UP CTA button, and a split SP progress bar with 3 hexagonal SP checkpoint badges. A feature column can carry an animated ranked-emblem wings video (alpha webm) over its crest art.",
  variants: [
    {
      name: "Default — pre-placement",
      notes:
        "All milestones unreached (0 SP). All 3 nodes show the hexagonal SP checkpoint badge (gold-4 border, blue-5 teal circle, muted crest). No arc rings on unreached nodes.",
      render: () => <ProfileRankedDefaultDemo />,
    },
    {
      name: "In-season progress — first milestone reached",
      notes:
        "First milestone (0/150 SP) reached — badge brightens to gold-3 border, blue-3 teal fill. Connector line between first and second fills gold-3. Second and third milestones remain in muted state.",
      render: () => <ProfileRankedInProgressDemo />,
    },
    {
      name: "Split complete — all milestones reached",
      notes:
        "All three milestones reached — all badges at gold-3/blue-2 bright state. All connector lines gold-3. Time remaining shows 0D 0H 0M.",
      render: () => <ProfileRankedSplitCompleteDemo />,
    },
    {
      name: "Emblem wings — Gold",
      notes:
        "The middle \"Start Your Climb\" tile overlays the animated Gold ranked-emblem wings (208×270 alpha webm) over the crest art; outer tiles stay static. Wings loop; hidden under prefers-reduced-motion (static crest shows through).",
      render: () => <ProfileRankedWingsGoldDemo />,
    },
    {
      name: "Emblem wings — Emerald",
      notes:
        "Emerald wings — the tier missing from the jsDelivr emblem PNG set (ICON-SOURCES.md), available here as the animated wing loop. Same alpha overlay, no blend, additive over the static crest.",
      render: () => <ProfileRankedWingsEmeraldDemo />,
    },
    {
      name: "Emblem wings — Challenger",
      notes:
        "Challenger blue wings — matches the reference tile's electric-blue emblem art. This is the tier wired into the live Profile → Ranked tab.",
      render: () => <ProfileRankedWingsChallengerDemo />,
    },
  ],
};
