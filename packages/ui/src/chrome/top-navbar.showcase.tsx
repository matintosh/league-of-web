import type { ShowcaseEntry } from "../showcase";
import {
  TopNavbarDefaultDemo,
  TopNavbarTftActiveDemo,
  TopNavbarManyItemsDemo,
  TopNavbarMinimalSlotsDemo,
} from "./top-navbar.demo";

export const topNavbarShowcase: ShowcaseEntry = {
  slug: "top-navbar",
  name: "Top Navbar",
  area: "chrome",
  description:
    "The slim top navigation bar — play CTA on the left, nav items in the center, currency and controls (social toggle, settings) on the right. Player identity lives in the social rail ProfileChip, not here.",
  variants: [
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
