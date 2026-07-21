import type { ShowcaseEntry } from "../showcase";
import {
  ChampionDetailOverviewDemo,
  ChampionDetailAbilitiesDemo,
  ChampionDetailMasteryDemo,
  ChampionDetailMasteryUnrankedDemo,
  ChampionDetailEternalsDemo,
  ChampionDetailSkinsDemo,
  ChampionDetailInteractiveDemo,
} from "./champion-detail.demo";

export const championDetailShowcase: ShowcaseEntry = {
  slug: "champion-detail",
  name: "Champion Detail",
  area: "collection",
  description:
    "Full-window champion detail overlay — header with crest glyph + champion name/title, five-tab row (Overview / Abilities / Mastery / Eternals / Skins), close ✕. Tab state is internal (self-contained overlay — deliberate exception to FilterTabs controlled precedent). Escape handling is delegated to the parent screen.",
  variants: [
    {
      name: "Overview tab",
      notes:
        "Default tab: full-bleed splash with left gradient scrim, info panel (Damage / Style slider / Difficulty bars / radial stat wheel / lore / Owned chip / Learn More link). The stat wheel composites the real client CDN art — the cdp_graph_backing target plate (grey role glyphs + teal centre dot baked in) with the cdp-graph-segment-l{difficulty} teal arc-fan layered on top — matching docs/reference/client-champion-overview-statwheel.jpg. When art URLs are absent it falls back to a token-styled hand-drawn target.",
      render: () => <ChampionDetailOverviewDemo />,
    },
    {
      name: "Abilities tab",
      notes:
        "P/Q/W/E/R icon row — active icon has gold-2 border + glow; below shows ability name + description. Splash background shown; video playback is out of scope.",
      render: () => <ChampionDetailAbilitiesDemo />,
    },
    {
      name: "Mastery tab — has data",
      notes:
        "Mastery level crest (CDragon image + SVG fallback), level label, point total, wishlist/share icon buttons, right sidebar showing current milestone checklist + next-milestone rewards, bottom reward strip with split selector + reward icon slots. Matches the modern client reference (Level 11, Milestone III).",
      render: () => <ChampionDetailMasteryDemo />,
    },
    {
      name: "Mastery tab — unranked",
      notes:
        "No mastery prop passed → placeholder state: SVG crest (level 0), 'Not Yet Ranked' label, instructional copy. No sidebar or reward strip.",
      render: () => <ChampionDetailMasteryUnrankedDemo />,
    },
    {
      name: "Eternals tab",
      notes:
        "Empty state: Eternals gem SVG icon, 'No Eternals Earned' heading, instructional copy. Content is a stub — full Eternals tracking is a follow-up (issue #245).",
      render: () => <ChampionDetailEternalsDemo />,
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
        "Full round-trip: tab switching across all 5 tabs (mastery data included), close button (✕) returns to 'Open Overlay' so the overlay can be re-opened.",
      render: () => <ChampionDetailInteractiveDemo />,
    },
  ],
};
