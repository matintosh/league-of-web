import type { ShowcaseEntry } from "../showcase";
import {
  LockInButtonEnabledDemo,
  LockInButtonDisabledDemo,
  LockInButtonInQueueDemo,
  LockInButtonCustomLabelDemo,
  LockInButtonFullWidthDemo,
} from "./lock-in-button.demo";

export const lockInButtonShowcase: ShowcaseEntry = {
  slug: "lock-in-button",
  name: "Lock In Button",
  area: "champ-select",
  description:
    "Trapezoid-shaped gradient confirmation button for the pick phase and lobby. " +
    "Enabled: bright cyan-teal vertical gradient fill (cyan-1 top → teal-grad-a bottom), " +
    "2px cyan-1 border following trapezoid shape, hextech-black text (dark-on-bright inversion). " +
    "Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text. " +
    "Trapezoid geometry: 12% inward slope per side (sampled from client-find-match-button.png). " +
    "NOT a HextechButton variant.",
  variants: [
    {
      name: "Enabled (champion selected / pre-queue)",
      notes:
        "Bright cyan gradient fill, hextech-black text, cyan-1 border following trapezoid. " +
        "Hover brightens to teal-grad-hover-a/b/c gradient. Press dims to teal-grad-press stops.",
      render: () => <LockInButtonEnabledDemo />,
    },
    {
      name: "Disabled (no champion selected)",
      notes: "Grey-4 fill, grey-3 border, grey-2 text, cursor-not-allowed, aria-disabled.",
      render: () => <LockInButtonDisabledDemo />,
    },
    {
      name: "In Queue (lobby disabled state)",
      notes:
        "Same disabled treatment with 'In Queue' label. Width 200px matching party-lobby-screen slot.",
      render: () => <LockInButtonInQueueDemo />,
    },
    {
      name: "Custom label (Find Match)",
      notes: "Label prop — natural-case in JSX, CSS uppercased by the component.",
      render: () => <LockInButtonCustomLabelDemo />,
    },
    {
      name: "Full width (480px container)",
      notes: "w-full by default — trapezoid scales with container width.",
      render: () => <LockInButtonFullWidthDemo />,
    },
  ],
};
