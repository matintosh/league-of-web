import type { ShowcaseEntry } from "../showcase";
import {
  HextechSelectDefaultDemo,
  HextechSelectWithSelectionDemo,
  HextechSelectDisabledDemo,
  HextechSelectWithPlaceholderDemo,
} from "./hextech-select.demo";

export const hextechSelectShowcase: ShowcaseEntry = {
  slug: "hextech-select",
  name: "Hextech Select",
  area: "chrome",
  description:
    "Native styled select dropdown used for Champion and Mastery filters in the collection sidebar.",
  variants: [
    {
      name: "Default",
      notes: "No pre-selection, with Champion placeholder.",
      render: () => <HextechSelectDefaultDemo />,
    },
    {
      name: "With selection",
      notes: 'Starts with "Ahri" selected.',
      render: () => <HextechSelectWithSelectionDemo />,
    },
    {
      name: "Disabled",
      notes: "Non-interactive and visually dimmed.",
      render: () => <HextechSelectDisabledDemo />,
    },
    {
      name: "With placeholder",
      notes: "Mastery dropdown with placeholder.",
      render: () => <HextechSelectWithPlaceholderDemo />,
    },
  ],
};
