import type { ShowcaseEntry } from "../showcase";
import {
  HextechCheckboxUncheckedDemo,
  HextechCheckboxCheckedDemo,
  HextechCheckboxDisabledUncheckedDemo,
  HextechCheckboxDisabledCheckedDemo,
} from "./hextech-checkbox.demo";

export const hextechCheckboxShowcase: ShowcaseEntry = {
  slug: "hextech-checkbox",
  name: "Hextech Checkbox",
  area: "chrome",
  description:
    "Small square checkbox with gold border used for filter toggles in the collection sidebar.",
  variants: [
    {
      name: "Unchecked",
      notes: "Default unchecked state, toggleable.",
      render: () => <HextechCheckboxUncheckedDemo />,
    },
    {
      name: "Checked",
      notes: "Starts checked, toggleable.",
      render: () => <HextechCheckboxCheckedDemo />,
    },
    {
      name: "Disabled (unchecked)",
      notes: "Non-interactive, unchecked.",
      render: () => <HextechCheckboxDisabledUncheckedDemo />,
    },
    {
      name: "Disabled (checked)",
      notes: "Non-interactive, checked.",
      render: () => <HextechCheckboxDisabledCheckedDemo />,
    },
  ],
};
