"use client";

import { useState } from "react";
import {
  DEMO_STARTER_PACK,
  DEMO_AWAKENING_MISSIONS,
  DEMO_LEVEL_UP_REWARDS,
  DEMO_DAILY_PLAY_REWARDS,
  DEMO_LEVEL_REWARD_CARDS,
} from "@low/fixtures";
import { JourneyTab, LevelUpRewardsDetail } from "./journey-tab";

/** Demo: Journey tab overview (two-column layout). Clicking VIEW REWARDS navigates to the detail. */
export function JourneyTabOverviewDemo() {
  const [showDetail, setShowDetail] = useState(false);

  if (showDetail) {
    return (
      <LevelUpRewardsDetailDemo onBack={() => setShowDetail(false)} />
    );
  }

  return (
    <div style={{ width: "100%", height: 640 }}>
      <JourneyTab
        starterPack={DEMO_STARTER_PACK}
        awakeningMissions={DEMO_AWAKENING_MISSIONS}
        levelUpRewards={DEMO_LEVEL_UP_REWARDS}
        dailyPlayRewards={DEMO_DAILY_PLAY_REWARDS}
        onViewLevelRewards={() => setShowDetail(true)}
      />
    </div>
  );
}

/** Demo: Level Up Rewards detail view (5×2 grid + detail panel). */
export function LevelUpRewardsDetailDemo({ onBack }: { onBack?: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState(1);

  return (
    <div style={{ width: "100%", height: 640 }}>
      <LevelUpRewardsDetail
        levels={DEMO_LEVEL_REWARD_CARDS}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        onBack={onBack}
      />
    </div>
  );
}

/** Demo: Journey tab with zero missions progress. */
export function JourneyTabZeroProgressDemo() {
  return (
    <div style={{ width: "100%", height: 640 }}>
      <JourneyTab
        starterPack={DEMO_STARTER_PACK}
        awakeningMissions={{ ...DEMO_AWAKENING_MISSIONS, completedCount: 0 }}
        levelUpRewards={{ ...DEMO_LEVEL_UP_REWARDS, current: 1 }}
        dailyPlayRewards={{ ...DEMO_DAILY_PLAY_REWARDS, current: 0 }}
      />
    </div>
  );
}

/** Demo: Journey tab with all missions completed. */
export function JourneyTabCompletedDemo() {
  return (
    <div style={{ width: "100%", height: 640 }}>
      <JourneyTab
        starterPack={DEMO_STARTER_PACK}
        awakeningMissions={{ ...DEMO_AWAKENING_MISSIONS, completedCount: 8 }}
        levelUpRewards={{ ...DEMO_LEVEL_UP_REWARDS, current: 10, total: 10 }}
        dailyPlayRewards={{ ...DEMO_DAILY_PLAY_REWARDS, current: 7, total: 7 }}
      />
    </div>
  );
}
