import type { ShowcaseEntry } from "../showcase";
import { TopNavbar } from "./top-navbar";
import { TopNavbarDefaultDemo } from "./top-navbar.demo";

const STANDARD_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "collection", label: "Collection" },
  { id: "store", label: "Store" },
  { id: "tft", label: "TFT" },
  { id: "clash", label: "Clash" },
];

const MANY_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "collection", label: "Collection" },
  { id: "store", label: "Store" },
  { id: "tft", label: "TFT" },
  { id: "clash", label: "Clash" },
  { id: "loot", label: "Loot" },
  { id: "esports", label: "Esports" },
  { id: "missions", label: "Missions" },
];

export const topNavbarShowcase: ShowcaseEntry = {
  slug: "top-navbar",
  name: "Top Navbar",
  area: "chrome",
  description:
    "The slim top navigation bar — play CTA on the left, nav items in the center, currency and player identity on the right.",
  variants: [
    {
      name: "Default",
      notes: "6 nav items, 'home' active, interactive via useState in demo.",
      render: () => <TopNavbarDefaultDemo />,
    },
    {
      name: "TFT Active",
      notes: "Tests a non-first active item — 'tft' is selected.",
      render: () => (
        <TopNavbar
          playSlot={<span className="font-body text-sm text-gold-2">PLAY</span>}
          navItems={STANDARD_NAV_ITEMS}
          activeId="tft"
          onNavigate={() => {}}
          currencySlot={
            <span className="font-body text-sm text-gold-2">1 200 RP</span>
          }
          playerSlot={
            <span className="font-body text-sm text-grey-1">Summoner#EUW</span>
          }
        />
      ),
    },
    {
      name: "Many Items (overflow test)",
      notes: "9 nav items — should remain on a single line without wrapping.",
      render: () => (
        <TopNavbar
          playSlot={<span className="font-body text-sm text-gold-2">PLAY</span>}
          navItems={MANY_NAV_ITEMS}
          activeId="home"
          onNavigate={() => {}}
          currencySlot={
            <span className="font-body text-sm text-gold-2">1 200 RP</span>
          }
          playerSlot={
            <span className="font-body text-sm text-grey-1">Summoner#EUW</span>
          }
        />
      ),
    },
    {
      name: "Minimal Slots",
      notes: "All three slots are plain <span> placeholders — tests slot flexibility.",
      render: () => (
        <TopNavbar
          playSlot={<span className="font-body text-sm text-grey-1">[play]</span>}
          navItems={STANDARD_NAV_ITEMS}
          activeId="home"
          onNavigate={() => {}}
          currencySlot={<span className="font-body text-sm text-grey-1">[currency]</span>}
          playerSlot={<span className="font-body text-sm text-grey-1">[player]</span>}
        />
      ),
    },
  ],
};
