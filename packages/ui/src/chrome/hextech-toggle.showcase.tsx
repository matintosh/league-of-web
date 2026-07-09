import type { ShowcaseEntry } from "../showcase";
import { HextechToggleDemo, HextechToggleStatesDemo } from "./hextech-toggle.demo";

export const hextechToggleShowcase: ShowcaseEntry = {
  slug: "hextech-toggle",
  name: "Hextech Toggle",
  area: "chrome",
  description:
    "On/off switch used throughout the LoL client settings. Blue track+thumb when on, grey when off; keyboard-operable as role=\"switch\".",
  variants: [
    {
      name: "Interactive",
      notes: "Controlled state via useState. Click to toggle on/off.",
      render: () => <HextechToggleDemo />,
    },
    {
      name: "All states",
      notes: "Off, On, Disabled-off, Disabled-on — static snapshots.",
      render: () => <HextechToggleStatesDemo />,
    },
  ],
};
