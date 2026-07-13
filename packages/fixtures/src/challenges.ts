/**
 * Challenge fixtures — sample data for the Challenges tab (2022+ era, Patch 12.9+).
 *
 * ChallengeItem values are page/fixture-level; components import only the type.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChallengeCategory =
  | "all"
  | "imagination"
  | "expertise"
  | "teamwork-strategy"
  | "veterancy"
  | "collection"
  | "legacy";

/** Challenge tier — mirrors the tier progression in the Challenges system. */
export type ChallengeTier =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger";

export interface ChallengeItem {
  id: string;
  name: string;
  criteria: string;
  scoreContribution: number;
  tier: ChallengeTier;
  category: ChallengeCategory;
  /** Hexagonal token icon URL — supply via CDragon or a placeholder. */
  tokenIconSrc: string;
  nextRewardLabel: string;
  nextRewardIconSrc?: string;
  /** 0–100 percentage of players who have this challenge completed. */
  playerPercentage?: number;
  progress?: { current: number; total: number };
}

// ---------------------------------------------------------------------------
// Sample challenges — names sourced from the 2022 reference screenshot.
// ---------------------------------------------------------------------------

const PLACEHOLDER_TOKEN =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/challenges/tokens/challenge-token-placeholder.png";

export const SAMPLE_CHALLENGES: ChallengeItem[] = [
  {
    id: "monster-hunter",
    name: "Monster Hunter",
    criteria: "Slay epic monsters within 90 seconds of them spawning",
    scoreContribution: 15,
    tier: "gold",
    category: "imagination",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "30 Achievement Points",
    playerPercentage: 12.4,
    progress: { current: 3, total: 5 },
  },
  {
    id: "always-on-time",
    name: "Always On Time",
    criteria: "Slay 75 Epic monsters within 90 seconds of them spawning",
    scoreContribution: 100,
    tier: "diamond",
    category: "imagination",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "Slayer Title",
    nextRewardIconSrc: undefined,
    playerPercentage: 3.5,
    progress: { current: 200, total: 300 },
  },
  {
    id: "two-shells-better-than-one",
    name: "Two Shells Are Better Than One",
    criteria: "As a team, take both Rift Heralds in a game",
    scoreContribution: 30,
    tier: "silver",
    category: "teamwork-strategy",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "40 Achievement Points",
    playerPercentage: 18.2,
    progress: { current: 1, total: 3 },
  },
  {
    id: "soul-sweep",
    name: "Soul Sweep",
    criteria: "Claim Dragon Souls 4-0",
    scoreContribution: 30,
    tier: "silver",
    category: "teamwork-strategy",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "50 Achievement Points",
    playerPercentage: 7.8,
    progress: { current: 0, total: 4 },
  },
  {
    id: "can-of-worms",
    name: "Can of Worms",
    criteria: "Slay 3 Dragons in a single game",
    scoreContribution: 30,
    tier: "silver",
    category: "veterancy",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "Dragon Hunter Icon",
    playerPercentage: 22.1,
    progress: { current: 2, total: 3 },
  },
  {
    id: "draconic-extinction",
    name: "Dragonic Extinction",
    criteria: "Slay 2 Elder Dragons in a single game",
    scoreContribution: 30,
    tier: "master",
    category: "veterancy",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "Elder Dragon Badge",
    playerPercentage: 1.1,
    progress: { current: 0, total: 2 },
  },
  {
    id: "slayer",
    name: "Slayer",
    criteria: "Achieve 10 or more kills in a single game",
    scoreContribution: 15,
    tier: "gold",
    category: "expertise",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "Smite-A-Lot Emote",
    playerPercentage: 34.6,
    progress: { current: 7, total: 10 },
  },
  {
    id: "absolute-unit",
    name: "Absolute Unit",
    criteria: "Deal over 50,000 damage to champions in a single game",
    scoreContribution: 15,
    tier: "bronze",
    category: "expertise",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "20 Achievement Points",
    playerPercentage: 41.3,
    progress: { current: 0, total: 1 },
  },
  {
    id: "collector",
    name: "The Collector",
    criteria: "Own 50 or more champion skins",
    scoreContribution: 40,
    tier: "silver",
    category: "collection",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "Collector's Edge Icon",
    playerPercentage: 9.7,
    progress: { current: 12, total: 50 },
  },
  {
    id: "veteran-summoner",
    name: "Veteran Summoner",
    criteria: "Reach Summoner Level 200",
    scoreContribution: 20,
    tier: "gold",
    category: "legacy",
    tokenIconSrc: PLACEHOLDER_TOKEN,
    nextRewardLabel: "Veteran Icon",
    playerPercentage: 15.3,
    progress: { current: 247, total: 200 },
  },
];
