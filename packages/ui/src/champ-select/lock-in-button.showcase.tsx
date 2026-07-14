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
    "Trapezoid + curved-bottom-arc gradient confirmation button for the pick phase and lobby (v14 shape #335). " +
    "Shape: NARROW arched top (corners inset ~8.5% per side), sides splaying OUTWARD to a full-width base, " +
    "closing with a downward quadratic bezier arc (sagitta ≈ 29% of frame height, matching " +
    "client-find-match-shape-v14.png). " +
    "Clip implemented via SVG <clipPath clipPathUnits='objectBoundingBox'> (shared TrapezoidButton primitive) so it scales to any width. " +
    "Enabled lock: near-flat teal idle fill (teal-grad-fm-a → teal-grad-fm-b), " +
    "a NEAR-WHITE hot frame (color-mix white + teal-grad-fm-b) with a two-stop white/teal glow following the " +
    "arc silhouette, WHITE text — matched to the v14 FIND MATCH reference. " +
    "Enabled ban: red gradient fill (ban-red-2 → ban-red-3), ban-red-1 frame, white text. " +
    "Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text. " +
    "Drop-shadow glow follows the curved silhouette (filter:drop-shadow on outer wrapper). " +
    "NOT a HextechButton variant.",
  variants: [
    {
      name: "Enabled — lock variant (FIND MATCH / LOCK IN)",
      notes:
        "Near-flat teal idle fill (teal-grad-fm-a → teal-grad-fm-b), white text, NEAR-WHITE hot frame " +
        "following the v14 trapezoid+arc — matched to client-find-match-shape-v14.png (#335). " +
        "Narrow arched top, sides splay outward to a full-width base, bottom bows downward. " +
        "Two-stop white/teal drop-shadow glow follows the arc. " +
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
        "w-full by default — v14 trapezoid+arc scales with container width via objectBoundingBox clipPath. " +
        "Outward splay + sagitta scale proportionally.",
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
