/**
 * Journey tab fixtures — typed dummy data for JourneyTab + LevelUpRewardsDetail.
 *
 * Era: 2021 NPE redesign (V11.8, April 2021). Reference:
 *   docs/reference/client-home-journey-npe.jpg
 *   docs/reference/client-home-journey-level-rewards.jpg
 *
 * Prop-interface types (StarterPackProps, AwakeningMissionsProps, ProgressPanelProps,
 * JourneyTabProps, LevelUpRewardsDetailProps) live in @low/ui/chrome/journey-tab.
 * This file owns only the data-shape types and fixture values.
 */

import { championSquareUrl, DDRAGON_VERSION } from "./ddragon";

const DDRAGON_SPELL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell`;

// ---------------------------------------------------------------------------
// Data-shape types (pure data, no UI callbacks)
// ---------------------------------------------------------------------------

/** One champion entry in the Starter Pack icon strip. */
export interface ChampionIconEntry {
  /** DDragon champion id, e.g. "Ashe". Used for square icon + alt text. */
  id: string;
  /** Display name for aria labels. */
  name: string;
  /** Square icon URL (120×120). */
  iconSrc: string;
}

/** One level reward card in the LevelUpRewardsDetail 5×2 grid. */
export interface LevelRewardCard {
  /** Level number, 1-based. */
  level: number;
  /** Primary reward art URL (~140×200). */
  artSrc: string;
  /** Milestone label, e.g. "JOURNEY BEGINS". */
  milestoneLabel: string;
  /** Body description. */
  description: string;
  /** Whether the player has completed this level. */
  isCompleted: boolean;
  /** Whether the level is locked (unreached + not adjacent). */
  isLocked: boolean;
  /** Optional bonus icon URLs (Blue Essence, key) displayed below the card. */
  bonusIcons?: string[];
  /** Reward art tiles shown in the detail panel (~96×96 each). */
  detailArtSrcs: string[];
}

// ---------------------------------------------------------------------------
// Fixture values — types inferred; structural compatibility enforced at the
// call site (client-shell.tsx) against the JourneyTab/LevelUpRewardsDetail props.
// ---------------------------------------------------------------------------

/** Starter Pack champion icons (Bot Lane Pack — Ashe, MissFortune, Jhin). */
export const STARTER_PACK_CHAMPIONS: ChampionIconEntry[] = [
  { id: "Ashe", name: "Ashe", iconSrc: championSquareUrl("Ashe") },
  { id: "MissFortune", name: "Miss Fortune", iconSrc: championSquareUrl("MissFortune") },
  { id: "Jhin", name: "Jhin", iconSrc: championSquareUrl("Jhin") },
];

export const DEMO_STARTER_PACK = {
  label: "Bot Lane Pack",
  champions: STARTER_PACK_CHAMPIONS,
  subCopy: "3 Champions + Skins and more!",
  originalPrice: 5670,
  discountPct: 89,
  discountedPrice: 650,
} as const;

export const DEMO_AWAKENING_MISSIONS = {
  completedCount: 0,
  totalCount: 8,
  rewardCopy:
    "Complete the mission chain to get a Masterwork Chest & Key, plus XP and BE along the way.",
} as const;

export const DEMO_LEVEL_UP_REWARDS = {
  heading: "Level Up Rewards",
  subCopy: "Unlock new maps, spells, and other rewards each time you level up.",
  rewardLines: ["6 Summoner Spells", "Blue Essence"],
  current: 9,
  total: 10,
  unitLabel: "LEVELS",
  iconSrc: `${DDRAGON_SPELL}/SummonerFlash.png`,
  iconSrc2: `${DDRAGON_SPELL}/SummonerTeleport.png`,
  bgSrc: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ashe_0.jpg",
};

export const DEMO_DAILY_PLAY_REWARDS = {
  heading: "Daily Play Rewards",
  subCopy: "Unlock a new champion and other rewards when you play each day.",
  rewardLines: ["Marksman Champion", "Hextech Chest"],
  current: 1,
  total: 7,
  unitLabel: "DAYS",
  iconSrc: championSquareUrl("Ashe"),
  iconSrc2: championSquareUrl("MissFortune"),
  iconSrc3: championSquareUrl("Ezreal"),
  iconSrc4: championSquareUrl("Jinx"),
  bgSrc: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
};

/** 10 level reward cards for LevelUpRewardsDetail. Summoner spells + champions per the reference. */
export const DEMO_LEVEL_REWARD_CARDS: LevelRewardCard[] = [
  {
    level: 1,
    artSrc: `${DDRAGON_SPELL}/SummonerFlash.png`,
    milestoneLabel: "JOURNEY BEGINS",
    description: "Welcome to League! Jump straight into battle with these first two spells.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [
      `${DDRAGON_SPELL}/SummonerFlash.png`,
      `${DDRAGON_SPELL}/SummonerHeal.png`,
    ],
  },
  {
    level: 2,
    artSrc: championSquareUrl("Annie"),
    milestoneLabel: "FIRST CHAMPION",
    description: "Unlock your first free champion. Annie is simple to learn and powerful in lane.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [`${DDRAGON_SPELL}/SummonerFlash.png`],
    detailArtSrcs: [championSquareUrl("Annie")],
  },
  {
    level: 3,
    artSrc: `${DDRAGON_SPELL}/SummonerTeleport.png`,
    milestoneLabel: "NEW SPELL",
    description: "Teleport unlocks — use it to rejoin fights across the map.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [`${DDRAGON_SPELL}/SummonerTeleport.png`],
  },
  {
    level: 4,
    artSrc: `${DDRAGON_SPELL}/SummonerExhaust.png`,
    milestoneLabel: "EXHAUST",
    description: "Slow and weaken enemies. Great for stopping carries in their tracks.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [`${DDRAGON_SPELL}/SummonerExhaust.png`],
  },
  {
    level: 5,
    artSrc: championSquareUrl("Garen"),
    milestoneLabel: "CHAMPION UNLOCK",
    description: "Spin to win! Garen is a durable top-laner perfect for beginners.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [championSquareUrl("Garen")],
  },
  {
    level: 6,
    artSrc: championSquareUrl("Ashe"),
    milestoneLabel: "MARKSMAN UNLOCKED",
    description: "Ashe joins your roster. Master the Frost Archer from the bot lane.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [championSquareUrl("Ashe")],
  },
  {
    level: 7,
    artSrc: `${DDRAGON_SPELL}/SummonerTeleport.png`,
    milestoneLabel: "SPELL UPGRADE",
    description: "Unlock Cleanse and Ignite to expand your summoner spell options.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [
      `${DDRAGON_SPELL}/SummonerBoost.png`,
      `${DDRAGON_SPELL}/SummonerDot.png`,
    ],
  },
  {
    level: 8,
    artSrc: `${DDRAGON_SPELL}/SummonerFlash.png`,
    milestoneLabel: "FLASH UNLOCKED",
    description: "Flash is the most versatile summoner spell. Use it to escape or engage.",
    isCompleted: true,
    isLocked: false,
    bonusIcons: [],
    detailArtSrcs: [`${DDRAGON_SPELL}/SummonerFlash.png`],
  },
  {
    level: 9,
    artSrc: championSquareUrl("MissFortune"),
    milestoneLabel: "ALMOST THERE",
    description: "Miss Fortune joins your collection. Dominate the bot lane with her burst.",
    isCompleted: false,
    isLocked: true,
    bonusIcons: [],
    detailArtSrcs: [championSquareUrl("MissFortune")],
  },
  {
    level: 10,
    artSrc: championSquareUrl("Jinx"),
    milestoneLabel: "JOURNEY COMPLETE",
    description: "You've completed the NPE journey. Let's get Jinxed!",
    isCompleted: false,
    isLocked: true,
    bonusIcons: [],
    detailArtSrcs: [championSquareUrl("Jinx")],
  },
];
