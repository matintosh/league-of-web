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
    iconType: "diamond",
  },
  { id: "world-champions", label: "WORLD\nCHAMPIONS: 2025\nSKINS", iconType: "mask" },
  { id: "ranked", label: "RANKED", iconType: "trophy" },
  {
    id: "mordekaiser",
    label: "SAHN-UZAL\nMORDEKAISER",
    thumbnailSrc: championSquareUrl("Mordekaiser"),
    iconType: "diamond",
  },
  {
    id: "diana",
    label: "ECLIPSE ETERNAL\nASPECT DIANA",
    thumbnailSrc: championSquareUrl("Diana"),
    iconType: "crescent",
  },
  { id: "season", label: "SEASON:\nPANDEMONIUM", iconType: "cycle" },
];

const PINNED = { id: "patch-notes", label: "PATCH NOTES", iconType: "patch" as const };

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

const ALL_GLYPH_ITEMS: HomeContentRailItem[] = [
  { id: "g-mask", label: "MASK — WORLD\nCHAMPIONS", iconType: "mask" },
  { id: "g-trophy", label: "TROPHY — RANKED", iconType: "trophy" },
  { id: "g-diamond", label: "DIAMOND — SKIN\nSPOTLIGHT", iconType: "diamond" },
  { id: "g-crescent", label: "CRESCENT — DIANA", iconType: "crescent" },
  { id: "g-cycle", label: "CYCLE — SEASON", iconType: "cycle" },
  { id: "g-default", label: "DEFAULT — GEM\nBULLET FALLBACK" },
];

/**
 * All category glyphs — one row per `iconType` (plus the no-`iconType` gem
 * fallback), none active, so every distinct glyph is visible side by side.
 */
export function HomeContentRailAllGlyphsDemo() {
  // No selection: keep every row inactive so all glyphs render (an active row
  // without a thumbnail would still show its glyph, but this reads cleaner).
  const [activeId, setActiveId] = useState("");

  return (
    <HomeContentRail
      items={ALL_GLYPH_ITEMS}
      activeId={activeId}
      onSelect={setActiveId}
      pinnedItem={{ id: "g-patch", label: "PATCH — PATCH NOTES", iconType: "patch" }}
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
