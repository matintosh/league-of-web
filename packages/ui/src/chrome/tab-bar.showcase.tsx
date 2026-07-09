import type { ShowcaseEntry } from "../showcase";
import {
  TabBarDefaultDemo,
  TabBarSkinsActiveDemo,
  TabBarManyTabsDemo,
  TabBarEmptyDemo,
} from "./tab-bar.demo";

export const tabBarShowcase: ShowcaseEntry = {
  slug: "tab-bar",
  name: "Tab Bar",
  area: "chrome",
  description:
    "Secondary in-screen tab navigation (e.g. Collection: Champions / Skins / Emotes / Ward Skins). Sits below the TopNavbar as a sub-header strip.",
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
      notes: "No tabs provided — renders the bar shell with an empty tablist.",
      render: () => <TabBarEmptyDemo />,
    },
  ],
};
