import type { ShowcaseEntry } from "../showcase";
import {
  FilterTabsDefaultDemo,
  FilterTabsWithEndSlotDemo,
  FilterTabsManyTabsDemo,
} from "./filter-tabs.demo";

export const filterTabsShowcase: ShowcaseEntry = {
  slug: "filter-tabs",
  name: "Filter Tabs",
  area: "chrome",
  description:
    "Labeled filter row used on content-browse pages (e.g. Universe explore) to switch between content categories, with an optional right-aligned sort slot.",
  variants: [
    {
      name: "Default",
      notes:
        "Universe explore tabs — 'Everything' active by default. Click tabs to switch (interactive via useState in demo).",
      render: () => <FilterTabsDefaultDemo />,
    },
    {
      name: "With End Slot",
      notes:
        "Includes a right-aligned sort control in the endSlot — 'SORT BY Newest ▾'.",
      render: () => <FilterTabsWithEndSlotDemo />,
    },
    {
      name: "Many Tabs",
      notes: "8 tabs — verifies layout holds across a wider set of items.",
      render: () => <FilterTabsManyTabsDemo />,
    },
  ],
};
