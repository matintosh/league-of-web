"use client";

import { EndOfGameScreen } from "./end-of-game-screen";
import type { ObjectiveIconMap } from "./end-of-game-screen";
import type {
  EndOfGameResult,
  ScoreboardPlayer,
  ScoreboardTeam,
  TeamSide,
  ScoreboardRole,
} from "@low/fixtures";
import {
  championSquareUrl,
  itemIconUrl,
  scoreboardRoleIconUrl,
  masteryBannerUrl,
  matchHistoryIconUrl,
  objectiveIconUrl,
  postgameAssetUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Resolved icon props shared by every variant (types-not-values: VALUES live
// here in the demo, built from the fixture helpers).
// ---------------------------------------------------------------------------

const OBJECTIVE_ICONS: ObjectiveIconMap = {
  dragon: { blue: objectiveIconUrl("dragon", "blue"), red: objectiveIconUrl("dragon", "red") },
  baron: { blue: objectiveIconUrl("baron", "blue"), red: objectiveIconUrl("baron", "red") },
  herald: { blue: objectiveIconUrl("herald", "blue"), red: objectiveIconUrl("herald", "red") },
  tower: { blue: objectiveIconUrl("tower", "blue"), red: objectiveIconUrl("tower", "red") },
  inhibitor: { blue: objectiveIconUrl("inhibitor", "blue"), red: objectiveIconUrl("inhibitor", "red") },
};

const CHAMPION_FRAME_SRC = matchHistoryIconUrl("champion_frame.png");
const CS_ICON_SRC = matchHistoryIconUrl("icon_minions.png");
const GOLD_ICON_SRC = matchHistoryIconUrl("icon_gold.png");
const LEAVER_ICON_SRC = postgameAssetUrl("icon-sr-leaver.png");
const VICTORY_ICON_SRC = postgameAssetUrl("icon-sr-victory.png");
const DEFEAT_ICON_SRC = postgameAssetUrl("icon-sr-defeat.png");

// ---------------------------------------------------------------------------
// Player factory
// ---------------------------------------------------------------------------

interface PlayerSeed {
  name: string;
  tag: string;
  champ: string;
  role: ScoreboardRole;
  level: number;
  kda: [number, number, number];
  cs: number;
  gold: number;
  items: number[];
  trinket: number;
  mastery: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  score: number;
  isMe?: boolean;
  isLeaver?: boolean;
}

function makePlayer(seed: PlayerSeed): ScoreboardPlayer {
  return {
    summonerName: seed.name,
    tagline: seed.tag,
    championName: seed.champ,
    championIconSrc: championSquareUrl(seed.champ),
    champLevel: seed.level,
    role: seed.role,
    roleIconSrc: scoreboardRoleIconUrl(seed.role),
    kda: { kills: seed.kda[0], deaths: seed.kda[1], assists: seed.kda[2] },
    cs: seed.cs,
    gold: seed.gold,
    itemIconSrcs: seed.items.map(itemIconUrl),
    trinketIconSrc: itemIconUrl(seed.trinket),
    masteryLevel: seed.mastery,
    masteryBannerSrc: masteryBannerUrl(seed.mastery),
    score: seed.score,
    isMe: seed.isMe,
    isLeaver: seed.isLeaver,
  };
}

// Common trinkets: 3340 Warding Totem, 3363 Farsight, 3364 Oracle Lens.
const BLUE_SEEDS: PlayerSeed[] = [
  { name: "Faltering Sun", tag: "Level 14", champ: "Aatrox", role: "fighter", level: 15, kda: [8, 3, 6], cs: 214, gold: 13800, items: [6630, 3071, 3053, 3065, 3047], trinket: 3340, mastery: 6, score: 78, isMe: true },
  { name: "MidnightGank", tag: "Level 21", champ: "LeeSin", role: "assassin", level: 14, kda: [6, 5, 12], cs: 168, gold: 11200, items: [3078, 3053, 3111, 6333], trinket: 3364, mastery: 7, score: 71 },
  { name: "ArcaneWisp", tag: "Level 30", champ: "Ahri", role: "mage", level: 16, kda: [11, 2, 7], cs: 241, gold: 15100, items: [6655, 3020, 3157, 3089, 3135], trinket: 3363, mastery: 7, score: 92 },
  { name: "SharpShooter", tag: "Level 27", champ: "Jinx", role: "marksman", level: 16, kda: [14, 4, 5], cs: 267, gold: 16400, items: [6672, 3006, 3031, 3094, 3072], trinket: 3363, mastery: 5, score: 88 },
  { name: "GuardianOak", tag: "Level 33", champ: "Thresh", role: "support", level: 13, kda: [1, 6, 21], cs: 42, gold: 9600, items: [3190, 3117, 3050], trinket: 3364, mastery: 4, score: 64 },
];

const RED_SEEDS: PlayerSeed[] = [
  { name: "IronWillTop", tag: "Level 19", champ: "Darius", role: "fighter", level: 15, kda: [5, 7, 4], cs: 198, gold: 12100, items: [6630, 3742, 3053, 3071], trinket: 3340, mastery: 5, score: 61 },
  { name: "ShadowStep", tag: "Level 25", champ: "Khazix", role: "assassin", level: 14, kda: [7, 6, 5], cs: 152, gold: 11500, items: [6691, 3814, 3071], trinket: 3364, mastery: 6, score: 66 },
  { name: "RunicScholar", tag: "Level 41", champ: "Syndra", role: "mage", level: 15, kda: [4, 8, 6], cs: 223, gold: 12800, items: [6653, 3020, 3157, 3135], trinket: 3363, mastery: 7, score: 58 },
  { name: "CritMachine", tag: "Level 22", champ: "Kaisa", role: "marksman", level: 15, kda: [6, 9, 3], cs: 231, gold: 13200, items: [3124, 3006, 3094, 3036], trinket: 3363, mastery: 6, score: 55 },
  { name: "WardMother", tag: "Level 18", champ: "Nautilus", role: "support", level: 12, kda: [0, 10, 12], cs: 38, gold: 8400, items: [3190, 3050, 3109], trinket: 3364, mastery: 3, score: 47 },
];

// ---------------------------------------------------------------------------
// Team + result builders
// ---------------------------------------------------------------------------

function makeTeam(
  side: TeamSide,
  won: boolean,
  seeds: PlayerSeed[],
  objectives: ScoreboardTeam["objectives"],
): ScoreboardTeam {
  return { side, won, players: seeds.map(makePlayer), objectives };
}

const BLUE_OBJECTIVES = { dragons: 4, barons: 1, heralds: 1, towers: 9, inhibitors: 2, dragonKinds: ["fire", "air", "water", "earth"] as const };
const RED_OBJECTIVES = { dragons: 1, barons: 0, heralds: 1, towers: 3, inhibitors: 0 };

function buildResult(outcome: "victory" | "defeat", overrides?: Partial<EndOfGameResult>): EndOfGameResult {
  const allyWon = outcome === "victory";
  return {
    outcome,
    queueLabel: "Ranked Solo/Duo",
    durationLabel: "32:14",
    dateLabel: "Today",
    teams: [
      makeTeam("blue", allyWon, BLUE_SEEDS, { ...BLUE_OBJECTIVES, dragonKinds: [...BLUE_OBJECTIVES.dragonKinds] }),
      makeTeam("red", !allyWon, RED_SEEDS, RED_OBJECTIVES),
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Variant wrappers
// ---------------------------------------------------------------------------

export function EndOfGameVictoryDemo() {
  return (
    <div style={{ height: 720 }}>
      <EndOfGameScreen
        result={buildResult("victory")}
        bannerIconSrc={VICTORY_ICON_SRC}
        leaverIconSrc={LEAVER_ICON_SRC}
        csIconSrc={CS_ICON_SRC}
        goldIconSrc={GOLD_ICON_SRC}
        championFrameSrc={CHAMPION_FRAME_SRC}
        objectiveIcons={OBJECTIVE_ICONS}
      />
    </div>
  );
}

export function EndOfGameDefeatDemo() {
  return (
    <div style={{ height: 720 }}>
      <EndOfGameScreen
        result={buildResult("defeat")}
        bannerIconSrc={DEFEAT_ICON_SRC}
        leaverIconSrc={LEAVER_ICON_SRC}
        csIconSrc={CS_ICON_SRC}
        goldIconSrc={GOLD_ICON_SRC}
        championFrameSrc={CHAMPION_FRAME_SRC}
        objectiveIcons={OBJECTIVE_ICONS}
      />
    </div>
  );
}

export function EndOfGameLeaverDemo() {
  // Defeat with a leaver on the ally team (4v5 feel).
  const result = buildResult("defeat");
  const leaverSeeds = BLUE_SEEDS.map((s, i) =>
    i === 4 ? { ...s, isLeaver: true, kda: [0, 8, 3] as [number, number, number], score: 12 } : s,
  );
  result.teams[0] = makeTeam("blue", false, leaverSeeds, {
    ...BLUE_OBJECTIVES,
    dragonKinds: [...BLUE_OBJECTIVES.dragonKinds],
    dragons: 1,
    barons: 0,
    towers: 2,
    inhibitors: 0,
  });
  result.teams[1] = makeTeam("red", true, RED_SEEDS, {
    dragons: 4,
    barons: 2,
    heralds: 1,
    towers: 10,
    inhibitors: 3,
  });
  return (
    <div style={{ height: 720 }}>
      <EndOfGameScreen
        result={result}
        bannerIconSrc={DEFEAT_ICON_SRC}
        leaverIconSrc={LEAVER_ICON_SRC}
        csIconSrc={CS_ICON_SRC}
        goldIconSrc={GOLD_ICON_SRC}
        championFrameSrc={CHAMPION_FRAME_SRC}
        objectiveIcons={OBJECTIVE_ICONS}
      />
    </div>
  );
}

export function EndOfGameLopsidedDemo() {
  // Victory stomp — ally sweeps every objective, enemy secures none.
  const result = buildResult("victory");
  result.durationLabel = "21:47";
  result.teams[0] = makeTeam("blue", true, BLUE_SEEDS, {
    dragons: 4,
    barons: 1,
    heralds: 2,
    towers: 11,
    inhibitors: 3,
    dragonKinds: ["fire", "fire", "air", "water"],
  });
  result.teams[1] = makeTeam("red", false, RED_SEEDS, {
    dragons: 0,
    barons: 0,
    heralds: 0,
    towers: 0,
    inhibitors: 0,
  });
  return (
    <div style={{ height: 720 }}>
      <EndOfGameScreen
        result={result}
        bannerIconSrc={VICTORY_ICON_SRC}
        leaverIconSrc={LEAVER_ICON_SRC}
        csIconSrc={CS_ICON_SRC}
        goldIconSrc={GOLD_ICON_SRC}
        championFrameSrc={CHAMPION_FRAME_SRC}
        objectiveIcons={OBJECTIVE_ICONS}
      />
    </div>
  );
}
