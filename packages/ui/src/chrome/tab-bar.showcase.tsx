import type { ShowcaseEntry } from "../showcase";
import {
  TabBarDefaultDemo,
  TabBarSkinsActiveDemo,
  TabBarManyTabsDemo,
  TabBarEmptyDemo,
  TabBarModeSelectDemo,
} from "./tab-bar.demo";

export const tabBarShowcase: ShowcaseEntry = {
  slug: "tab-bar",
  name: "Tab Bar",
  area: "chrome",
  description:
    "Secondary in-screen tab navigation (e.g. Collection: Champions / Skins / Emotes / Ward Skins). Sits below the TopNavbar as a sub-header strip. Transparent band (atmospheric bg shows through, no opaque fill and no full-width rule); the active tab carries a near-white label (text-gold-1) and a localized gold underline.",
  variants: [
    {
      name: "Default",
      notes:
        "Collection tabs — 'Champions' active by default. Click tabs to switch (interactive via useState in demo).",
      render: () => <TabBarDefaultDemo />,
    },
    {
      name: "Non-first Tab Active",
      notes: "'Skins' is the active tab — verifies underline renders on any position.",
      render: () => <TabBarSkinsActiveDemo />,
    },
    {
      name: "Many Tabs (overflow test)",
      notes:
        "9 tabs — excess clips without wrapping, matching real client behaviour.",
      render: () => <TabBarManyTabsDemo />,
    },
    {
      name: "Empty",
      notes:
        "No tabs provided — renders the transparent bar shell with an empty tablist (no opaque band, no full-width rule).",
      render: () => <TabBarEmptyDemo />,
    },
    {
      name: "ModeSelect layout (divider + disabled + trailing trophy)",
      notes:
        "5 tabs as seen on ModeSelectScreen: PVP active, CO-OP VS AI / TRAINING / CREATE CUSTOM / JOIN CUSTOM disabled (text-grey-2, no click), thin divider before CREATE CUSTOM, trophy icon button in the trailing slot with a border and divider separator.",
      render: () => <TabBarModeSelectDemo />,
    },
  ],
};
