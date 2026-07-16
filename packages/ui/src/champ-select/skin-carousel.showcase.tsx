import type { ShowcaseEntry } from "../showcase";
import {
  SkinCarouselReferenceSnapshot,
  SkinCarouselAllUnlockedSnapshot,
  SkinCarouselLockedAdjacentSnapshot,
  SkinCarouselDemo,
} from "./skin-carousel.demo";

export const skinCarouselShowcase: ShowcaseEntry = {
  slug: "skin-carousel",
  name: "Skin Carousel",
  area: "champ-select",
  description:
    "Champ-select skin picker: circular ornate frame (double gold SVG ring + dashed tick circle, circular-clipped splash), italic font-display skin name in gold-1, pagination dots (6px, blue-2 active / grey-3 inactive), and a horizontal thumb strip whose selected thumb enlarges with a heavy double-gold frame. Locked skins show a dimmed (still-readable) thumb + gold padlock badge; clicking them is a no-op. Chevron arrows skip locked skins (clamped, no wrap).",
  referenceImage: "client-champ-select-loadout.jpg",
  referenceNote: "docs/reference/client-champ-select-loadout.jpg — live client champ-select skin loadout panel",
  variants: [
    {
      name: "Default — Feral Warwick selected (index 3)",
      notes:
        "Matches reference screenshot: Feral Warwick in the circular frame with skins 1, 2, 4 locked. Static snapshot — use the Interactive Demo variant to test interactions.",
      render: () => <SkinCarouselReferenceSnapshot />,
    },
    {
      name: "All unlocked — default skin selected",
      notes:
        "All 5 Warwick skins unlocked; index 0 (default) selected. Dots, thumbs, and frame all rendered with no locked overlays.",
      render: () => <SkinCarouselAllUnlockedSnapshot />,
    },
    {
      name: "Locked entries — first skin selected (adjacent to locked)",
      notes:
        "Index 0 selected; next chevron will skip index 1 (locked) and land on index 3 (Feral Warwick) — demonstrated in the interactive demo.",
      render: () => <SkinCarouselLockedAdjacentSnapshot />,
    },
    {
      name: "Interactive demo — click thumbs, dots, and chevrons",
      notes:
        "Fully interactive. Chevrons skip locked skins. Clicking a locked thumb no-ops. Selection is clamped at the ends.",
      render: () => <SkinCarouselDemo />,
    },
  ],
};
