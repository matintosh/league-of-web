import type { ShowcaseEntry } from "../showcase";
import {
  StoreSubNavBarDefaultDemo,
  StoreSubNavBarChampionsActiveDemo,
} from "./store-sub-nav-bar.demo";

export const storeSubNavBarShowcase: ShowcaseEntry = {
  slug: "store-sub-nav-bar",
  name: "Store Sub Nav Bar",
  area: "store",
  description:
    "Horizontal tab strip that sits below the main TopNavbar inside the Store section. Contains 7 tabs (FEATURED through ESPORTS) and a gold PURCHASE RP button on the far right.",
  variants: [
    {
      name: "FEATURED active (default)",
      notes:
        "All 7 tabs rendered; FEATURED tab shows gold-1 text and 2px gold-3 bottom border. Click tabs to switch.",
      render: () => <StoreSubNavBarDefaultDemo />,
    },
    {
      name: "CHAMPIONS active",
      notes: "CHAMPIONS tab pre-selected — verifies underline renders on non-first tabs.",
      render: () => <StoreSubNavBarChampionsActiveDemo />,
    },
  ],
};
