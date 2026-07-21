import type { ShowcaseEntry } from "../showcase";
import {
  SkinCarouselReferenceSnapshot,
  SkinCarouselAllUnlockedSnapshot,
  SkinCarouselLockedAdjacentSnapshot,
  SkinCarouselLargeRadiusSnapshot,
  SkinCarouselNoRingArtSnapshot,
  SkinCarouselDemo,
} from "./skin-carousel.demo";

export const skinCarouselShowcase: ShowcaseEntry = {
  slug: "skin-carousel",
  name: "Skin Carousel",
  area: "champ-select",
  description:
    "Champ-select skin picker: circular ornate frame using the authentic champion-ring art (dashed tick-ring + mirrored inner/outer gold filigree arcs) layered over a circular-clipped splash, italic font-display skin name in gold-1, pagination dots (6px, blue-2 active / grey-3 inactive), and a horizontal thumb strip whose selected thumb enlarges with a heavy double-gold frame. Locked skins show a dimmed (still-readable) thumb + gold padlock badge; clicking them is a no-op. Chevron arrows skip locked skins (clamped, no wrap). Ring art is sourced via championRingUrl() from @low/fixtures; the component stays presentational and degrades gracefully when art is absent.",
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
      name: "Large ring radius (190) — concentric at max",
      notes:
        "ringRadius=190 (up from the 130 default). Confirms the champion-ring art (dashed ring + inner/outer gold arcs) scales with the prop and stays centered/concentric with the clipped splash at a large radius. Thumb strip hidden to isolate the frame.",
      render: () => <SkinCarouselLargeRadiusSnapshot />,
    },
    {
      name: "Graceful fallback — no ring art supplied",
      notes:
        "The ring art props (ringDashedSrc / ringInnerLeftSrc / ringOuterLeftSrc) are omitted. The circular-clipped splash and skin name still render with no layout break — the frame simply shows without the ornamental ring.",
      render: () => <SkinCarouselNoRingArtSnapshot />,
    },
    {
      name: "Interactive demo — click thumbs, dots, and chevrons",
      notes:
        "Fully interactive. Chevrons skip locked skins. Clicking a locked thumb no-ops. Selection is clamped at the ends.",
      render: () => <SkinCarouselDemo />,
    },
  ],
};
