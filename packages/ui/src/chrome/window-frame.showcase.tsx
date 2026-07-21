import type { ShowcaseEntry } from "../showcase";
import {
  WindowFrameDefaultDemo,
  WindowFrameWithTitleDemo,
  WindowFrameCloseOnlyDemo,
  WindowFrameNoControlsDemo,
  WindowFrameIntegratedDemo,
  WindowFrameIntegratedWithGearDemo,
  WindowFrameStatusDotDemo,
} from "./window-frame.demo";

export const windowFrameShowcase: ShowcaseEntry = {
  slug: "window-frame",
  name: "Window Frame",
  area: "chrome",
  description:
    "The LoL client's outer window chrome — thin gold border, plus either a slim title bar (login era) or floating top-right controls (current-client era).",
  variants: [
    {
      name: "Integrated (no title bar)",
      notes:
        'chrome="integrated" — current-client era (#385): no title-bar row; controls float top-right above content and in-frame overlays. Used by the app shell at "/".',
      render: () => <WindowFrameIntegratedDemo />,
    },
    {
      name: "Integrated with gear",
      notes:
        'onSettings supplied — the ⚙ settings control renders in the window-control row, in the reference order help → minimize → settings → close (#401). The gear is opt-in: omit onSettings and the row is the classic ? ─ ✕. This is how the app shell wires the gear in the current era, matching client-current-home-activity-center.jpg.',
      render: () => <WindowFrameIntegratedWithGearDemo />,
    },
    {
      name: "Integrated with status dot (#464)",
      notes:
        'showStatusDot — a leading amber status dot precedes the help glyph (● ? ─ ⚙ ✕), matching the 2025 reference. Opt-in (default off), so the LOGIN title bar and other consumers are unaffected.',
      render: () => <WindowFrameStatusDotDemo />,
    },
    {
      name: "Default",
      notes: "No title, both controls visible.",
      render: () => <WindowFrameDefaultDemo />,
    },
    {
      name: "With Title",
      notes: 'title prop — displays display-font label in the bar.',
      render: () => <WindowFrameWithTitleDemo />,
    },
    {
      name: "Close Only",
      notes: "showMinimize={false} — minimize button hidden.",
      render: () => <WindowFrameCloseOnlyDemo />,
    },
    {
      name: "No Controls",
      notes: "showMinimize={false} showClose={false} — controls hidden (e.g. loading screen).",
      render: () => <WindowFrameNoControlsDemo />,
    },
  ],
};
