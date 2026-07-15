import type { ShowcaseEntry } from "../showcase";
import {
  WindowFrameDefaultDemo,
  WindowFrameWithTitleDemo,
  WindowFrameCloseOnlyDemo,
  WindowFrameNoControlsDemo,
  WindowFrameIntegratedDemo,
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
