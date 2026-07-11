import type { Friend, Summoner, Wallet } from "./types";

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
