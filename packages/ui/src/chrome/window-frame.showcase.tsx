import type { ShowcaseEntry } from "../showcase";
import {
  WindowFrameDefaultDemo,
  WindowFrameWithTitleDemo,
  WindowFrameCloseOnlyDemo,
  WindowFrameNoControlsDemo,
} from "./window-frame.demo";

export const windowFrameShowcase: ShowcaseEntry = {
  slug: "window-frame",
  name: "Window Frame",
  area: "chrome",
  description:
    "The LoL client's outer window chrome — thin gold border, slim title bar, and top-right minimize/close controls.",
  variants: [
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
