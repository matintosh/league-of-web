import type { ShowcaseEntry } from "../showcase";
import { SkinCard } from "./skin-card";
import { SkinCardClickableDemo } from "./skin-card.demo";
import { loadingArtUrl } from "@low/fixtures";

// Kayle — champion used for skin showcase (id: "Kayle", skins 0-8)
const KAYLE = "Kayle";

export const skinCardShowcase: ShowcaseEntry = {
  slug: "skin-card",
  name: "Skin Card",
  area: "collection",
  description:
    "Portrait tile for a champion skin in the collection browser. Owned skins show a gold border with diamond finials; unowned skins are dimmed with a lock badge. Hovering any card reveals a floating dark panel tooltip to the right (or left for last-column cards) showing the skin name and optional tier badge.",
  variants: [
    {
      name: "Owned",
      notes: "owned=true (default) — gold border, diamond finials. Hover to reveal name tooltip floating right.",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle" imageSrc={loadingArtUrl(KAYLE, 0)} owned />
        </div>
      ),
    },
    {
      name: "Unowned — no tier",
      notes: "owned=false, no tierLabel — art dimmed, lock badge. Hover for name-only tooltip (no badge row).",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <SkinCard name="Kayle Skin 2" imageSrc={loadingArtUrl(KAYLE, 2)} owned={false} />
        </div>
      ),
    },
    {
      name: "Unowned — Legacy tier (tooltip right)",
      notes: "owned=false + tierLabel='Legacy' + tooltipSide='right' (default). Hover reveals floating panel to the right with name + Legacy badge. Matches the reference screenshot (Transcended Kayle).",
      render: () => (
        <div className="p-6 bg-hextech-black" style={{ paddingRight: "14rem" }}>
          <SkinCard
            name="Transcended Kayle"
            imageSrc={loadingArtUrl(KAYLE, 3)}
            owned={false}
            tierLabel="Legacy"
            tooltipSide="right"
          />
        </div>
      ),
    },
    {
      name: "Unowned — Epic tier (tooltip left)",
      notes: "tooltipSide='left' — panel opens to the left of the card, used for last-column cards to stay within the viewport.",
      render: () => (
        <div className="p-6 bg-hextech-black" style={{ paddingLeft: "14rem" }}>
          <SkinCard
            name="Aether Wing Kayle"
            imageSrc={loadingArtUrl(KAYLE, 6)}
            owned={false}
            tierLabel="Epic"
            tooltipSide="left"
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
      notes: "Mix of owned and unowned cards with various tier labels. The rightmost card uses tooltipSide='left'. Hover individual cards to see tooltip states.",
      render: () => (
        <div className="p-6 bg-hextech-black flex gap-4">
          <SkinCard name="Kayle" imageSrc={loadingArtUrl(KAYLE, 0)} owned tooltipSide="right" />
          <SkinCard name="Judgment Kayle" imageSrc={loadingArtUrl(KAYLE, 1)} owned tooltipSide="right" />
          <SkinCard name="Viridian Kayle" imageSrc={loadingArtUrl(KAYLE, 2)} owned={false} tierLabel="Legacy" tooltipSide="right" />
          <SkinCard name="Transcended Kayle" imageSrc={loadingArtUrl(KAYLE, 3)} owned={false} tierLabel="Legacy" tooltipSide="left" />
        </div>
      ),
    },
  ],
};
