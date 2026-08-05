import type { ShowcaseEntry } from "../showcase";
import {
  WindowBarDefaultDemo,
  WindowBarWithLeftContentDemo,
} from "./launcher-window-bar.demo";

export const launcherWindowBarShowcase: ShowcaseEntry = {
  slug: "launcher-window-bar",
  name: "LauncherWindowBar",
  area: "launcher",
  referenceImage: "launcher-window-bar-crop.png",
  referenceNote: "Real launcher — top window chrome bar (cropped from Overview): transparent overlay at y=0, minimize + close controls only (no maximize) flush right",
  description:
    "Transparent overlay window chrome bar for the launcher top. Floats over content at y=0 — no background so rail/hero/social bleed to the top edge. Right-aligned controls: minimize (—) and close (✕) only. Hover: minimize → launcher-border bg; close → launcher-close-hover red bg + white icon. Props: leftContent?, onMinimize, onClose.",
  variants: [
    {
      name: "Default (no leftContent)",
      notes:
        "No leftContent. Shows minimize + close controls flush right. Background is the panel bg here for visibility — in the shell the bar is transparent.",
      render: () => <WindowBarDefaultDemo />,
    },
    {
      name: "With leftContent slot",
      notes:
        "leftContent provided — Riot logo mark + summoner name chip rendered in the left side.",
      render: () => <WindowBarWithLeftContentDemo />,
    },
  ],
};
