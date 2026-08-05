import type { ShowcaseEntry } from "../showcase";
import {
  WindowBarDefaultDemo,
  WindowBarMaximizedDemo,
  WindowBarWithLeftContentDemo,
  WindowBarLeftMaximizedDemo,
} from "./launcher-window-bar.demo";

export const launcherWindowBarShowcase: ShowcaseEntry = {
  slug: "launcher-window-bar",
  name: "LauncherWindowBar",
  area: "launcher",
  referenceImage: "launcher-overview.png",
  referenceNote: "Real League launcher — 28px window chrome bar at top edge (minimize, maximize, close controls)",
  description:
    "28px window chrome bar for the launcher top. Right-aligned controls: minimize (—), maximize/restore (▢/⧉), close (✕). Hover: minimize/maximize → launcher-border bg; close → launcher-close-hover red bg + white icon. Props: leftContent?, onMinimize, onMaximize, onClose, maximized.",
  variants: [
    {
      name: "Default (windowed)",
      notes:
        "No leftContent, maximized=false. Shows minimize + maximize + close controls right-aligned. Hover close for red bg.",
      render: () => <WindowBarDefaultDemo />,
    },
    {
      name: "Maximized state",
      notes:
        "maximized=true → maximize button swaps to restore icon (overlapping squares).",
      render: () => <WindowBarMaximizedDemo />,
    },
    {
      name: "With leftContent slot",
      notes:
        "leftContent provided — Riot logo mark + summoner name chip rendered in the left side.",
      render: () => <WindowBarWithLeftContentDemo />,
    },
    {
      name: "With leftContent + maximized",
      notes: "leftContent + maximized=true combined.",
      render: () => <WindowBarLeftMaximizedDemo />,
    },
  ],
};
