import type { ShowcaseEntry } from "../showcase";
import {
  ChampionDetailOverviewDemo,
  ChampionDetailAbilitiesDemo,
  ChampionDetailSkinsDemo,
  ChampionDetailInteractiveDemo,
} from "./champion-detail.demo";

export const championDetailShowcase: ShowcaseEntry = {
  slug: "champion-detail",
  name: "Champion Detail",
  area: "collection",
  description:
    "Full-window champion detail overlay — header with crest glyph + champion name/title, three-tab row (Overview / Abilities / Skins), close ✕. Tab state is internal (self-contained overlay — deliberate exception to FilterTabs controlled precedent). Escape handling is delegated to the parent screen.",
  variants: [
    {
      name: "Overview tab",
      notes:
        "Default tab: full-bleed splash with left gradient scrim, info panel (Damage / Style slider / Difficulty bars / decorative radial stat wheel / lore / Owned chip / Learn More link).",
      render: () => <ChampionDetailOverviewDemo />,
    },
    {
      name: "Abilities tab",
      notes:
        "P/Q/W/E/R icon row — active icon has gold-2 border + glow; below shows ability name + description. Splash background shown; video playback is out of scope.",
      render: () => <ChampionDetailAbilitiesDemo />,
    },
    {
      name: "Skins tab",
      notes:
        "Reuses SkinCard grid — Warwick skins with owned/unowned states. Owned skins show gold border + finials; unowned show dimmed art + lock badge.",
      render: () => <ChampionDetailSkinsDemo />,
    },
    {
      name: "Interactive demo",
      notes:
        "Full round-trip: tab switching, close button (✕) returns to 'Open Overlay' so the overlay can be re-opened.",
      render: () => <ChampionDetailInteractiveDemo />,
    },
  ],
};
