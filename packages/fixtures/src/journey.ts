/**
 * Journey tab fixtures — typed dummy data for JourneyTab + LevelUpRewardsDetail.
 *
 * Era: 2021 NPE redesign (V11.8, April 2021). Reference:
 *   docs/reference/client-home-journey-npe.jpg
 *   docs/reference/client-home-journey-level-rewards.jpg
 */

import { championSquareUrl } from "./ddragon";
import { DDRAGON_VERSION } from "./ddragon";

const DDRAGON_SPELL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell`;

// ---------------------------------------------------------------------------
// Types
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

/** Props for the Champion Starter Pack card (Zone L1). */
export interface StarterPackProps {
  /** Pack display name, e.g. "Bot Lane Pack". */
  label: string;
  /** Champion icons to display in the horizontal strip. */
  champions: ChampionIconEntry[];
  /** Short sub-copy, e.g. "3 Champions + Skins and more!" */
  subCopy: string;
  /** Original (crossed-out) price in BE. */
  originalPrice: number;
  /** Discount percentage, e.g. 89. */
  discountPct: number;
  /** Final (discounted) price in BE. */
  discountedPrice: number;
  /** Called when the buy button is clicked. */
  onPurchase?: () => void;
}

/** Props for the Awakening Missions chain card (Zone L2). */
export interface AwakeningMissionsProps {
  /** Completed missions count. */
  completedCount: number;
  /** Total missions in the chain. */
  totalCount: number;
  /** Reward description copy. */
  rewardCopy: string;
  /** Called when VIEW MISSIONS is clicked. */
  onViewMissions?: () => void;
}

/** One level reward in the Level Up Rewards progress panels (Zones R1 / R2). */
export interface ProgressPanelProps {
  /** Panel heading, e.g. "Level Up Rewards". */
  heading: string;
  /** Sub-copy line. */
  subCopy: string;
  /** Short reward labels shown in the right column, e.g. ["6 Summoner Spells", "Blue Essence"]. */
  rewardLines: string[];
  /** Progress numerator, e.g. 9. */
  current: number;
  /** Progress denominator, e.g. 10. */
  total: number;
  /** Unit label rendered after the counts, e.g. "LEVELS" or "DAYS". */
  unitLabel: string;
  /** Square icon URL for the circular icon cluster (~64px). */
  iconSrc: string;
  /** Optional second icon URL for a 2×2 grid cluster. */
  iconSrc2?: string;
  /** Optional third icon URL. */
  iconSrc3?: string;
  /** Optional fourth icon URL. */
  iconSrc4?: string;
  /** Background atmospheric art URL (blurred, dark forest). */
  bgSrc?: string;
  /** Called when VIEW REWARDS is clicked. */
  onViewRewards?: () => void;
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

/** Props for the full JourneyTab screen. */
export interface JourneyTabProps {
  /** Left column Zone L1: Champion Starter Pack card. */
  starterPack: StarterPackProps;
  /** Left column Zone L2: Awakening Missions chain card. */
  awakeningMissions: AwakeningMissionsProps;
  /** Right column Zone R1: Level Up Rewards progress panel. */
  levelUpRewards: ProgressPanelProps;
  /** Right column Zone R2: Daily Play Rewards progress panel. */
  dailyPlayRewards: ProgressPanelProps;
  /**
   * Active sub-view. "overview" renders the two-column layout.
   * "level-rewards" renders LevelUpRewardsDetail.
   * Shell owns this state — passed down as prop.
   */
  activeView: "overview" | "level-rewards";
  /**
   * Called when the user requests a sub-view change (e.g. VIEW REWARDS click
   * or back navigation from detail).
   */
  onSelectView?: (view: "overview" | "level-rewards") => void;
}

/** Props for the Level Up Rewards detail view. */
export interface LevelUpRewardsDetailProps {
  /** All 10 level reward cards. */
  levels: LevelRewardCard[];
  /** Currently selected level (1-based). */
  selectedLevel: number;
  /** Called when a level card is clicked. */
  onSelectLevel?: (level: number) => void;
  /** Called when the back chevron / breadcrumb is clicked. */
  onBack?: () => void;
}

// ---------------------------------------------------------------------------
// Fixture values
// ---------------------------------------------------------------------------

/** Starter Pack champion icons (Bot Lane Pack — Ashe, MissFortune, Jhin + 2 bonus icons). */
export const STARTER_PACK_CHAMPIONS: ChampionIconEntry[] = [
  { id: "Ashe", name: "Ashe", iconSrc: championSquareUrl("Ashe") },
  { id: "MissFortune", name: "Miss Fortune", iconSrc: championSquareUrl("MissFortune") },
  { id: "Jhin", name: "Jhin", iconSrc: championSquareUrl("Jhin") },
];

export const DEMO_STARTER_PACK: StarterPackProps = {
  label: "Bot Lane Pack",
  champions: STARTER_PACK_CHAMPIONS,
  subCopy: "3 Champions + Skins and more!",
  originalPrice: 5670,
  discountPct: 89,
  discountedPrice: 650,
};

export const DEMO_AWAKENING_MISSIONS: AwakeningMissionsProps = {
  completedCount: 0,
  totalCount: 8,
  rewardCopy:
    "Complete the mission chain to get a Masterwork Chest & Key, plus XP and BE along the way.",
};

export const DEMO_LEVEL_UP_REWARDS: ProgressPanelProps = {
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

export const DEMO_DAILY_PLAY_REWARDS: ProgressPanelProps = {
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
