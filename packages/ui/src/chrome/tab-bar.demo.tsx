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
