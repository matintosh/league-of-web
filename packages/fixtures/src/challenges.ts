/**
 * Challenge fixtures — sample data for the Challenges tab (2022+ era, Patch 12.9+).
 *
 * ChallengeItem values are page/fixture-level; components import only the type.
 */

import { challengeTokenUrl } from "./cdragon";

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
  /**
   * Hexagonal token icon URL — supply via CDragon when available.
   * Omit to render the inline SVG placeholder (no network request).
   */
  tokenIconSrc?: string;
  nextRewardLabel: string;
  nextRewardIconSrc?: string;
  /** 0–100 percentage of players who have this challenge completed. */
  playerPercentage?: number;
  /**
   * Progress toward the current tier threshold.
   * When current >= total the card/tooltip show a "Completed" state.
   */
  progress?: { current: number; total: number };
}

// ---------------------------------------------------------------------------
// Sample challenges — names sourced from the 2022 reference screenshot.
//
// tokenIconSrc wired to real CommunityDragon challenge token PNGs (issue #1048).
// Each id+TIER combo curl-verified HTTP 200 (2026-08-19 — the tier matters:
// a config id can 200 at one tier and 404 at another, so verify the exact pair):
//   101100/master, 101200/master, 600006/silver, 2022000/silver, 303200/silver,
//   101000/master, 202200/gold, 302400/bronze, 103000/master, 500000/gold.
//   (Corrected 102000/gold, 303600/diamond, 201100/silver — all 404 at those
//    tiers with no valid tier — replaced with the master-tier combos above.)
// ---------------------------------------------------------------------------

export const SAMPLE_CHALLENGES: ChallengeItem[] = [
  {
    id: "monster-hunter",
    name: "Monster Hunter",
    criteria: "Slay epic monsters within 90 seconds of them spawning",
    scoreContribution: 15,
    tier: "gold",
    category: "imagination",
    tokenIconSrc: challengeTokenUrl(101100, "master"),
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
    tokenIconSrc: challengeTokenUrl(101200, "master"),
    nextRewardLabel: "Slayer Title",
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
    tokenIconSrc: challengeTokenUrl(600006, "silver"),
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
    tokenIconSrc: challengeTokenUrl(2022000, "silver"),
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
    tokenIconSrc: challengeTokenUrl(303200, "silver"),
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
    tokenIconSrc: challengeTokenUrl(101000, "master"),
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
    tokenIconSrc: challengeTokenUrl(202200, "gold"),
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
    tokenIconSrc: challengeTokenUrl(302400, "bronze"),
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
    tokenIconSrc: challengeTokenUrl(103000, "master"),
    nextRewardLabel: "Collector's Edge Icon",
    playerPercentage: 9.7,
    progress: { current: 12, total: 50 },
  },
  {
    id: "veteran-summoner",
    name: "Veteran Summoner",
    // Level 200 is the GOLD tier threshold — demoSummoner.level = 247 exceeds
    // it, so this challenge is completed. progress.current capped at total to
    // render the "Completed" state in the card and tooltip.
    criteria: "Reach Summoner Level 200",
    scoreContribution: 20,
    tier: "gold",
    category: "legacy",
    tokenIconSrc: challengeTokenUrl(500000, "gold"),
    nextRewardLabel: "Veteran Icon",
    playerPercentage: 15.3,
    progress: { current: 200, total: 200 },
  },
];
