import type { ShowcaseEntry } from "../showcase";
import {
  RunesScreenDefaultDemo,
  RunesScreenSelectedDemo,
  RunesScreenEmptyDemo,
  RunesScreenPathFilterDemo,
  RunesScreenHidePresetsDemo,
  RunesScreenTrashEnabledDemo,
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
    {
      name: "Active path filter",
      notes:
        "Domination path pre-selected (7200). Gold underline appears under Domination icon; other paths dimmed to opacity-55. Only Domination primary pages shown in grid.",
      render: () => <RunesScreenPathFilterDemo />,
    },
    {
      name: "Hide preset pages",
      notes:
        "Hide preset pages checkbox checked. All three demo pages are preset so the card grid shows only CREATE NEW with the 'no pages match this filter' message.",
      render: () => <RunesScreenHidePresetsDemo />,
    },
    {
      name: "Trash button enabled",
      notes:
        "Sorcery: The Calamity is pre-selected — trash button is active (full opacity, clickable border). Click to deselect then trash returns to disabled/dimmed state.",
      render: () => <RunesScreenTrashEnabledDemo />,
    },
  ],
};
