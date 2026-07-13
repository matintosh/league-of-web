import type { ShowcaseEntry } from "../showcase";
import {
  RunesScreenDefaultDemo,
  RunesScreenSelectedDemo,
  RunesScreenEmptyDemo,
} from "./runes-screen.demo";

export const runesScreenShowcase: ShowcaseEntry = {
  slug: "runes-screen",
  name: "Runes Screen",
  area: "collection",
  description:
    "Collection → Runes sub-tab. Three zones: toolbar (search, path filters, hide-presets checkbox, page counter, CREATE NEW, trash), horizontal-scrolling card grid (CREATE NEW card + preset/custom rune page cards), and selected-page gold highlight.",
  variants: [
    {
      name: "Default (3 pages)",
      notes:
        "Three preset rune pages with DDragon art and keystone icons. Search, path filter, and hide-presets are all interactive — try filtering or searching. Click a card to select it (gold border).",
      render: () => <RunesScreenDefaultDemo />,
    },
    {
      name: "Selected page",
      notes:
        "First card (Precision: The Perfect) is pre-selected — shows the gold-3 border active state.",
      render: () => <RunesScreenSelectedDemo />,
    },
    {
      name: "Empty (no pages)",
      notes:
        "No rune pages — only the CREATE NEW card is visible in the grid. Counter reads 00 / 03.",
      render: () => <RunesScreenEmptyDemo />,
    },
  ],
};
