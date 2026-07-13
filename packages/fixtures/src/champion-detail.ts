import { DDRAGON_VERSION } from "./ddragon";

// ---------------------------------------------------------------------------
// ChampionDetail fixture type
// ---------------------------------------------------------------------------

/** Damage category label shown in the Overview info panel. */
export type ChampionDamage = "Physical" | "Magic" | "Mixed";

/** One ability entry (passive or active spell). */
export interface AbilityEntry {
  /** Slot key. "P" = passive, "Q" / "W" / "E" / "R" = active spells. */
  key: "P" | "Q" | "W" | "E" | "R";
  /** Ability name, e.g. "Eternal Hunger". */
  name: string;
  /** Plain-text description shown below the icon row. */
  description: string;
  /**
   * Fully-resolved DDragon icon URL.
   * Passive: `…/img/passive/<filename>`
   * Spells:  `…/img/spell/<filename>`
   * Caller supplies the resolved URL; the component renders it as-is.
   */
  iconSrc: string;
}

/** One skin entry used in the Skins tab of the detail overlay. */
export interface ChampionDetailSkin {
  /** Human-readable skin name. */
  name: string;
  /**
   * DDragon loading-art skin index (0 = base).
   * Used to construct loadingArtUrl(champion.id, skinIndex).
   */
  skinIndex: number;
  /** Whether the skin is owned in the demo fixture. */
  owned: boolean;
}

/**
 * Mastery data for a single champion. Passed as an optional prop to
 * `ChampionDetail`; when absent the MASTERY tab renders a "not yet ranked"
 * placeholder state.
 */
export interface ChampionMastery {
  /**
   * Mastery level 1–11+. The component accepts any positive integer so it is
   * era-neutral — callers may pass 7 (pre-2023 max) or 11 (modern max).
   */
  level: number;
  /** Total mastery points accumulated for this champion. */
  points: number;
  /**
   * CommunityDragon mastery crest image URL — resolved by the caller using
   * `masteryCrestUrl()` from `@low/fixtures`.
   * If the URL fails to load, the component falls back to an inline SVG crest.
   */
  masteryCrestSrc: string;
  /**
   * Current milestone label shown in the right sidebar (e.g. "MILESTONE III").
   * Optional — defaults to "MILESTONE I" when omitted.
   */
  currentMilestone?: string;
  /**
   * Checklist rows inside the milestone sidebar. Each entry has a label string
   * and a fulfilled boolean.
   */
  milestoneChecks?: Array<{ label: string; fulfilled: boolean }>;
  /**
   * Reward names listed under "NEXT MILESTONE REWARDS" in the sidebar.
   * E.g. ["Mastery Chair", "x2 Marks of Mastery"].
   */
  nextMilestoneRewards?: string[];
}

/**
 * Data shape consumed by `ChampionDetail`.
 * All fields are presentational — no fetching happens in the component.
 */
export interface ChampionDetail {
  /** DDragon champion id (case-sensitive), e.g. "Warwick". */
  id: string;
  /** Display name, e.g. "Warwick". */
  name: string;
  /** Title line in sentence-case, e.g. "the Uncaged Wrath of Zaun". */
  title: string;
  /** Flavour lore paragraph. */
  lore: string;
  /** Damage category for the Overview info panel. */
  damage: ChampionDamage;
  /**
   * Style fraction 0–1. Drives the dot position on the Style horizontal
   * slider (0 = left glyph / fighter, 1 = right glyph / mage).
   */
  styleFraction: number;
  /**
   * Difficulty rating 1–3. Each filled segment is one pip in the
   * three-segment Difficulty bar.
   */
  difficulty: 1 | 2 | 3;
  /**
   * Five ability entries in display order: P, Q, W, E, R.
   * Exactly five items expected — the component renders all five.
   */
  abilities: [AbilityEntry, AbilityEntry, AbilityEntry, AbilityEntry, AbilityEntry];
  /**
   * Skins available for this champion.
   * Used by the Skins tab via SkinCard grid.
   */
  skins: ChampionDetailSkin[];
}

// ---------------------------------------------------------------------------
// DDragon URL helpers (spell/passive specific)
// ---------------------------------------------------------------------------

const BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

/** Spell icon URL (Q/W/E/R). `filename` = e.g. "WarwickQ.png". */
export const spellIconUrl = (filename: string): string =>
  `${BASE}/img/spell/${filename}`;

/** Passive icon URL. `filename` = e.g. "WarwickP.png". */
export const passiveIconUrl = (filename: string): string =>
  `${BASE}/img/passive/${filename}`;

// ---------------------------------------------------------------------------
// Warwick fixture
// ---------------------------------------------------------------------------

/**
 * Full Warwick champion-detail fixture.
 *
 * Spell/passive icon URLs spot-curled against DDragon 16.13.1 — all return HTTP 200:
 *   img/passive/WarwickP.png → 200
 *   img/spell/WarwickQ.png  → 200
 *   img/spell/WarwickW.png  → 200
 *   img/spell/WarwickE.png  → 200
 *   img/spell/WarwickR.png  → 200
 *
 * Lore + ability text sourced from champion/Warwick.json (16.13.1, en_US).
 * Skin indices match warwickLoadoutSkins (verified).
 */
export const warwickDetail: ChampionDetail = {
  id: "Warwick",
  name: "WARWICK",
  title: "the Uncaged Wrath of Zaun",
  lore:
    "Warwick is a monster who hunts the gray alleys of Zaun. Transformed by agonizing experiments, his body is fused with an intricate system of chambers and pumps, machinery filling his veins with alchemical rage. He bursts from the shadows to prey upon those criminals who terrorize the city's depths. Warwick is drawn to blood, driven mad by its scent… and none who spill it can escape him.",
  damage: "Mixed",
  styleFraction: 0.3,
  difficulty: 2,
  abilities: [
    {
      key: "P",
      name: "Eternal Hunger",
      description:
        "Warwick's basic attacks deal bonus magic damage. If Warwick is below 50% health, he heals the same amount. If Warwick is below 25% health, this healing triples.",
      iconSrc: passiveIconUrl("WarwickP.png"),
    },
    {
      key: "Q",
      name: "Jaws of the Beast",
      description:
        "Warwick lunges forward and bites his target, dealing damage based on their maximum health and healing for damage dealt.",
      iconSrc: spellIconUrl("WarwickQ.png"),
    },
    {
      key: "W",
      name: "Blood Hunt",
      description:
        "Warwick senses enemies below 50% health, gaining Move Speed toward and attack speed against them. When they fall below 25% health, he frenzies and these bonuses triple.",
      iconSrc: spellIconUrl("WarwickW.png"),
    },
    {
      key: "E",
      name: "Primal Howl",
      description:
        "Warwick gains damage reduction for 2.5 seconds. At the end, or if re-activated, he howls, causing nearby enemies to flee for 1 second.",
      iconSrc: spellIconUrl("WarwickE.png"),
    },
    {
      key: "R",
      name: "Infinite Duress",
      description:
        "Warwick leaps in a direction (scaling with his bonus Move Speed), suppressing the first champion he collides with for 1.5 seconds.",
      iconSrc: spellIconUrl("WarwickR.png"),
    },
  ],
  skins: [
    { name: "Warwick", skinIndex: 0, owned: true },
    { name: "Big Bad Warwick", skinIndex: 3, owned: true },
    { name: "Feral Warwick", skinIndex: 5, owned: true },
    { name: "Firefang Warwick", skinIndex: 6, owned: false },
    { name: "Hyena Warwick", skinIndex: 7, owned: false },
  ],
};

// ---------------------------------------------------------------------------
// Warwick mastery fixture — used by MASTERY tab showcase variants
// ---------------------------------------------------------------------------

import { masteryCrestUrl } from "./cdragon";

/**
 * Warwick mastery fixture — Level 11, 111 178 pts, Milestone III in progress.
 * Matches the reference screenshot (client-champion-mastery-tab.png).
 */
export const warwickMastery: ChampionMastery = {
  level: 11,
  points: 111178,
  masteryCrestSrc: masteryCrestUrl(11),
  currentMilestone: "MILESTONE III",
  milestoneChecks: [
    { label: "8/1 Grading S- or higher", fulfilled: false },
    { label: "0/4 Grading C- or higher", fulfilled: false },
  ],
  nextMilestoneRewards: ["Mastery Chair", "x2 Marks of Mastery"],
};

