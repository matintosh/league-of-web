/**
 * Runes fixtures — demo data for RunesScreen.
 *
 * All icon URLs are verified HTTP 200 from DDragon (version-independent perk-images path).
 * Art URLs use championSplashUrl which is also version-independent.
 *
 * DDragon perk-images base: https://ddragon.leagueoflegends.com/cdn/img/perk-images
 */

import { championSplashUrl } from "./ddragon";

const DDRAGON_PERKS = "https://ddragon.leagueoflegends.com/cdn/img/perk-images";

// ---------------------------------------------------------------------------
// Rune path definitions (5 paths, DDragon numeric IDs)
// All iconUrls verified HTTP 200 (2026-07)
// ---------------------------------------------------------------------------

export type RunePathId = 7200 | 7201 | 7202 | 7203 | 7204;

export interface RunePathFixture {
  id: RunePathId;
  name: string;
  /** Verified HTTP 200: DDragon perk-images/Styles/{id}_{name}.png */
  iconUrl: string;
}

/**
 * "All runes" glyph — DDragon's real diamond-swirl emblem (the leading
 * clear-filter control in the runes toolbar). Verified HTTP 200 (2026-07).
 * DDragon ships it gold; the reference renders it cool-grey, so consumers
 * desaturate it via CSS filter (grayscale/brightness) rather than fetching a
 * recolored asset.
 * Source: DDragon perk-images/Styles/RunesIcon.png
 */
export const runesGlyphIconUrl = (): string =>
  `${DDRAGON_PERKS}/Styles/RunesIcon.png`;

/** The five Rune paths with verified DDragon icon URLs */
export const RUNE_PATHS: Record<RunePathId, RunePathFixture> = {
  7200: {
    id: 7200,
    name: "Domination",
    iconUrl: `${DDRAGON_PERKS}/Styles/7200_Domination.png`,
  },
  7201: {
    id: 7201,
    name: "Precision",
    iconUrl: `${DDRAGON_PERKS}/Styles/7201_Precision.png`,
  },
  7202: {
    id: 7202,
    name: "Sorcery",
    iconUrl: `${DDRAGON_PERKS}/Styles/7202_Sorcery.png`,
  },
  7203: {
    id: 7203,
    name: "Inspiration",
    // DDragon stores Inspiration as "Whimsy" in the numbered filename
    iconUrl: `${DDRAGON_PERKS}/Styles/7203_Whimsy.png`,
  },
  7204: {
    id: 7204,
    name: "Resolve",
    iconUrl: `${DDRAGON_PERKS}/Styles/7204_Resolve.png`,
  },
};

/**
 * The five Rune paths in the toolbar's reference display order:
 * Precision, Domination, Sorcery, Resolve, Inspiration.
 *
 * `RUNE_PATHS` is an id-keyed lookup, so `Object.values(RUNE_PATHS)` iterates in
 * ascending numeric-id order (7200→7204 = Domination, Precision, Sorcery,
 * Inspiration, Resolve) — NOT the client's order. Consumers rendering the path
 * filter row must use this explicit array to match the reference.
 */
export const RUNE_PATHS_ORDERED: RunePathFixture[] = [
  RUNE_PATHS[7201], // Precision
  RUNE_PATHS[7200], // Domination
  RUNE_PATHS[7202], // Sorcery
  RUNE_PATHS[7204], // Resolve
  RUNE_PATHS[7203], // Inspiration
];

// ---------------------------------------------------------------------------
// Demo rune pages (3 preset pages, matching reference screenshot)
// ---------------------------------------------------------------------------

export interface RunePageFixture {
  id: string;
  name: string;
  isPreset: boolean;
  primaryPath: RunePathFixture;
  secondaryPath: RunePathFixture;
  primaryRunes: string[];
  secondaryRunes: string[];
  artUrl?: string;
  /** Verified HTTP 200 */
  keystoneIconUrl?: string;
  /** Verified HTTP 200 */
  secondaryIconUrl?: string;
}

export const demoRunePages: RunePageFixture[] = [
  {
    id: "preset-precision",
    name: "Precision: The Perfect",
    isPreset: true,
    primaryPath: RUNE_PATHS[7201],
    secondaryPath: RUNE_PATHS[7200],
    primaryRunes: ["Conqueror", "Triumph", "Legend: Alacrity", "Coup de Grace"],
    secondaryRunes: ["Taste of Blood", "Ravenous Hunter"],
    // Zed splash as dark warrior art (verified DDragon path)
    artUrl: championSplashUrl("Zed", 0),
    // Verified HTTP 200: Conqueror keystone
    keystoneIconUrl: `${DDRAGON_PERKS}/Styles/Precision/Conqueror/Conqueror.png`,
    // Verified HTTP 200: Taste of Blood (Domination secondary — GreenTerror variant)
    secondaryIconUrl: `${DDRAGON_PERKS}/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png`,
  },
  {
    id: "preset-domination",
    name: "Domination: The Executioner",
    isPreset: true,
    primaryPath: RUNE_PATHS[7200],
    secondaryPath: RUNE_PATHS[7201],
    primaryRunes: ["Electrocute", "Taste of Blood", "Eyeball Collection", "Ravenous Hunter"],
    secondaryRunes: ["Coup de Grace", "Legend: Alacrity"],
    // Katarina splash (dark, magic themed)
    artUrl: championSplashUrl("Katarina", 0),
    // Verified HTTP 200: Electrocute keystone
    keystoneIconUrl: `${DDRAGON_PERKS}/Styles/Domination/Electrocute/Electrocute.png`,
    // Verified HTTP 200: Coup de Grace (Precision secondary)
    secondaryIconUrl: `${DDRAGON_PERKS}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`,
  },
  {
    id: "preset-sorcery",
    name: "Sorcery: The Calamity",
    isPreset: true,
    primaryPath: RUNE_PATHS[7202],
    secondaryPath: RUNE_PATHS[7200],
    primaryRunes: ["Arcane Comet", "Manaflow Band", "Absolute Focus", "Gathering Storm"],
    secondaryRunes: ["Taste of Blood", "Ravenous Hunter"],
    // Syndra splash (arcane/sorcery themed)
    artUrl: championSplashUrl("Syndra", 0),
    // Verified HTTP 200: Arcane Comet keystone
    keystoneIconUrl: `${DDRAGON_PERKS}/Styles/Sorcery/ArcaneComet/ArcaneComet.png`,
    // Verified HTTP 200: Taste of Blood secondary (GreenTerror variant)
    secondaryIconUrl: `${DDRAGON_PERKS}/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png`,
  },
];

/** Empty state — no pages, only the CREATE NEW card is visible */
export const emptyRunePages: RunePageFixture[] = [];
