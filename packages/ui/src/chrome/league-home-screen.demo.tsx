"use client";

import { useState } from "react";
import { championSplashUrl, championSquareUrl, loadingArtUrl } from "@low/fixtures";
import { LeagueHomeScreen } from "./league-home-screen";
import type { LeagueHomeFeatured, LeagueHomeSkin } from "./league-home-screen";
import { HomeContentRail } from "./home-content-rail";
import type { HomeContentRailItem } from "./home-content-rail";

// The 6 featured rows + pinned PATCH NOTES from the reference. Each rail id maps
// to a featured splash/copy block below.
const RAIL_ITEMS: HomeContentRailItem[] = [
  { id: "mvp-mf", label: "MVP T1\nMISS FORTUNE", thumbnailSrc: championSquareUrl("MissFortune") },
  { id: "world-champions", label: "WORLD\nCHAMPIONS: 2025\nSKINS" },
  { id: "ranked", label: "RANKED" },
  { id: "mordekaiser", label: "SAHN-UZAL\nMORDEKAISER", thumbnailSrc: championSquareUrl("Mordekaiser") },
  { id: "diana", label: "ECLIPSE ETERNAL\nASPECT DIANA", thumbnailSrc: championSquareUrl("Diana") },
  { id: "season", label: "SEASON:\nPANDEMONIUM" },
];

const PINNED = { id: "patch-notes", label: "PATCH NOTES" };

// Per-rail-item featured content (copy + splash + skins strip).
const MF_FEATURED: LeagueHomeFeatured = {
  eyebrow: "NEW SKIN",
  title: "MVP T1\nMISS FORTUNE",
  body: "Celebrate 2025 Worlds Winners with new skins and the 'Together as 1' Nexus Finisher.",
  splashSrc: championSplashUrl("MissFortune"),
};

const FEATURED: Record<string, LeagueHomeFeatured> = {
  "mvp-mf": MF_FEATURED,
  mordekaiser: {
    eyebrow: "NEW SKIN",
    title: "SAHN-UZAL\nMORDEKAISER",
    body: "The fallen general returns. Wield the ascended armor of Sahn-Uzal in this legendary skin.",
    splashSrc: championSplashUrl("Mordekaiser"),
  },
};

const MF_SKINS: LeagueHomeSkin[] = [
  { id: "mvp-mf-skin", name: "MVP T1 Miss Fortune", artSrc: loadingArtUrl("MissFortune", 0), owned: true },
  { id: "together-as-1", name: "'Together as 1' Nexus Finisher", artSrc: championSplashUrl("MissFortune", 4) },
];

const MORDE_SKINS: LeagueHomeSkin[] = [
  { id: "sahn-uzal", name: "Sahn-Uzal Mordekaiser", artSrc: loadingArtUrl("Mordekaiser", 0) },
  { id: "morde-border", name: "Sahn-Uzal Signature Border", artSrc: championSplashUrl("Mordekaiser", 1) },
];

/**
 * Interactive demo — owns rail selection + mute state, feeds HomeContentRail in
 * as the railSlot and swaps the featured copy/splash/skins to match the active
 * rail item. Items without dedicated featured content fall back to MF.
 */
export function LeagueHomeScreenDemo({
  initialActiveId = "mvp-mf",
  initialMuted = false,
}: {
  initialActiveId?: string;
  initialMuted?: boolean;
}) {
  const [activeId, setActiveId] = useState(initialActiveId);
  const [muted, setMuted] = useState(initialMuted);

  const featured = FEATURED[activeId] ?? MF_FEATURED;
  const skins = activeId === "mordekaiser" ? MORDE_SKINS : MF_SKINS;

  return (
    <div className="h-[628px] w-full">
      <LeagueHomeScreen
        featured={featured}
        railSlot={
          <HomeContentRail
            items={RAIL_ITEMS}
            activeId={activeId}
            onSelect={setActiveId}
            pinnedItem={PINNED}
          />
        }
        skins={skins}
        onSelectSkin={(id) => console.log("league-home: select skin", id)}
        onGoToStore={() => console.log("league-home: go to store")}
        onToggleMute={() => setMuted((m) => !m)}
        muted={muted}
      />
    </div>
  );
}

/** Unowned-skins variant — both SKINS cards without the Owned badge. */
export function LeagueHomeScreenUnownedDemo() {
  const skins: LeagueHomeSkin[] = MF_SKINS.map((s) => ({ ...s, owned: false }));

  return (
    <div className="h-[628px] w-full">
      <LeagueHomeScreen
        featured={MF_FEATURED}
        railSlot={
          <HomeContentRail
            items={RAIL_ITEMS}
            activeId="mvp-mf"
            onSelect={() => {}}
            pinnedItem={PINNED}
          />
        }
        skins={skins}
        onGoToStore={() => console.log("league-home: go to store")}
        onToggleMute={() => {}}
        muted={false}
      />
    </div>
  );
}
