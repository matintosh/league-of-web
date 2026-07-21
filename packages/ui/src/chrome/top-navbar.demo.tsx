"use client";

import { useState } from "react";
import {
  demoWallet,
  navIconUrl,
  navMissionIconUrl,
  rpIconUrl,
  rpTopUpIconUrl,
  blueEssenceIconUrl,
} from "@low/fixtures";
import { HextechButton } from "./hextech-button";
import { CurrencyDisplay } from "./currency-display";
import { RpTopUpButton } from "./rp-top-up-button";
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

const CURRENT_ERA_NAV_ITEMS = [
  { id: "league", label: "League" },
  { id: "tft", label: "TFT" },
];

/** A single stateless nav-band menu glyph button for the current-era cluster. */
function ClusterIcon({
  label,
  src,
  size,
  disabled,
}: {
  label: string;
  src: string;
  size: number;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={[
        "flex h-7 w-7 items-center justify-center transition-opacity duration-150",
        disabled
          ? "cursor-default opacity-40"
          : "cursor-pointer opacity-80 hover:opacity-100",
      ].join(" ")}
    >
      <img src={src} alt="" aria-hidden="true" width={size} height={size} />
    </button>
  );
}

/**
 * Current-era (era shift #384/#386) demo: the right side carries a menu-access
 * ICON CLUSTER (collections/missions/loot/updates/store — real CommunityDragon
 * nav-band SVGs, missions/updates disabled as placeholders), a divider, then the
 * stacked currency block with the 3-state RP top-up disc. Mirrors the live
 * client-shell composition.
 */
export function TopNavbarCurrentEraDemo() {
  const [activeId, setActiveId] = useState("league");
  return (
    <TopNavbar
      playSlot={<HextechButton size="large">Play</HextechButton>}
      navItems={CURRENT_ERA_NAV_ITEMS}
      activeId={activeId}
      onNavigate={setActiveId}
      currencySlot={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ClusterIcon label="Collection" src={navIconUrl("collections")} size={22} />
            <ClusterIcon label="Missions" src={navMissionIconUrl("mission")} size={20} disabled />
            <ClusterIcon label="Loot" src={navIconUrl("loot")} size={22} />
            <ClusterIcon label="Updates" src={navIconUrl("updates-eat")} size={22} disabled />
            <ClusterIcon label="Store" src={navIconUrl("store")} size={20} />
          </div>
          <div className="h-5 w-px shrink-0 bg-gold-5" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <CurrencyDisplay
              wallet={demoWallet}
              onBuyRp={() => {}}
              onBuyBe={() => {}}
              stacked
              showBuyButtons={false}
              rpIconSrc={rpIconUrl()}
              beIconSrc={blueEssenceIconUrl()}
            />
            <RpTopUpButton
              restingSrc={rpTopUpIconUrl("resting")}
              hoverSrc={rpTopUpIconUrl("hover")}
              pressedSrc={rpTopUpIconUrl("pressed")}
              onClick={() => {}}
            />
          </div>
        </div>
      }
      // #531: seat the player slot in a right-aligned column matched to the
      // social-panel width (224px) so it sits ABOVE the docked social panel and
      // the currency block ends with a clear gap before that column. The player
      // slot fills the column: identity toward the social LEFT edge, bell toward
      // the RIGHT edge — mirroring the live client-shell ProfileChip band.
      playerColumnWidth={224}
      playerSlot={
        <div className="flex w-full items-center justify-between">
          <span className="font-body text-sm text-grey-1">Summoner</span>
          <span className="font-body text-sm text-gold-2" aria-hidden="true">
            ⌾
          </span>
        </div>
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
