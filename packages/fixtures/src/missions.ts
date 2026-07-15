/**
 * Missions / Objectives fixture data — dummy values for the current-era
 * Objectives modal (issue #395). The modal opens from the nav-band Missions
 * icon and mirrors the "Welcome to Noxus" Season 1 Act 1 objectives surface
 * (docs/reference/client-current-objectives-modal.jpg).
 *
 * Fixture values only; never import in @low/ui components — the modal takes its
 * data via props (a category list + a header + a BXP bar). Pages/showcase
 * supply these constants.
 */
import { championSplashUrl, championSquareUrl } from "./ddragon";

/**
 * Shape mirrors the @low/ui `ObjectivesModalProps` data shape without importing
 * from @low/ui (fixtures never depend on ui). Kept as a local structural type so
 * the demo constants stay type-checked.
 */
interface DemoObjectivesData {
  header: {
    eyebrow: string;
    title: string;
    freeRewardLabel: string;
    artSrc: string;
  };
  bxp: {
    currentLevel: number;
    nextLevel: number;
    current: number;
    total: number;
  };
  categories: {
    id: string;
    label: string;
    state?: "complete" | "attention";
  }[];
  activeCategoryId: string;
  sectionLabel: string;
  sectionCount: number;
  missions: {
    id: string;
    current: number;
    total: number;
    title: string;
    subtitle: string;
    rewardIconSrc: string;
    rewardQuantity?: number;
  }[];
}

/**
 * Demo Objectives modal payload — "Welcome to Noxus: Act 1 — Chapter II",
 * EVENTS category active (matches the reference screenshot). Reward icons reuse
 * DDragon champion art as stand-in loot tiles (no dedicated reward CDN in the
 * clone).
 */
export const DEMO_OBJECTIVES: DemoObjectivesData = {
  header: {
    eyebrow: "Welcome to Noxus: Act 1",
    title: "Chapter II",
    freeRewardLabel: "Free Reward: Level 19",
    artSrc: championSplashUrl("Ambessa", 0),
  },
  bxp: {
    currentLevel: 17,
    nextLevel: 18,
    current: 750,
    total: 2000,
  },
  categories: [
    { id: "daily", label: "Daily", state: "complete" },
    { id: "weekly", label: "Weekly", state: "attention" },
    { id: "act-1", label: "Act 1" },
    { id: "events", label: "Events" },
    { id: "mastery", label: "Mastery" },
    { id: "ranked", label: "Ranked" },
  ],
  activeCategoryId: "events",
  sectionLabel: "Events",
  sectionCount: 5,
  missions: [
    {
      id: "ambessa-missions",
      current: 3,
      total: 4,
      title: "Ambessa — The Matriarch of War",
      subtitle: "Complete all Ambessa Missions",
      rewardIconSrc: championSquareUrl("Ambessa"),
      rewardQuantity: 5,
    },
    {
      id: "win-a-game",
      current: 0,
      total: 1,
      title: "Ambessa — The Matriarch of War",
      subtitle: "Win a game of League",
      rewardIconSrc: championSquareUrl("Sivir"),
      rewardQuantity: 500,
    },
    {
      id: "chosen-of-the-wolf",
      current: 2,
      total: 3,
      title: "Chosen of The Wolf",
      subtitle: "Play 3 games with or as any Chosen of The Wolf Champion",
      rewardIconSrc: championSquareUrl("Warwick"),
      rewardQuantity: 6,
    },
    {
      id: "noxian-conquest",
      current: 1,
      total: 5,
      title: "Noxian Conquest",
      subtitle: "Earn 5 kills or assists in a single game",
      rewardIconSrc: championSquareUrl("Darius"),
      rewardQuantity: 250,
    },
    {
      id: "hunt-the-marked",
      current: 0,
      total: 2,
      title: "Hunt the Marked",
      subtitle: "Play 2 games as a Noxian Champion",
      rewardIconSrc: championSquareUrl("Katarina"),
      rewardQuantity: 4,
    },
  ],
};
