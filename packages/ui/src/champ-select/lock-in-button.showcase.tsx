import type { ShowcaseEntry } from "../showcase";
import {
  LockInButtonEnabledDemo,
  LockInButtonDisabledDemo,
  LockInButtonInQueueDemo,
  LockInButtonCustomLabelDemo,
  LockInButtonFullWidthDemo,
  LockInButtonBanVariantDemo,
  LockInButtonVideoDemo,
  LockInButtonPulseDemo,
  LockInButtonAllReturnedDemo,
} from "./lock-in-button.demo";

export const lockInButtonShowcase: ShowcaseEntry = {
  slug: "lock-in-button",
  name: "Lock In Button",
  area: "champ-select",
  description:
    "Trapezoid + curved-bottom-arc gradient confirmation button for the pick phase and lobby. " +
    "Shape: wider top, sides slope inward 12% per side, base closes with a downward quadratic bezier arc " +
    "(sagitta ≈ 22% of body height, matching client-lobby-party-v11.png reference). " +
    "Clip implemented via SVG <clipPath clipPathUnits='objectBoundingBox'> (shared TrapezoidButton primitive) so it scales to any width. " +
    "Enabled lock: near-flat teal idle fill (teal-grad-fm-a → teal-grad-fm-b), " +
    "2px teal-fm-border ring following the arc silhouette, WHITE text — matched 1:1 to the reference " +
    "FIND MATCH button (docs/reference/client-find-match-button.png; #331: fill Δ2.5, border Δ0.0/channel). " +
    "Enabled ban: red gradient fill (ban-red-2 → ban-red-3), white text. " +
    "Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text. " +
    "Drop-shadow glow follows the curved silhouette (filter:drop-shadow on outer wrapper). " +
    "NOT a HextechButton variant.",
  variants: [
    {
      name: "Enabled — lock variant (FIND MATCH / LOCK IN)",
      notes:
        "Near-flat teal idle fill (teal-grad-fm-a → teal-grad-fm-b), white text, teal-fm-border ring " +
        "following trapezoid+arc — matched to the reference FIND MATCH crop (#331). " +
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
    {
      name: "Video state machine (intro → idle → hover → active)",
      notes:
        "Real-client FIND MATCH state videos (issue #310) layered over the CSS button. " +
        "Intro plays once on mount, then the idle shimmer loops. Hover crossfades (~250ms) into the " +
        "bright cyan hover face; press shows the engaged/active face. Videos carry alpha and composite " +
        "straight (no blend) below the label, extending past the trapezoid for glow bleed but staying " +
        "pointer-events-none — the hit area and clip geometry are unchanged. Under prefers-reduced-motion " +
        "the videos are hidden and the pure-CSS button shows.",
      render: () => <LockInButtonVideoDemo />,
    },
    {
      name: "Video — pulse attention (ready-to-start)",
      notes:
        "attention=\"pulse\" — the green attention-pulse sweep the real client plays when a match is " +
        "ready to start. Authored on a 300×200 canvas so the green glow bleeds well past the button.",
      render: () => <LockInButtonPulseDemo />,
    },
    {
      name: "Video — all-returned attention (party all-ready)",
      notes:
        "attention=\"all-returned\" — the steady green outline glow shown when the whole party is ready. " +
        "Same 300×200 bleed geometry as the pulse state.",
      render: () => <LockInButtonAllReturnedDemo />,
    },
  ],
};
