"use client";

import { useState } from "react";
import { TabBar } from "./tab-bar";

const COLLECTION_TABS = [
  { id: "champions", label: "Champions" },
  { id: "skins", label: "Skins" },
  { id: "emotes", label: "Emotes" },
  { id: "ward-skins", label: "Ward Skins" },
];

const MANY_TABS = [
  { id: "champions", label: "Champions" },
  { id: "skins", label: "Skins" },
  { id: "emotes", label: "Emotes" },
  { id: "ward-skins", label: "Ward Skins" },
  { id: "icons", label: "Icons" },
  { id: "bags", label: "Bags" },
  { id: "eternals", label: "Eternals" },
  { id: "clash-banners", label: "Clash Banners" },
  { id: "tft-arenas", label: "TFT Arenas" },
];

/** Interactive demo — activeId managed by useState, clicking switches tabs */
export function TabBarDefaultDemo() {
  const [activeId, setActiveId] = useState("champions");

  return (
    <TabBar tabs={COLLECTION_TABS} activeId={activeId} onSelect={setActiveId} />
  );
}

/** Static variant with a non-first tab active */
export function TabBarSkinsActiveDemo() {
  return (
    <TabBar tabs={COLLECTION_TABS} activeId="skins" onSelect={() => {}} />
  );
}

/** Many tabs to test overflow clipping behaviour */
export function TabBarManyTabsDemo() {
  const [activeId, setActiveId] = useState("champions");

  return (
    <TabBar tabs={MANY_TABS} activeId={activeId} onSelect={setActiveId} />
  );
}

/** Empty tabs array — renders an empty tablist bar */
export function TabBarEmptyDemo() {
  return <TabBar tabs={[]} activeId="" onSelect={() => {}} />;
}

const MODE_TABS = [
  { id: "pvp", label: "PVP" },
  { id: "coop", label: "CO-OP VS AI", disabled: true },
  { id: "training", label: "TRAINING", disabled: true },
  { id: "create", label: "CREATE CUSTOM", disabled: true, dividerBefore: true },
  { id: "join", label: "JOIN CUSTOM", disabled: true },
];

/** Trophy icon matching the ModeSelectScreen ranked-history button */
function TrophyIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 2h8v5a4 4 0 0 1-8 0V2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M4 3.5H2.5A1.5 1.5 0 0 0 2.5 6.5H4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M12 3.5h1.5a1.5 1.5 0 0 1 0 3H12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="11"
        x2="8"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <line
        x1="5.5"
        y1="13"
        x2="10.5"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * ModeSelect layout — 5 tabs with divider before CREATE CUSTOM,
 * disabled tabs, and trailing trophy icon button.
 * Mirrors the ModeSelectScreen tab bar.
 */
export function TabBarModeSelectDemo() {
  return (
    <TabBar
      tabs={MODE_TABS}
      activeId="pvp"
      onSelect={() => {}}
      label="Game category"
      trailing={
        <button
          type="button"
          aria-label="Ranked history"
          className="flex h-7 w-7 items-center justify-center border border-gold-5 text-grey-2 hover:text-gold-2 hover:border-gold-3 transition-colors duration-150"
        >
          <TrophyIcon />
        </button>
      }
    />
  );
}
