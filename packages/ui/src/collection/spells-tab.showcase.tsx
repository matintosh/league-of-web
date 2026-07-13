import type { ShowcaseEntry } from "../showcase";
import {
  SpellsTabDefaultDemo,
  SpellsTabFlashSelectedDemo,
  SpellsTabNoPreviewDemo,
} from "./spells-tab.demo";

export const spellsTabShowcase: ShowcaseEntry = {
  slug: "spells-tab",
  name: "Spells Tab",
  area: "collection",
  description:
    "Collection → Spells sub-tab. Left column: 4-column summoner spell icon grid with selected-cell gold border + bg-blue-6, and detail panel (name, unlock level, modes, description, cooldown). Right column: preview art with blur/darken + centered icon overlay, or bg-blue-8 fallback when no previewSrc.",
  variants: [
    {
      name: "Default (Teleport selected)",
      notes:
        "Teleport pre-selected to match the reference screenshot. Click any spell to select it — the left cell highlights with a gold border and the detail panel updates.",
      render: () => <SpellsTabDefaultDemo />,
    },
    {
      name: "Flash selected",
      notes:
        "Flash pre-selected — exercises a different spell's detail panel (Level 8 unlock, ARAM modes).",
      render: () => <SpellsTabFlashSelectedDemo />,
    },
    {
      name: "No preview art (fallback)",
      notes:
        "All spells have no previewSrc — right column shows bg-blue-8 with the selected spell icon centered at 96px.",
      render: () => <SpellsTabNoPreviewDemo />,
    },
  ],
};
