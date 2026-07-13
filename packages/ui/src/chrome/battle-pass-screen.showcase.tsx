import type { ShowcaseEntry } from "../showcase";
import {
  BattlePassChapterOverviewDemo,
  BattlePassLevelDetailDemo,
  BattlePassEarlyChapterDemo,
  BattlePassFutureChapterDemo,
  BattlePassZeroProgressDemo,
} from "./battle-pass-screen.demo";

export const battlePassScreenShowcase: ShowcaseEntry = {
  slug: "battle-pass-screen",
  name: "BattlePassScreen",
  area: "chrome",
  description:
    "2025 Battle Pass full-screen — chapter overview with gold checkmark cards and cyan current-card highlight, plus level-detail view with Hextech chest art, scrollable reward strip, and CLAIM / PURCHASE PASS action bar. Era: Welcome to Noxus Act 2 (V25.S1.1).",
  variants: [
    {
      name: "Chapter overview — CHAPTER IV in progress (3 owned, 1 current, 1 locked)",
      notes: "Matches docs/reference/client-battle-pass-chapters.png",
      render: () => <BattlePassChapterOverviewDemo />,
    },
    {
      name: "Level detail — reward selected (Hextech Chest & Key, level 31)",
      notes: "Matches docs/reference/client-battle-pass-levels.png",
      render: () => <BattlePassLevelDetailDemo />,
    },
    {
      name: "Early chapter — CHAPTER I, all cards claimed",
      notes: "All five cards show gold checkmark overlay",
      render: () => <BattlePassEarlyChapterDemo />,
    },
    {
      name: "Future chapter — CHAPTER V, all locked",
      notes: "All cards dimmed with locked overlay; XP bar empty",
      render: () => <BattlePassFutureChapterDemo />,
    },
    {
      name: "Zero progress — CHAPTER IV, XP bar at 0%",
      notes: "Progress bar empty; current-card cyan highlight still active",
      render: () => <BattlePassZeroProgressDemo />,
    },
  ],
};
