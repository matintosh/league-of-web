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
  referenceNote: "Real launcher — tab bar (cropped from Overview): floating translucent rounded pill over the hero; Overview / Patch Notes / Esports / Merch; active tab = grey chip + label-width gold underline; Patch Notes has a red notification dot.",
  description:
    "Floating translucent pill tab bar for the launcher center column. Self-sized (not full-width); overlaid on the hero via absolute positioning by the parent. Active tab: grey rounded chip + 2px gold underline (--color-launcher-tab-active) sized to label. Hover: bright text. Default: muted text. Patch Notes badge: showBadge:true on the tab def renders a red dot. Props: tabs[], activeId, onTabChange.",
  variants: [
    {
      name: "Overview active",
      notes: 'activeId="overview" → first tab chip + gold underline.',
      render: () => <TabBarOverviewDemo />,
    },
    {
      name: "Patch Notes active (badge visible)",
      notes: 'activeId="patch-notes" → second tab chip + underline; red dot on Patch Notes.',
      render: () => <TabBarPatchNotesDemo />,
    },
    {
      name: "Esports active",
      notes: 'activeId="esports" → third tab chip + underline.',
      render: () => <TabBarEsportsDemo />,
    },
    {
      name: "Merch active",
      notes: 'activeId="merch" → fourth tab chip + underline.',
      render: () => <TabBarMerchDemo />,
    },
    {
      name: "No active tab",
      notes: "activeId omitted → all tabs muted. No chip or underline.",
      render: () => <TabBarNoActiveDemo />,
    },
    {
      name: "Interactive (click to switch)",
      notes: "Click tabs to switch the active selection. Badge persists on Patch Notes.",
      render: () => <LauncherTabBarInteractiveDemo />,
    },
  ],
};
