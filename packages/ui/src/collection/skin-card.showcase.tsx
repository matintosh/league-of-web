import type { ShowcaseEntry } from "../showcase";
import { SkinCard } from "./skin-card";
import { SkinCardClickableDemo } from "./skin-card.demo";
import { loadingArtUrl } from "@low/fixtures";

// Kayle — champion used for skin showcase (id: "Kayle", skins 0-4)
const KAYLE = "Kayle";

export const skinCardShowcase: ShowcaseEntry = {
  slug: "skin-card",
  name: "Skin Card",
  area: "collection",
  description:
    "Portrait tile for a champion skin in the collection browser. Owned skins show a gold border with diamond finials; unowned skins are dimmed with a lock badge.",
  variants: [
    {
      name: "Owned",
      notes: "owned=true (default) — gold border, diamond finials at top/bottom center",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle Skin 1" imageSrc={loadingArtUrl(KAYLE, 1)} owned />
        </div>
      ),
    },
    {
      name: "Unowned",
      notes: "owned=false — art at brightness-50, no border, lock badge at bottom-center",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle Skin 2" imageSrc={loadingArtUrl(KAYLE, 2)} owned={false} />
        </div>
      ),
    },
    {
      name: "Unowned hover note",
      notes:
        "owned=false, skin 3 — hover brightens art from brightness-50 → brightness-75 (no zoom). Hover over the card to see the effect.",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle Skin 3" imageSrc={loadingArtUrl(KAYLE, 3)} owned={false} />
        </div>
      ),
    },
    {
      name: "Clickable",
      notes: "onSelect provided — root renders as <button>; owned=true. Click to see selection feedback.",
      render: () => <SkinCardClickableDemo />,
    },
    {
      name: "Grid row",
      notes: "Mix of owned and unowned in a flex row",
      render: () => (
        <div className="p-6 bg-hextech-black flex gap-2">
          <SkinCard name="Kayle Base" imageSrc={loadingArtUrl(KAYLE, 0)} owned />
          <SkinCard name="Kayle Skin 1" imageSrc={loadingArtUrl(KAYLE, 1)} owned />
          <SkinCard name="Kayle Skin 2" imageSrc={loadingArtUrl(KAYLE, 2)} owned={false} />
          <SkinCard name="Kayle Skin 3" imageSrc={loadingArtUrl(KAYLE, 3)} owned={false} />
          <SkinCard name="Kayle Skin 4" imageSrc={loadingArtUrl(KAYLE, 4)} owned />
        </div>
      ),
    },
  ],
};
