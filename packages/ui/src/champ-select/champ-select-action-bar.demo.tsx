"use client";

import { ChampSelectActionBar } from "./champ-select-action-bar";

const FLASH_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_flash.png";
const GHOST_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_haste.png";
const HEAL_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_heal.png";

/** Interactive demo with all click handlers wired — used by showcase. */
export function ChampSelectActionBarInteractiveDemo() {
  return (
    <div className="h-14 w-full bg-hextech-black">
      <ChampSelectActionBar
        runePageName="Precision: Lethal Tempo"
        spellSrcs={[FLASH_URL, GHOST_URL]}
        onRunePageClick={() => {}}
        onSpellClick={() => {}}
        onEmoteClick={() => {}}
      />
    </div>
  );
}

/** Demo for alternate spell pair — Ghost + Heal. */
export function ChampSelectActionBarAltSpellsDemo() {
  return (
    <div className="h-14 w-full bg-hextech-black">
      <ChampSelectActionBar
        runePageName="Domination: Dark Harvest"
        spellSrcs={[GHOST_URL, HEAL_URL]}
        onRunePageClick={() => {}}
        onSpellClick={() => {}}
        onEmoteClick={() => {}}
      />
    </div>
  );
}
