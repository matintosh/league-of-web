"use client";

import { TftHubScreen } from "./tft-hub-screen";
import type { OrbOfEnlightenmentPanelProps, MissionRow, RewardItem, WeeklyMissionsPanelProps, TftBetaPassTrackProps, TftRankBannerProps } from "./tft-hub-screen";
import { profileIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Shared fixture values
// ---------------------------------------------------------------------------

const DEFAULT_ORB: OrbOfEnlightenmentPanelProps = {
  countdownLabel: "AVAILABLE IN 21H 59M 55S",
  progress: 0.45,
  claimable: false,
  onPlay: () => console.log("tft: play"),
  onClaim: () => console.log("tft: claim"),
};

const CLAIMABLE_ORB: OrbOfEnlightenmentPanelProps = {
  countdownLabel: "READY TO CLAIM",
  progress: 1,
  claimable: true,
  onPlay: () => console.log("tft: play"),
  onClaim: () => console.log("tft: claim"),
};

const DEFAULT_RANK: TftRankBannerProps = {
  // TFT bonsai-tree icon (Set 1 launch icon, CDragon profile icon 4069)
  profileIconSrc: profileIconUrl(4069),
  rankLabel: "UNRANKED",
};

const DEFAULT_MISSIONS: MissionRow[] = [
  {
    counters: [{ current: 0, total: 5 }],
    description: "Play 5 games of TFT to Round 20",
    daysLabel: "5 days",
    rewardPts: 50,
  },
  {
    counters: [{ current: 0, total: 30 }, { current: 0, total: 30 }],
    description: "Play 30 Nobles OR Play 30 Pirates",
    daysLabel: "5 days",
    rewardPts: 50,
  },
  {
    counters: [{ current: 0, total: 1 }],
    description: "Mine 20 gold in one stage",
    daysLabel: "5 days",
    rewardPts: 50,
  },
];

const DEFAULT_MISSIONS_PROPS: WeeklyMissionsPanelProps = { missions: DEFAULT_MISSIONS };

const DEFAULT_PASS_ITEMS: RewardItem[] = [
  { id: "1", position: 1, locked: false },
  { id: "2", position: 2, locked: true },
  { id: "3", position: 3, locked: false },
  { id: "4", position: 4, locked: true },
  { id: "5", position: 5, locked: true },
  { id: "6", position: 6, locked: true },
];

const DEFAULT_PASS: TftBetaPassTrackProps = {
  items: DEFAULT_PASS_ITEMS,
  currentPts: 0,
  totalPts: 100,
  onOpenLoot: () => console.log("tft: open loot"),
};

const PARTIAL_PASS: TftBetaPassTrackProps = {
  items: [
    { id: "1", position: 1, locked: false },
    { id: "2", position: 2, locked: false },
    { id: "3", position: 3, locked: true },
    { id: "4", position: 4, locked: true },
    { id: "5", position: 5, locked: true },
    { id: "6", position: 6, locked: true },
  ],
  currentPts: 42,
  totalPts: 100,
  onOpenLoot: () => console.log("tft: open loot"),
};

const SINGLE_COUNTER_MISSIONS: MissionRow[] = [
  {
    counters: [{ current: 2, total: 5 }],
    description: "Play 5 games of TFT to Round 20",
    daysLabel: "3 days",
    rewardPts: 50,
  },
  {
    counters: [{ current: 0, total: 10 }],
    description: "Finish top 4 in 10 games",
    daysLabel: "5 days",
    rewardPts: 50,
  },
  {
    counters: [{ current: 1, total: 1 }],
    description: "Mine 20 gold in one stage",
    daysLabel: "5 days",
    rewardPts: 50,
  },
];

// ---------------------------------------------------------------------------
// Demo components — exported for use in showcase render fns
// ---------------------------------------------------------------------------

export function TftHubScreenDefaultDemo() {
  return (
    <div style={{ width: 1080, height: 620 }}>
      <TftHubScreen
        orb={DEFAULT_ORB}
        rank={DEFAULT_RANK}
        missions={DEFAULT_MISSIONS_PROPS}
        pass={DEFAULT_PASS}
      />
    </div>
  );
}

export function TftHubScreenClaimableDemo() {
  return (
    <div style={{ width: 1080, height: 620 }}>
      <TftHubScreen
        orb={CLAIMABLE_ORB}
        rank={DEFAULT_RANK}
        missions={DEFAULT_MISSIONS_PROPS}
        pass={DEFAULT_PASS}
      />
    </div>
  );
}

export function TftHubScreenSingleCounterDemo() {
  return (
    <div style={{ width: 1080, height: 620 }}>
      <TftHubScreen
        orb={DEFAULT_ORB}
        rank={DEFAULT_RANK}
        missions={{ missions: SINGLE_COUNTER_MISSIONS }}
        pass={DEFAULT_PASS}
      />
    </div>
  );
}

export function TftHubScreenPartialPassDemo() {
  return (
    <div style={{ width: 1080, height: 620 }}>
      <TftHubScreen
        orb={DEFAULT_ORB}
        rank={DEFAULT_RANK}
        missions={DEFAULT_MISSIONS_PROPS}
        pass={PARTIAL_PASS}
      />
    </div>
  );
}
