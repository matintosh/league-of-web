import type { ShowcaseEntry } from "../showcase";
import {
  LeagueHomeScreenDemo,
  LeagueHomeScreenUnownedDemo,
} from "./league-home-screen.demo";

export const leagueHomeScreenShowcase: ShowcaseEntry = {
  slug: "league-home-screen",
  name: "League Home Screen",
  area: "chrome",
  description:
    "Current-era LEAGUE HOME featured-content landing — the content-link rail (from #456) beside a full-bleed champion splash with a gold eyebrow/title/body copy block, a mute disc, a SKINS thumbnail strip, and a GO TO STORE pill. Presentational: the rail arrives as a slot; splash/skin art arrive as src strings.",
  referenceImage: "client-current-home-2025-mf.png",
  referenceNote:
    "docs/reference/client-current-home-2025-mf.png — MVP T1 Miss Fortune featured: rail left, MF splash filling center/right, eyebrow/title/body lower-left, SKINS strip + GO TO STORE bottom-right.",
  variants: [
    {
      name: "Default — MVP MF featured",
      notes:
        "Miss Fortune featured with 'NEW SKIN' eyebrow, 2-line title, body copy, and the owned MVP T1 MF + 'Together as 1' skins strip. Click rail rows to swap the featured item (interactive via useState in the demo).",
      render: () => <LeagueHomeScreenDemo />,
    },
    {
      name: "Different featured — Mordekaiser",
      notes:
        "Sahn-Uzal Mordekaiser selected in the rail — the splash, copy, and SKINS strip all swap to his featured content.",
      render: () => <LeagueHomeScreenDemo initialActiveId="mordekaiser" />,
    },
    {
      name: "Muted",
      notes:
        "Mute disc active (top-right) — the speaker glyph shows the muted slash. Toggle it in any variant.",
      render: () => <LeagueHomeScreenDemo initialMuted />,
    },
    {
      name: "Skins unowned",
      notes:
        "Both SKINS cards without the Owned badge — verifies the badge is per-card and only renders when owned.",
      render: () => <LeagueHomeScreenUnownedDemo />,
    },
  ],
};
