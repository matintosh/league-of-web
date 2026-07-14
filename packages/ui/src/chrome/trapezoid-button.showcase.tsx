import type { ShowcaseEntry } from "../showcase";
import {
  TrapezoidButtonLockDemo,
  TrapezoidButtonBanDemo,
  TrapezoidButtonAcceptDemo,
  TrapezoidButtonWideDemo,
} from "./trapezoid-button.demo";

export const trapezoidButtonShowcase: ShowcaseEntry = {
  slug: "trapezoid-button",
  name: "Trapezoid Button",
  area: "chrome",
  description:
    "Shared curved-trapezoid CTA primitive (#331). Wide flat top, sides slope inward 12% per side, " +
    "base closes with a downward quadratic-bezier arc (sagitta ≈ 22% of body height), clipped via " +
    "SVG <clipPath clipPathUnits='objectBoundingBox'> so it scales to any width. Palette-agnostic: " +
    "consumers supply an ordered list of clipped shape layers (border shell + fill + overlays) plus " +
    "label styling. This is the single source of truth for the FIND MATCH / LOCK IN button, the BAN " +
    "button, and the MATCH FOUND ACCEPT button — LockInButton and MatchFoundModal both wrap it, adding " +
    "their video and entrance overlays on top. Presentational: props in, onClick out; no fetching.",
  referenceImage: "client-find-match-button.png",
  referenceNote:
    "docs/reference/client-find-match-button.png — the FIND MATCH surface whose trapezoid+arc geometry this primitive owns.",
  variants: [
    {
      name: "Lock palette (FIND MATCH / LOCK IN base)",
      notes:
        "Teal idle gradient (teal-grad-fm-a → teal-grad-fm-b), teal-fm-border, teal-fm-glow drop-shadow. " +
        "Static CSS base — the real LockInButton layers the #310 state videos over this.",
      render: () => <TrapezoidButtonLockDemo />,
    },
    {
      name: "Ban palette (BAN base)",
      notes: "Red gradient (ban-red-2 → ban-red-3), ban-red-1 border + glow, white label.",
      render: () => <TrapezoidButtonBanDemo />,
    },
    {
      name: "Accept palette (MATCH FOUND ACCEPT base)",
      notes:
        "Dark teal fill (blue-5) with teal-ring border and blue-2 glow, gold-1 label. " +
        "The real MatchFoundModal adds hover/press/entrance-pulse overlays on top.",
      render: () => <TrapezoidButtonAcceptDemo />,
    },
    {
      name: "Full width (480px container)",
      notes:
        "Slope + arc scale with container width via the objectBoundingBox clipPath — sagitta stays proportional.",
      render: () => <TrapezoidButtonWideDemo />,
    },
  ],
};
