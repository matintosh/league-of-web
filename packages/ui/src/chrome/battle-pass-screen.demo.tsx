"use client";

import { useState } from "react";
import { BattlePassScreen } from "./battle-pass-screen";
import {
  demoBattlePassChapters,
  demoBattlePassLevelRewards,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Chapter overview demo (default state: CHAPTER IV in progress)
// ---------------------------------------------------------------------------

export function BattlePassChapterOverviewDemo() {
  return (
    <div style={{ width: 1280, height: 720 }}>
      <BattlePassScreen
        eventName="Welcome to Noxus: Act 2"
        endsIn="Ends in 6 weeks"
        chapters={demoBattlePassChapters}
        activeChapterIndex={3}
        currentXp={400}
        totalXp={500}
        playerLevel={30}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Level detail demo (reward selected: Hextech Chest & Key at index 2)
// ---------------------------------------------------------------------------

export function BattlePassLevelDetailDemo() {
  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(2);

  return (
    <div style={{ width: 1280, height: 720 }}>
      <BattlePassScreen
        eventName="Welcome to Noxus: Act 2"
        endsIn="Ends in 6 weeks"
        chapters={demoBattlePassChapters}
        activeChapterIndex={3}
        currentXp={400}
        totalXp={500}
        playerLevel={30}
        selectedLevelIndex={selectedIdx}
        levelRewards={demoBattlePassLevelRewards}
        onSelectLevel={setSelectedIdx}
        onClaim={() => console.log("battle-pass: claim")}
        onPurchasePass={() => console.log("battle-pass: purchase pass")}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Early chapter (Chapter I — all claimed) demo
// ---------------------------------------------------------------------------

export function BattlePassEarlyChapterDemo() {
  return (
    <div style={{ width: 1280, height: 720 }}>
      <BattlePassScreen
        eventName="Welcome to Noxus: Act 2"
        endsIn="Ends in 8 weeks"
        chapters={demoBattlePassChapters}
        activeChapterIndex={0}
        currentXp={500}
        totalXp={500}
        playerLevel={10}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Future chapter (Chapter V — all locked) demo
// ---------------------------------------------------------------------------

export function BattlePassFutureChapterDemo() {
  return (
    <div style={{ width: 1280, height: 720 }}>
      <BattlePassScreen
        eventName="Welcome to Noxus: Act 2"
        endsIn="Ends in 4 weeks"
        chapters={demoBattlePassChapters}
        activeChapterIndex={4}
        currentXp={0}
        totalXp={500}
        playerLevel={30}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal XP (0% progress) demo
// ---------------------------------------------------------------------------

export function BattlePassZeroProgressDemo() {
  return (
    <div style={{ width: 1280, height: 720 }}>
      <BattlePassScreen
        eventName="Welcome to Noxus: Act 2"
        endsIn="Ends in 2 weeks"
        chapters={demoBattlePassChapters}
        activeChapterIndex={3}
        currentXp={0}
        totalXp={500}
        playerLevel={28}
      />
    </div>
  );
}
