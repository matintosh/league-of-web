import type { ShowcaseEntry } from "../showcase";
import { CrestDivider } from "./crest-divider";

export const crestDividerShowcase: ShowcaseEntry = {
  slug: "crest-divider",
  name: "Crest Divider",
  area: "chrome",
  description:
    "Ornate section divider from universe.leagueoflegends.com — Beaufort label with wide letter-spacing, thin fading hairlines, and a small gold crest above.",
  variants: [
    {
      name: "With Label and Crest",
      notes: "Full divider as seen on the LATEST/FEATURED sections.",
      render: () => (
        <div data-shot="crest-divider-full" className="w-full px-8 py-4">
          <CrestDivider label="LATEST" />
        </div>
      ),
    },
    {
      name: "Label Only (no crest)",
      notes: "crest={false} — hairlines + label, no ornament above.",
      render: () => (
        <div className="w-full px-8 py-4">
          <CrestDivider label="FEATURED" crest={false} />
        </div>
      ),
    },
    {
      name: "Ornament Only",
      notes: "No label — single fading hairline, no center stack.",
      render: () => (
        <div className="w-full px-8 py-4">
          <CrestDivider />
        </div>
      ),
    },
    {
      name: "Long Label",
      notes: "Verifies hairlines still fade and layout holds on long text.",
      render: () => (
        <div className="w-full px-8 py-4">
          <CrestDivider label="CHAMPIONS & STORIES" />
        </div>
      ),
    },
  ],
};
