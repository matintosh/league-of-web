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
  referenceImage: "launcher-rail-crop.png",
  referenceNote: "Real launcher — left icon rail (cropped from Overview): Riot fist, Home, All-games grid, then game emblems top-stacked (LoL, Valorant, Wild Rift, 2XKO, TFT), Riot R shield bottom-pinned. Active LoL slot: ornate full-width gold banner tile. Rail 64px wide.",
  description:
    "64px-wide vertical icon rail for the launcher. 9-item full Riot roster: Riot fist + Home + All-games grid + LoL + Valorant + Wild Rift + 2XKO + TFT top-stacked; Riot R shield bottom-pinned. Active slot: ornate parchment-gold banner tile (full-width, gold bg + top/bottom border lines + left accent bar). Inactive: 60% opacity. Hover: panel-bg tint, full opacity. Props: items[], activeId, onSelect.",
  variants: [
    {
      name: "LoL active (default active state)",
      notes:
        'activeId="lol" → LoL slot shows ornate gold banner tile (full-width, parchment-gold bg). All others at 60% opacity. Riot R shield pinned to bottom.',
      render: () => <RailLolActiveDemo />,
    },
    {
      name: "Home active",
      notes: 'activeId="home" → Home slot shows ornate gold banner treatment.',
      render: () => <RailHomeActiveDemo />,
    },
    {
      name: "No active item",
      notes: "activeId omitted → all icons at 60% opacity, no banner.",
      render: () => <RailNoActiveDemo />,
    },
    {
      name: "Interactive (click to switch)",
      notes: "Click game icons to switch the active selection and see the gold banner move.",
      render: () => <LauncherRailInteractiveDemo />,
    },
  ],
};
