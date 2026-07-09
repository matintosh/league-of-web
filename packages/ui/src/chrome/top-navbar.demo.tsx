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

/** Interactive demo — state-driven active toggling */
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

/** Static variant with the TFT item active */
export function TopNavbarTftActiveDemo() {
  return (
    <TopNavbar
      playSlot={<span className="font-body text-sm text-gold-2">PLAY</span>}
      navItems={DEFAULT_NAV_ITEMS}
      activeId="tft"
      onNavigate={() => {}}
      currencySlot={
        <span className="font-body text-sm text-gold-2">1 200 RP</span>
      }
      playerSlot={
        <span className="font-body text-sm text-grey-1">Summoner#EUW</span>
      }
    />
  );
}

/** Static variant with 9 items to test overflow */
export function TopNavbarManyItemsDemo() {
  return (
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
  );
}

/** Static variant with minimal plain-text slots */
export function TopNavbarMinimalSlotsDemo() {
  return (
    <TopNavbar
      playSlot={<span className="font-body text-sm text-grey-1">[play]</span>}
      navItems={DEFAULT_NAV_ITEMS}
      activeId="home"
      onNavigate={() => {}}
      currencySlot={<span className="font-body text-sm text-grey-1">[currency]</span>}
      playerSlot={<span className="font-body text-sm text-grey-1">[player]</span>}
    />
  );
}
