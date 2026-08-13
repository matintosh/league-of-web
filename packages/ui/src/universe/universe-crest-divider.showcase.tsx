import type { ShowcaseEntry } from "../showcase";
import { UniverseCrestDivider } from "./universe-crest-divider";

export const universeCrestDividerShowcase: ShowcaseEntry = {
  slug: "universe-crest-divider",
  name: "Universe Crest Divider",
  area: "universe",
  description:
    "Ornamented gold section header from universe.leagueoflegends.com — diamond/shield crest ornament above a Beaufort caps label with wide tracking, thin gold underline, and symmetric fading flourish lines.",
  referenceImage: "universe-crest-divider.png",
  referenceNote: "docs/reference/universe-crest-divider.png — LATEST header",
  variants: [
    {
      name: "LATEST (diamond crest)",
      notes: "Default diamond-pip crest variant as seen on the Universe landing page LATEST section.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full px-8 py-6"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseCrestDivider label="LATEST" />
        </div>
      ),
    },
    {
      name: "FEATURED (diamond crest)",
      notes: "Same variant with FEATURED label — used in the second divider section on the landing page.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full px-8 py-6"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseCrestDivider label="FEATURED" />
        </div>
      ),
    },
    {
      name: "CHAMPIONS (diamond crest)",
      notes: "Longer label — verifies layout and hairlines hold on wider text.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full px-8 py-6"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseCrestDivider label="CHAMPIONS" />
        </div>
      ),
    },
    {
      name: "Shield crest variant",
      notes: "crestVariant=\"shield\" — hextech shield silhouette above the label, used as an alternate ornament.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full px-8 py-6"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseCrestDivider label="REGIONS" crestVariant="shield" />
        </div>
      ),
    },
  ],
};
