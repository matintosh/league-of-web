import type { ShowcaseEntry } from "../showcase";
import {
  RailLolActiveDemo,
  RailHomeActiveDemo,
  RailNoActiveDemo,
  LauncherRailInteractiveDemo,
} from "./launcher-rail.demo";

export const launcherRailShowcase: ShowcaseEntry = {
  slug: "launcher-rail",
  name: "LauncherRail",
  area: "launcher",
  description:
    "56px-wide vertical icon rail for the launcher. Game icons top-stacked; utility icons bottom-pinned. Active slot: 3px gold left-edge accent (--color-launcher-rail-active) + panel-bg tint. Hover: panel-bg tint, full opacity. Default: 60% opacity. Props: items[], activeId, onSelect.",
  variants: [
    {
      name: "LoL active (default active state)",
      notes:
        'activeId="lol" → LoL slot shows gold accent bar + full opacity. Home/TFT/Valorant at 60% opacity. Settings pinned to bottom.',
      render: () => <RailLolActiveDemo />,
    },
    {
      name: "Home active",
      notes: 'activeId="home" → Riot fist slot active with left accent bar.',
      render: () => <RailHomeActiveDemo />,
    },
    {
      name: "No active item",
      notes: "activeId omitted → all icons at 60% opacity, no accent bar.",
      render: () => <RailNoActiveDemo />,
    },
    {
      name: "Interactive (click to switch)",
      notes: "Click game icons to switch the active selection.",
      render: () => <LauncherRailInteractiveDemo />,
    },
  ],
};
