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
    "Portrait tile for a champion skin in the collection browser. Owned skins show a gold border with diamond finials; unowned skins are dimmed with a lock badge. Hovering any card reveals a dark panel tooltip with the skin name; unowned cards also show a tier badge.",
  variants: [
    {
      name: "Owned",
      notes: "owned=true (default) — gold border, diamond finials at top/bottom center. Hover to reveal name tooltip.",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle" imageSrc={loadingArtUrl(KAYLE, 0)} owned />
        </div>
      ),
    },
    {
      name: "Unowned — no tier",
      notes: "owned=false, no tierLabel — art at brightness-50, lock badge. Hover to see name tooltip (no badge row).",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle Skin 2" imageSrc={loadingArtUrl(KAYLE, 2)} owned={false} />
        </div>
      ),
    },
    {
      name: "Unowned — Legacy tier",
      notes: "owned=false + tierLabel='Legacy' — hover reveals name + Legacy badge. This matches the reference screenshot (Transcended Kayle).",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard
            name="Transcended Kayle"
            imageSrc={loadingArtUrl(KAYLE, 3)}
            owned={false}
            tierLabel="Legacy"
          />
        </div>
      ),
    },
    {
      name: "Unowned — Epic tier",
      notes: "owned=false + tierLabel='Epic' — hover reveals name + Epic badge.",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard
            name="Aether Wing Kayle"
            imageSrc={loadingArtUrl(KAYLE, 6)}
            owned={false}
            tierLabel="Epic"
          />
        </div>
      ),
    },
    {
      name: "Clickable",
      notes: "onSelect provided — root renders as <button>; owned=true. Click to see selection feedback. Tooltip still appears on hover.",
      render: () => <SkinCardClickableDemo />,
    },
    {
      name: "Grid row — mixed owned/unowned/tier",
      notes: "Mix of owned and unowned cards with various tier labels. Hover individual cards to see tooltip states.",
      render: () => (
        <div className="p-6 bg-hextech-black flex gap-2">
          <SkinCard name="Kayle" imageSrc={loadingArtUrl(KAYLE, 0)} owned />
          <SkinCard name="Judgment Kayle" imageSrc={loadingArtUrl(KAYLE, 1)} owned />
          <SkinCard name="Viridian Kayle" imageSrc={loadingArtUrl(KAYLE, 2)} owned={false} tierLabel="Legacy" />
          <SkinCard name="Transcended Kayle" imageSrc={loadingArtUrl(KAYLE, 3)} owned={false} tierLabel="Legacy" />
          <SkinCard name="Aether Wing Kayle" imageSrc={loadingArtUrl(KAYLE, 6)} owned={false} tierLabel="Epic" />
        </div>
      ),
    },
  ],
};
