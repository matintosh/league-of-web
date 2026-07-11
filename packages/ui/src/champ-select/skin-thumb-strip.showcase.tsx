import type { ShowcaseEntry } from "../showcase";
import {
  SkinThumbStripSnapshot,
  SkinThumbStripDemo,
} from "./skin-thumb-strip.demo";

export const skinThumbStripShowcase: ShowcaseEntry = {
  slug: "skin-thumb-strip",
  name: "Skin Thumb Strip",
  area: "champ-select",
  description:
    "Standalone thumb strip companion to SkinCarousel — chevron arrows + ~90×50 skin thumbs with gold-3 selected border and diamond lock badges on locked entries. Extracted so screens can place the strip in a different layout zone than the splash frame (the loadout screen renders it in the bottom bar via SkinCarousel's showThumbStrip={false}). Same interaction contract as the carousel: chevrons skip locked skins (clamped, no wrap), locked thumbs no-op.",
  variants: [
    {
      name: "Default — Feral Warwick selected, two locked",
      notes:
        "Static snapshot as composed by the loadout screen's bottom bar. Indices 1 and 2 are locked (dimmed + lock badge).",
      render: () => <SkinThumbStripSnapshot />,
    },
    {
      name: "Interactive demo — chevrons skip locked",
      notes:
        "Fully interactive. From index 0 the next chevron skips the two locked skins and lands on Feral Warwick. Clicking a locked thumb no-ops.",
      render: () => <SkinThumbStripDemo />,
    },
  ],
};
