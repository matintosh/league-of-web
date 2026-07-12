import type { ShowcaseEntry } from "../showcase";
import {
  LockInButtonEnabledDemo,
  LockInButtonDisabledDemo,
  LockInButtonCustomLabelDemo,
  LockInButtonFullWidthDemo,
} from "./lock-in-button.demo";

export const lockInButtonShowcase: ShowcaseEntry = {
  slug: "lock-in-button",
  name: "Lock In Button",
  area: "champ-select",
  description:
    "Wide teal-bordered confirmation button for the pick phase. bg-grey-4 fill with blue-2 border and text. Disabled until a champion is selected. NOT a HextechButton variant — distinct teal/blue-2 vs gold visual language.",
  variants: [
    {
      name: "Enabled (champion selected)",
      render: () => <LockInButtonEnabledDemo />,
    },
    {
      name: "Disabled (no champion selected)",
      notes: "Grey border + text, cursor-not-allowed, aria-disabled",
      render: () => <LockInButtonDisabledDemo />,
    },
    {
      name: "Custom label",
      notes: "Label prop — natural-case in JSX, CSS uppercased by the component.",
      render: () => <LockInButtonCustomLabelDemo />,
    },
    {
      name: "Full width",
      notes: "The button is full-width by default (w-full); this shows it at 480px container width.",
      render: () => <LockInButtonFullWidthDemo />,
    },
  ],
};
