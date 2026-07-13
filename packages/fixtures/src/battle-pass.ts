/**
 * Battle Pass fixtures — typed dummy data for BattlePassScreen.
 *
 * All art is sourced from DDragon loading art / champion splash as placeholders.
 * In the real client, dedicated event art would be supplied by the event CDN.
 *
 * Era: 2025 "Welcome to Noxus" Battle Pass (V25.S1.1 onward).
 */

import { loadingArtUrl } from "./ddragon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single reward card in a chapter's card grid. */
export interface BattlePassRewardCard {
  /** Unique key within the chapter. */
  id: string;
  /** Art image URL — champion loading art or event asset. */
  artSrc: string;
  /** Short display label shown on hover / in level detail. */
  label: string;
  /** True when the local player has already completed/claimed this card. */
  isOwned: boolean;
  /** True for the card the player is currently progressing toward. */
  isCurrent: boolean;
  /** Chapter-relative display index, 1-based. */
  index: number;
}

/** A single chapter in the Battle Pass chapter overview. */
export interface BattlePassChapter {
  /** Display label, e.g. "CHAPTER IV". */
  label: string;
  /** True when all rewards in this chapter are collected. */
  isComplete: boolean;
  /** True for the chapter the player is currently in. */
  isCurrent: boolean;
  /** Cards in this chapter (typically 4–6). */
  rewards: BattlePassRewardCard[];
}

/** A level reward item shown in the horizontal reward strip. */
export interface BattlePassLevelReward {
  /** Global level number (1-based). */
  level: number;
  /** Art URL for the reward thumbnail. */
  artSrc: string;
  /** Reward name label. */
  label: string;
  /** "FREE" or "PREMIUM" lane. */
  lane: "free" | "premium";
  /** True when reward is unlocked/owned. */
  isUnlocked: boolean;
}

// ---------------------------------------------------------------------------
// Demo chapter data — mirrors the 5-card layout from client-battle-pass-chapters.png
// ---------------------------------------------------------------------------

export const demoBattlePassChapters: BattlePassChapter[] = [
  {
    label: "CHAPTER I",
    isComplete: true,
    isCurrent: false,
    rewards: [
      {
        id: "ch1-r1",
        artSrc: loadingArtUrl("Darius", 0),
        label: "Darius Icon",
        isOwned: true,
        isCurrent: false,
        index: 1,
      },
      {
        id: "ch1-r2",
        artSrc: loadingArtUrl("Katarina", 0),
        label: "Katarina Emote",
        isOwned: true,
        isCurrent: false,
        index: 2,
      },
      {
        id: "ch1-r3",
        artSrc: loadingArtUrl("Draven", 0),
        label: "Draven Ward Skin",
        isOwned: true,
        isCurrent: false,
        index: 3,
      },
      {
        id: "ch1-r4",
        artSrc: loadingArtUrl("Cassiopeia", 0),
        label: "Cassiopeia Spray",
        isOwned: true,
        isCurrent: false,
        index: 4,
      },
    ],
  },
  {
    label: "CHAPTER II",
    isComplete: true,
    isCurrent: false,
    rewards: [
      {
        id: "ch2-r1",
        artSrc: loadingArtUrl("Swain", 0),
        label: "Swain Icon",
        isOwned: true,
        isCurrent: false,
        index: 1,
      },
      {
        id: "ch2-r2",
        artSrc: loadingArtUrl("LeBlanc", 0),
        label: "LeBlanc Emote",
        isOwned: true,
        isCurrent: false,
        index: 2,
      },
      {
        id: "ch2-r3",
        artSrc: loadingArtUrl("Vladimir", 0),
        label: "Vladimir Spray",
        isOwned: true,
        isCurrent: false,
        index: 3,
      },
      {
        id: "ch2-r4",
        artSrc: loadingArtUrl("Urgot", 0),
        label: "Urgot Ward",
        isOwned: true,
        isCurrent: false,
        index: 4,
      },
    ],
  },
  {
    label: "CHAPTER III",
    isComplete: true,
    isCurrent: false,
    rewards: [
      {
        id: "ch3-r1",
        artSrc: loadingArtUrl("Sion", 0),
        label: "Sion Emote",
        isOwned: true,
        isCurrent: false,
        index: 1,
      },
      {
        id: "ch3-r2",
        artSrc: loadingArtUrl("Talon", 0),
        label: "Talon Icon",
        isOwned: true,
        isCurrent: false,
        index: 2,
      },
      {
        id: "ch3-r3",
        artSrc: loadingArtUrl("Kled", 0),
        label: "Kled Spray",
        isOwned: true,
        isCurrent: false,
        index: 3,
      },
      {
        id: "ch3-r4",
        artSrc: loadingArtUrl("Warwick", 0),
        label: "Warwick Nameplate",
        isOwned: true,
        isCurrent: false,
        index: 4,
      },
    ],
  },
  {
    label: "CHAPTER IV",
    isComplete: false,
    isCurrent: true,
    rewards: [
      {
        id: "ch4-r1",
        artSrc: loadingArtUrl("Darius", 1),
        label: "Noxian General Icon",
        isOwned: true,
        isCurrent: false,
        index: 1,
      },
      {
        id: "ch4-r2",
        artSrc: loadingArtUrl("Katarina", 1),
        label: "Shadow Assassin Emote",
        isOwned: true,
        isCurrent: false,
        index: 2,
      },
      {
        id: "ch4-r3",
        artSrc: loadingArtUrl("Draven", 1),
        label: "Glorious Draven Ward",
        isOwned: true,
        isCurrent: false,
        index: 3,
      },
      {
        id: "ch4-r4",
        artSrc: loadingArtUrl("Cassiopeia", 2),
        label: "Noxus Spray",
        isOwned: false,
        isCurrent: true,
        index: 4,
      },
      {
        id: "ch4-r5",
        artSrc: loadingArtUrl("Swain", 2),
        label: "Grand General Portrait",
        isOwned: false,
        isCurrent: false,
        index: 5,
      },
    ],
  },
  {
    label: "CHAPTER V",
    isComplete: false,
    isCurrent: false,
    rewards: [
      {
        id: "ch5-r1",
        artSrc: loadingArtUrl("Darius", 5),
        label: "Final Boss Skin",
        isOwned: false,
        isCurrent: false,
        index: 1,
      },
      {
        id: "ch5-r2",
        artSrc: loadingArtUrl("LeBlanc", 3),
        label: "Noxian Icon",
        isOwned: false,
        isCurrent: false,
        index: 2,
      },
      {
        id: "ch5-r3",
        artSrc: loadingArtUrl("Swain", 3),
        label: "Victory Emote",
        isOwned: false,
        isCurrent: false,
        index: 3,
      },
      {
        id: "ch5-r4",
        artSrc: loadingArtUrl("Vladimir", 1),
        label: "Crimson Icon",
        isOwned: false,
        isCurrent: false,
        index: 4,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Demo level rewards — mirrors the scrollable strip in client-battle-pass-levels.png
// ---------------------------------------------------------------------------

export const demoBattlePassLevelRewards: BattlePassLevelReward[] = [
  { level: 29, artSrc: loadingArtUrl("Darius", 0),      label: "Darius Icon",      lane: "free",    isUnlocked: true  },
  { level: 30, artSrc: loadingArtUrl("Katarina", 0),    label: "Key Fragment",     lane: "free",    isUnlocked: true  },
  { level: 31, artSrc: loadingArtUrl("Draven", 0),      label: "Hextech Chest & Key", lane: "free", isUnlocked: false },
  { level: 32, artSrc: loadingArtUrl("Cassiopeia", 0),  label: "2000 Tokens",      lane: "premium", isUnlocked: false },
  { level: 33, artSrc: loadingArtUrl("Swain", 0),       label: "Emote",            lane: "free",    isUnlocked: false },
  { level: 34, artSrc: loadingArtUrl("LeBlanc", 0),     label: "Ward Skin",        lane: "premium", isUnlocked: false },
  { level: 35, artSrc: loadingArtUrl("Vladimir", 0),    label: "Icon Shard",       lane: "free",    isUnlocked: false },
  { level: 36, artSrc: loadingArtUrl("Urgot", 0),       label: "Spray",            lane: "premium", isUnlocked: false },
];
