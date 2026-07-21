"use client";

import { useState } from "react";
import { championSquareUrl } from "@low/fixtures";
import { HomeContentRail } from "./home-content-rail";
import type { HomeContentRailItem } from "./home-content-rail";

const FEATURED_ITEMS: HomeContentRailItem[] = [
  {
    id: "mvp-mf",
    label: "MVP T1\nMISS FORTUNE",
    thumbnailSrc: championSquareUrl("MissFortune"),
  },
  { id: "world-champions", label: "WORLD\nCHAMPIONS: 2025\nSKINS" },
  { id: "ranked", label: "RANKED" },
  {
    id: "mordekaiser",
    label: "SAHN-UZAL\nMORDEKAISER",
    thumbnailSrc: championSquareUrl("Mordekaiser"),
  },
  {
    id: "diana",
    label: "ECLIPSE ETERNAL\nASPECT DIANA",
    thumbnailSrc: championSquareUrl("Diana"),
  },
  { id: "season", label: "SEASON:\nPANDEMONIUM" },
];

const PINNED = { id: "patch-notes", label: "PATCH NOTES" };

/** Default — MVP Miss Fortune active, showing her champion thumbnail. */
export function HomeContentRailDefaultDemo() {
  const [activeId, setActiveId] = useState("mvp-mf");

  return (
    <HomeContentRail
      items={FEATURED_ITEMS}
      activeId={activeId}
      onSelect={setActiveId}
      pinnedItem={PINNED}
    />
  );
}

/** Different active row — Mordekaiser selected, thumbnail moves to his row. */
export function HomeContentRailAltActiveDemo() {
  const [activeId, setActiveId] = useState("mordekaiser");

  return (
    <HomeContentRail
      items={FEATURED_ITEMS}
      activeId={activeId}
      onSelect={setActiveId}
      pinnedItem={PINNED}
    />
  );
}

/** No-thumbnail item active — RANKED has no art, so the gem bullet stays. */
export function HomeContentRailNoThumbDemo() {
  const [activeId, setActiveId] = useState("ranked");

  return (
    <HomeContentRail
      items={FEATURED_ITEMS}
      activeId={activeId}
      onSelect={setActiveId}
      pinnedItem={PINNED}
    />
  );
}

const LONG_LABEL_ITEMS: HomeContentRailItem[] = [
  {
    id: "long-1",
    label: "WORLD CHAMPIONS COLLECTOR'S EDITION 2025 SIGNATURE SKINS",
    thumbnailSrc: championSquareUrl("Ahri"),
  },
  { id: "long-2", label: "LIMITED-TIME PANDEMONIUM BATTLE PASS EVENT" },
  { id: "long-3", label: "RANKED" },
];

/** Long-label wrap — labels without explicit breaks wrap across multiple lines. */
export function HomeContentRailLongLabelDemo() {
  const [activeId, setActiveId] = useState("long-1");

  return (
    <HomeContentRail
      items={LONG_LABEL_ITEMS}
      activeId={activeId}
      onSelect={setActiveId}
      pinnedItem={PINNED}
    />
  );
}
