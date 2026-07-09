"use client";

import { useState } from "react";
import { HextechButton } from "./hextech-button";
import { TopNavbar } from "./top-navbar";

const DEFAULT_NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "collection", label: "Collection" },
  { id: "store", label: "Store" },
  { id: "tft", label: "TFT" },
  { id: "clash", label: "Clash" },
];

export function TopNavbarDefaultDemo() {
  const [activeId, setActiveId] = useState("home");

  return (
    <TopNavbar
      playSlot={<HextechButton size="large">Play</HextechButton>}
      navItems={DEFAULT_NAV_ITEMS}
      activeId={activeId}
      onNavigate={setActiveId}
      currencySlot={
        <span className="font-body text-sm text-gold-2">1 200 RP</span>
      }
      playerSlot={
        <span className="font-body text-sm text-grey-1">Summoner#EUW</span>
      }
    />
  );
}
