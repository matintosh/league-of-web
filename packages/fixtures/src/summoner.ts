import type { ChampionMasteryEntry, EternalEntry, Friend, Summoner, Wallet } from "./types";
import { masteryCrestUrl } from "./cdragon";
import { championSquareUrl } from "./ddragon";

export const demoSummoner: Summoner = {
  gameName: "Matintosh",
  tagLine: "LAS",
  level: 247,
  profileIconId: 5212,
  availability: "online",
};

export const demoWallet: Wallet = { rp: 1350, blueEssence: 48210 };

export const demoFriends: Friend[] = [
  // General group — mix of all availability states
  {
    summoner: { gameName: "Faker", tagLine: "KR1", level: 812, profileIconId: 6402, availability: "in-game" },
    statusText: "League of Legends",
    groupName: "General",
  },
  {
    summoner: { gameName: "Tyler1", tagLine: "NA1", level: 623, profileIconId: 4368, availability: "in-queue" },
    statusText: "Ranked Solo/Duo",
    groupName: "General",
  },
  {
    summoner: { gameName: "Baus", tagLine: "EUW", level: 590, profileIconId: 5205, availability: "away" },
    groupName: "General",
  },
  {
    summoner: { gameName: "Doublelift", tagLine: "NA1", level: 445, profileIconId: 29, availability: "online" },
    statusText: "In the lobby",
    groupName: "General",
  },
  {
    summoner: { gameName: "Sneaky", tagLine: "NA1", level: 301, profileIconId: 1, availability: "offline" },
    groupName: "General",
  },
  // Work group — professional contacts
  {
    summoner: { gameName: "Phreak", tagLine: "NA1", level: 431, profileIconId: 743, availability: "offline" },
    groupName: "Work",
  },
  {
    summoner: { gameName: "RiotAugust", tagLine: "NA1", level: 520, profileIconId: 4294, availability: "in-game" },
    statusText: "League of Legends",
    groupName: "Work",
  },
  {
    summoner: { gameName: "RiotMeddler", tagLine: "NA1", level: 388, profileIconId: 3, availability: "away" },
    statusText: "Busy",
    groupName: "Work",
  },
];

// ---------------------------------------------------------------------------
// Champion Mastery + Eternals demo data — issue #245
// Mirrors the reference screenshot: Blitzcrank (left), Draven (center, highest),
// Nautilus (right), with 3 eternals stat columns.
// ---------------------------------------------------------------------------

/**
 * Demo top-3 champion mastery entries (descending point order).
 * Center entry (Draven, index 1) is the highest and rendered larger per reference.
 */
export const demoMasteryEntries: ChampionMasteryEntry[] = [
  {
    championId: "Blitzcrank",
    championName: "BLITZCRANK",
    championIconSrc: championSquareUrl("Blitzcrank"),
    masteryCrestSrc: masteryCrestUrl(7),
    masteryLevel: 7,
    points: 412105,
    bestGrade: "S+",
  },
  {
    championId: "Draven",
    championName: "DRAVEN",
    championIconSrc: championSquareUrl("Draven"),
    masteryCrestSrc: masteryCrestUrl(7),
    masteryLevel: 7,
    points: 591349,
    bestGrade: "S-",
  },
  {
    championId: "Nautilus",
    championName: "NAUTILUS",
    championIconSrc: championSquareUrl("Nautilus"),
    masteryCrestSrc: masteryCrestUrl(7),
    masteryLevel: 7,
    points: 161225,
    bestGrade: "S+",
  },
];

/**
 * Demo top-3 eternals entries.
 * Eternals have no stable CDragon render URLs across patches; we use champion
 * square art as a visual placeholder (styled circular). The stat labels and
 * values match the reference screenshot.
 *
 * Known divergence (confirmed 2026-07, issue #245): CDragon does not expose
 * per-champion eternals 3D render images at a stable public path. Champion
 * portraits with a teal tint ring serve as the closest available substitute
 * until a reliable URL pattern is found.
 */
export const demoEternalEntries: EternalEntry[] = [
  {
    name: "Structures Destroyed",
    value: 117,
    iconSrc: championSquareUrl("Blitzcrank"),
    championIconSrc: championSquareUrl("Blitzcrank"),
    championId: "Blitzcrank",
  },
  {
    name: "Takedowns",
    value: 786,
    iconSrc: championSquareUrl("Draven"),
    championIconSrc: championSquareUrl("Draven"),
    championId: "Draven",
  },
  {
    name: "Takedowns",
    value: 420,
    iconSrc: championSquareUrl("Nautilus"),
    championIconSrc: championSquareUrl("Nautilus"),
    championId: "Nautilus",
  },
];
