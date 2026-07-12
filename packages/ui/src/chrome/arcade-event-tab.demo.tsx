"use client";

import { useState } from "react";
import { ArcadeEventTab } from "./arcade-event-tab";
import { championSplashUrl, loadingArtUrl } from "@low/fixtures";

/** Fixture skins for the Arcade 2019 event — supplied by the demo (page-level values). */
const DEMO_SKINS = [
  {
    id: "demacia-vice-garen",
    championName: "Garen",
    skinName: "Demacia Vice",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Garen", 6),
  },
  {
    id: "demacia-vice-lucian",
    championName: "Lucian",
    skinName: "Demacia Vice",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Lucian", 8),
  },
  {
    id: "battle-boss-yasuo",
    championName: "Yasuo",
    skinName: "Battle Boss",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Yasuo", 17),
  },
  {
    id: "arcade-kaisa",
    championName: "Kai'Sa",
    skinName: "Arcade",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Kaisa", 17),
  },
];

export function ArcadeEventTabDemo() {
  const [selectedSkinId, setSelectedSkinId] = useState("battle-boss-yasuo");

  return (
    <div style={{ width: 880, height: 560 }}>
      <ArcadeEventTab
        skins={DEMO_SKINS}
        selectedSkinId={selectedSkinId}
        onSkinSelect={setSelectedSkinId}
        onLearnMore={() => console.log("learn more")}
        onTrailerClick={() => console.log("trailer")}
        onNewChampionClick={() => console.log("new champion")}
        newChampionSplashUrl={championSplashUrl("Qiyana")}
      />
    </div>
  );
}

export function ArcadeEventTabDemoNoSelection() {
  const [selectedSkinId, setSelectedSkinId] = useState<string | undefined>(undefined);

  return (
    <div style={{ width: 880, height: 560 }}>
      <ArcadeEventTab
        skins={DEMO_SKINS}
        selectedSkinId={selectedSkinId}
        onSkinSelect={setSelectedSkinId}
        onLearnMore={() => console.log("learn more")}
        onTrailerClick={() => console.log("trailer")}
        onNewChampionClick={() => console.log("new champion")}
        newChampionSplashUrl={championSplashUrl("Qiyana")}
      />
    </div>
  );
}
