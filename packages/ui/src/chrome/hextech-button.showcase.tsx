import type { ShowcaseEntry } from "../showcase";
import { HextechButton } from "./hextech-button";

export const hextechButtonShowcase: ShowcaseEntry = {
  slug: "hextech-button",
  name: "Hextech Button",
  area: "chrome",
  description:
    "The client's main call-to-action button — PLAY, confirm dialogs, store purchases.",
  variants: [
    { name: "Primary", render: () => <HextechButton>Play</HextechButton> },
    {
      name: "Secondary",
      notes: 'variant="secondary" — cancel/back actions.',
      render: () => <HextechButton variant="secondary">Cancel</HextechButton>,
    },
    {
      name: "Large",
      notes: 'size="large" — the PLAY button.',
      render: () => <HextechButton size="large">Play</HextechButton>,
    },
    {
      name: "Disabled",
      notes: "disabled — greyed border, no gradient, no pointer.",
      render: () => <HextechButton disabled>Play</HextechButton>,
    },
  ],
};
