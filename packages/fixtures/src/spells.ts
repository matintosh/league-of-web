/**
 * Summoner spell fixtures — demo data for SpellsTab.
 *
 * Icon URLs use DDragon with the "Summoner" prefix — the "Summoner" prefix is
 * REQUIRED. e.g. SummonerFlash.png (200), Flash.png (403).
 *
 * DDragon IDs verified HTTP 200 (2026-07):
 *   Ghost=SummonerHaste, Ignite=SummonerDot, Cleanse=SummonerBoost,
 *   Clarity=SummonerMana, Mark=SummonerSnowball, Smite=SummonerSmite
 *   (others are named as expected: SummonerFlash, SummonerTeleport, etc.)
 */
import { DDRAGON_VERSION, summonerRiftMapUrl } from "./ddragon";

const DDRAGON_SPELL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell`;

/**
 * Shared SR map art used as `previewSrc` for all summoner spells.
 *
 * Known divergence: the real client shows per-spell in-game action renders
 * (overhead screenshots of the spell being cast on SR terrain). No per-spell
 * art is available from public CDNs. We use the DDragon overhead minimap
 * (512×512, olive-green terrain + teal rivers) as the closest available SR
 * atmospheric asset. It blurs into the correct green/teal palette at
 * filter: blur(4px) brightness(0.45) object-cover.
 */
const SPELL_PREVIEW_SRC = summonerRiftMapUrl();

export interface SummonerSpell {
  /** DDragon spell id, e.g. "SummonerFlash" */
  id: string;
  /** Display name shown in the grid and detail panel, e.g. "Flash" */
  name: string;
  /** Icon URL — DDragon with required "Summoner" prefix */
  iconSrc: string;
  /** Full description text */
  description: string;
  /** e.g. "SUMMONER LEVEL 8" */
  unlockLabel: string;
  /** e.g. "Classic, Tutorial, ARAM" */
  modes: string;
  /** Cooldown in seconds */
  cooldownSeconds: number;
  /**
   * Optional splash preview art URL. When absent the right column falls
   * back to bg-blue-8 + centered icon at 96px.
   */
  previewSrc?: string;
}

/** All 11 summoner spells shown in the Collection → Spells tab. */
export const SUMMONER_SPELLS: SummonerSpell[] = [
  {
    id: "SummonerHaste",
    name: "Ghost",
    iconSrc: `${DDRAGON_SPELL}/SummonerHaste.png`,
    description:
      "For 10 seconds, your champion ignores unit collision and has 27% - 45% increased Move Speed.",
    unlockLabel: "SUMMONER LEVEL 1",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 210,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerHeal",
    name: "Heal",
    iconSrc: `${DDRAGON_SPELL}/SummonerHeal.png`,
    description:
      "Restores 90-345 Health and grants 30% Move Speed for 1 second to you and a targeted allied champion.",
    unlockLabel: "SUMMONER LEVEL 1",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 240,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerBarrier",
    name: "Barrier",
    iconSrc: `${DDRAGON_SPELL}/SummonerBarrier.png`,
    description: "Shields your champion for 105-411 damage for 2 seconds.",
    unlockLabel: "SUMMONER LEVEL 4",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 180,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerExhaust",
    name: "Exhaust",
    iconSrc: `${DDRAGON_SPELL}/SummonerExhaust.png`,
    description:
      "Exhausts target enemy champion, reducing their Move Speed by 30% and their damage dealt by 40% for 2.5 seconds.",
    unlockLabel: "SUMMONER LEVEL 4",
    modes: "Classic, Tutorial",
    cooldownSeconds: 210,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerMana",
    name: "Clarity",
    iconSrc: `${DDRAGON_SPELL}/SummonerMana.png`,
    description:
      "Restores 50% of your champion's maximum Mana and restores 25% of nearby allied champions' maximum Mana.",
    unlockLabel: "SUMMONER LEVEL 1",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 240,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerSnowball",
    name: "Mark",
    iconSrc: `${DDRAGON_SPELL}/SummonerSnowball.png`,
    description:
      "Throw a snowball at target enemy champion. If the snowball hits, your champion can quickly travel to the target.",
    unlockLabel: "SUMMONER LEVEL 1",
    modes: "ARAM",
    cooldownSeconds: 80,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerFlash",
    name: "Flash",
    iconSrc: `${DDRAGON_SPELL}/SummonerFlash.png`,
    description:
      "Teleports your champion a short distance toward your cursor's location.",
    unlockLabel: "SUMMONER LEVEL 8",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 300,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerTeleport",
    name: "Teleport",
    iconSrc: `${DDRAGON_SPELL}/SummonerTeleport.png`,
    description:
      "After channeling for 4 seconds, teleports your champion to target allied structure, minion, or ward.",
    unlockLabel: "SUMMONER LEVEL 7",
    modes: "Classic, Tutorial",
    cooldownSeconds: 360,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerBoost",
    name: "Cleanse",
    iconSrc: `${DDRAGON_SPELL}/SummonerBoost.png`,
    description:
      "Removes all disables (excluding suppression and airborne) and summoner spell debuffs affecting your champion and grants 65% Tenacity for 3 seconds.",
    unlockLabel: "SUMMONER LEVEL 7",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 210,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerDot",
    name: "Ignite",
    iconSrc: `${DDRAGON_SPELL}/SummonerDot.png`,
    description:
      "Ignites target enemy champion, dealing 70-410 true damage over 5 seconds and applying Grievous Wounds.",
    unlockLabel: "SUMMONER LEVEL 1",
    modes: "Classic, Tutorial, ARAM",
    cooldownSeconds: 210,
    previewSrc: SPELL_PREVIEW_SRC,
  },
  {
    id: "SummonerSmite",
    name: "Smite",
    iconSrc: `${DDRAGON_SPELL}/SummonerSmite.png`,
    description:
      "Deals 390-1000 true damage (depending on champion level) to target monster or enemy minion.",
    unlockLabel: "SUMMONER LEVEL 10",
    modes: "Classic, Tutorial",
    cooldownSeconds: 15,
    previewSrc: SPELL_PREVIEW_SRC,
  },
];
