import type { ShowcaseEntry } from "../showcase";
import { SkinPreviewOwnedDemo, SkinPreviewUnownedDemo } from "./skin-preview.demo";

export const skinPreviewShowcase: ShowcaseEntry = {
  slug: "skin-preview",
  name: "Skin Preview",
  area: "collection",
  description:
    "Full-bleed detail overlay for a champion skin. Shows splash art, skin name, flavor text, acquired date, OWNED badge, thumbnail strip, and chevron navigation. Renders inside absolute inset-0 z-20 in the collection content area.",
  variants: [
    {
      name: "Owned skin",
      notes:
        "Kayle — owned=true, acquired date shown, gold badge. Use chevrons or thumbnails to cycle through skins.",
      render: () => <SkinPreviewOwnedDemo />,
    },
    {
      name: "Unowned skin",
      notes:
        "Kayle — starting on Viridian Kayle (owned=false), no acquired date, 'Not Owned' badge. Thumbnails show lock badge for unowned skins.",
      render: () => <SkinPreviewUnownedDemo />,
    },
  ],
};
