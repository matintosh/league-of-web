import type { ShowcaseEntry } from "../showcase";
import { ArcadeEventTabDemo, ArcadeEventTabDemoNoSelection } from "./arcade-event-tab.demo";

export const arcadeEventTabShowcase: ShowcaseEntry = {
  slug: "arcade-event-tab",
  name: "Arcade Event Tab",
  area: "chrome",
  description:
    "Arcade 2019 event landing page — dark neon aesthetic with a 4-skin horizontal grid, Arcade Pass panel with unlock list and LEARN MORE CTA, event trailer tile, and New Champion tile.",
  variants: [
    {
      name: "Default — Battle Boss Yasuo selected",
      notes:
        "selectedSkinId='battle-boss-yasuo' — selected card shows gold-1 border with inner glow. Click any skin card to toggle selection.",
      render: () => <ArcadeEventTabDemo />,
    },
    {
      name: "No selection",
      notes:
        "selectedSkinId=undefined — all cards in default state with gold-5 border; hover brightens to gold-3.",
      render: () => <ArcadeEventTabDemoNoSelection />,
    },
  ],
};
