import type { ShowcaseEntry } from "../showcase";
import {
  TabBarOverviewDemo,
  TabBarPatchNotesDemo,
  TabBarEsportsDemo,
  TabBarMerchDemo,
  TabBarNoActiveDemo,
  LauncherTabBarInteractiveDemo,
} from "./launcher-tab-bar.demo";

export const launcherTabBarShowcase: ShowcaseEntry = {
  slug: "launcher-tab-bar",
  name: "LauncherTabBar",
  area: "launcher",
  referenceImage: "launcher-tab-bar-crop.png",
  referenceNote: "Real launcher — tab bar (cropped from Overview): Overview / Patch Notes / Esports / Merch row with gold underline on active tab",
  description:
    "Horizontal tab bar for the launcher center column (~40px tall). Tabs: Overview / Patch Notes / Esports / Merch. Active tab: 2px gold underline (--color-launcher-tab-active) + bright text (--color-launcher-text-primary). Hover: bright text, no underline. Default: muted text. Props: tabs[], activeId, onTabChange.",
  variants: [
    {
      name: "Overview active",
      notes: 'activeId="overview" → first tab highlighted with 2px gold underline.',
      render: () => <TabBarOverviewDemo />,
    },
    {
      name: "Patch Notes active",
      notes: 'activeId="patch-notes" → second tab highlighted.',
      render: () => <TabBarPatchNotesDemo />,
    },
    {
      name: "Esports active",
      notes: 'activeId="esports" → third tab highlighted.',
      render: () => <TabBarEsportsDemo />,
    },
    {
      name: "Merch active",
      notes: 'activeId="merch" → fourth tab highlighted.',
      render: () => <TabBarMerchDemo />,
    },
    {
      name: "No active tab",
      notes: "activeId omitted → all tabs muted. No underline visible.",
      render: () => <TabBarNoActiveDemo />,
    },
    {
      name: "Interactive (click to switch)",
      notes: "Click tabs to switch the active selection.",
      render: () => <LauncherTabBarInteractiveDemo />,
    },
  ],
};
