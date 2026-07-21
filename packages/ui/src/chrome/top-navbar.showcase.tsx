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
    "The slim top navigation bar — play CTA on the left, nav items in the center, currency and controls on the right. The band is a dark art-bleed scrim (translucent hextech-black letting the home key-art show through) with a light frosted-glass backdrop blur (#508, softened to ~6px in #523) so the splash behind it reads clearly through soft frosting. Current era (#384/#386): the right side carries a menu-access icon cluster + stacked currency with an RP top-up disc. Player identity lives in the social-rail ProfileChip / top-right profile chip, not in the band. (In the showcase the band sits on a flat surface, so the blur is only visible in-app over the home splash.)",
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
