import type { ShowcaseEntry } from "../showcase";
import {
  TopNavbarDefaultDemo,
  TopNavbarCurrentEraDemo,
  TopNavbarTftActiveDemo,
  TopNavbarManyItemsDemo,
  TopNavbarMinimalSlotsDemo,
} from "./top-navbar.demo";

export const topNavbarShowcase: ShowcaseEntry = {
  slug: "top-navbar",
  name: "Top Navbar",
  area: "chrome",
  description:
    "The slim top navigation bar — play CTA on the left, nav items in the center, currency and controls on the right. Current era (#384/#386): the right side carries a menu-access icon cluster + Your Shop CTA + stacked currency with an RP top-up disc. Player identity lives in the social-rail ProfileChip / top-right profile chip, not in the band.",
  referenceImage: "client-current-home-activity-center.jpg",
  referenceNote:
    "docs/reference/client-current-home-activity-center.jpg — current-era home; nav band is the ~56px top strip (PLAY left, LEAGUE/TFT tabs, right-side icon cluster + currency)",
  variants: [
    {
      name: "Current Era (icon cluster + RP top-up)",
      notes:
        "The #386 rework: right-side menu-access icon cluster (collections/missions/loot/updates/store — real CommunityDragon nav SVGs; missions/updates disabled placeholders), divider, stacked currency + 3-state RP top-up disc. Matches the live client-shell band.",
      render: () => <TopNavbarCurrentEraDemo />,
    },
    {
      name: "Default",
      notes: "6 nav items, 'home' active, interactive via useState in demo.",
      render: () => <TopNavbarDefaultDemo />,
    },
    {
      name: "TFT Active",
      notes: "Tests a non-first active item — 'tft' is selected.",
      render: () => <TopNavbarTftActiveDemo />,
    },
    {
      name: "Many Items (overflow test)",
      notes: "9 nav items — should remain on a single line without wrapping.",
      render: () => <TopNavbarManyItemsDemo />,
    },
    {
      name: "Minimal Slots",
      notes: "All three slots are plain <span> placeholders — tests slot flexibility.",
      render: () => <TopNavbarMinimalSlotsDemo />,
    },
  ],
};
