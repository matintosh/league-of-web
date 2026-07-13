import type { ShowcaseEntry } from "../showcase";
import {
  LockInButtonEnabledDemo,
  LockInButtonDisabledDemo,
  LockInButtonInQueueDemo,
  LockInButtonCustomLabelDemo,
  LockInButtonFullWidthDemo,
  LockInButtonBanVariantDemo,
} from "./lock-in-button.demo";

export const lockInButtonShowcase: ShowcaseEntry = {
  slug: "lock-in-button",
  name: "Lock In Button",
  area: "champ-select",
  description:
    "Trapezoid + curved-bottom-arc gradient confirmation button for the pick phase and lobby. " +
    "Shape: wider top, sides slope inward 12% per side, base closes with a downward quadratic bezier arc " +
    "(sagitta ≈ 22% of body height, matching client-lobby-party-v11.png reference). " +
    "Clip implemented via SVG <clipPath clipPathUnits='objectBoundingBox'> so it scales to any width. " +
    "Enabled lock: bright cyan-teal vertical gradient fill (cyan-1 → teal-grad-a), " +
    "2px cyan-1 border following the arc silhouette, hextech-black text (dark-on-bright inversion). " +
    "Enabled ban: red gradient fill (ban-red-2 → ban-red-3), white text. " +
    "Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text. " +
    "Drop-shadow glow follows the curved silhouette (filter:drop-shadow on outer wrapper). " +
    "NOT a HextechButton variant.",
  variants: [
    {
      name: "Enabled — lock variant (FIND MATCH / LOCK IN)",
      notes:
        "Bright cyan gradient fill, hextech-black text, cyan-1 border following trapezoid+arc. " +
        "Curved bottom edge bows downward — sagitta ≈ 22% of body height. " +
        "Drop-shadow glow follows the arc. " +
        "Hover brightens to teal-grad-hover-a/b/c gradient. Press dims to teal-grad-press stops.",
      render: () => <LockInButtonEnabledDemo />,
    },
    {
      name: "Enabled — ban variant (BAN button)",
      notes:
        "Same trapezoid+arc geometry with red palette: ban-red-2→ban-red-3 gradient, " +
        "ban-red-1 border, white text, red drop-shadow glow.",
      render: () => <LockInButtonBanVariantDemo />,
    },
    {
      name: "Disabled (no champion selected)",
      notes: "Grey-4 fill, grey-3 border, grey-2 text, cursor-not-allowed, aria-disabled. Arc geometry unchanged.",
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
      notes:
        "w-full by default — trapezoid+arc scales with container width via objectBoundingBox clipPath. " +
        "Sagitta scales proportionally.",
      render: () => <LockInButtonFullWidthDemo />,
    },
  ],
};
