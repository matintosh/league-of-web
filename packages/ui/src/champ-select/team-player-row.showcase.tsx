import {
  loadingArtUrl,
  summonerSpellIconUrl,
  summonerObjectMagicUrl,
} from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { TeamPlayerRow } from "./team-player-row";

// Verified DDragon IDs (spot-curled against 16.13.1):
// Ashe, Warwick, Kindred, Lux, Vi — all HTTP 200
// Loading art: 308×560 face-centered tall portrait (the real client's loading
// screen art), NOT the 120² champion square icon.
const ASHE_SRC = loadingArtUrl("Ashe");
const WARWICK_SRC = loadingArtUrl("Warwick");
const KINDRED_SRC = loadingArtUrl("Kindred");
const LUX_SRC = loadingArtUrl("Lux");

// Real CDragon summoner-spell icon URLs — Flash + Ignite (self row) and Flash + Ghost.
const FLASH_SRC = summonerSpellIconUrl("summoner_flash");
const IGNITE_SRC = summonerSpellIconUrl("summonerignite");
const GHOST_SRC = summonerSpellIconUrl("summoner_haste");
const SPELL_PAIR: [string, string] = [FLASH_SRC, IGNITE_SRC];

// Summoner-object "magic" idle loop for the local player (gold side).
const SELF_MAGIC_SRC = summonerObjectMagicUrl("gold", "idle");

export const teamPlayerRowShowcase: ShowcaseEntry = {
  slug: "team-player-row",
  name: "Team Player Row",
  area: "champ-select",
  description:
    "One row in the champ-select team rail: circular champion portrait with state ring (picking = teal pulse, locked = gold), stacked summoner-spell squares, and champion/summoner name text.",
  variants: [
    {
      name: "Picking — other player",
      notes: "state=picking: blue-2 ring with animate-pulse, dark empty portrait, grey-1 label.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64">
          <TeamPlayerRow
            state="picking"
            summonerName="qLxHarlan"
            spellSrcs={SPELL_PAIR}
          />
        </div>
      ),
    },
    {
      name: "Picking — self",
      notes: "isSelf=true while picking: summoner name renders in gold-cream.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64">
          <TeamPlayerRow
            state="picking"
            summonerName="cherwood"
            isSelf
            spellSrcs={SPELL_PAIR}
          />
        </div>
      ),
    },
    {
      name: "Picking — self with ambient magic loop",
      notes:
        "ambientVideoSrc = summonerObjectMagicUrl('gold','idle'): the animated gem/rune flourish behind the local player's active slot. Additive over the static row; hidden under prefers-reduced-motion. Compare to 'Picking — self' (no video).",
      render: () => (
        <div className="bg-blue-7 p-4 w-64">
          <TeamPlayerRow
            state="picking"
            summonerName="cherwood"
            isSelf
            spellSrcs={SPELL_PAIR}
            ambientVideoSrc={SELF_MAGIC_SRC}
          />
        </div>
      ),
    },
    {
      name: "Locked — other player",
      notes: "state=locked: gold-3 ring, champion portrait fills circle, grey-1 champion name.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64">
          <TeamPlayerRow
            state="locked"
            summonerName="Oppeohtelar"
            championName="Ashe"
            portraitSrc={ASHE_SRC}
            spellSrcs={SPELL_PAIR}
          />
        </div>
      ),
    },
    {
      name: "Locked — self",
      notes: "isSelf=true + locked: champion name gold-2, summoner name gold-cream.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64">
          <TeamPlayerRow
            state="locked"
            summonerName="cherwood"
            championName="Warwick"
            portraitSrc={WARWICK_SRC}
            isSelf
            spellSrcs={SPELL_PAIR}
          />
        </div>
      ),
    },
    {
      name: "Team rail — 5-player stack",
      notes: "Full team rail replica: row 3 (Warwick) is self+locked, rows 1 & 4 are picking, rows 2 & 5 locked others.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64 flex flex-col divide-y divide-grey-3">
          <TeamPlayerRow
            state="picking"
            summonerName="qLxHarlan"
            spellSrcs={SPELL_PAIR}
          />
          <TeamPlayerRow
            state="locked"
            summonerName="Oppeohtelar"
            championName="Ashe"
            portraitSrc={ASHE_SRC}
            spellSrcs={SPELL_PAIR}
          />
          <TeamPlayerRow
            state="locked"
            summonerName="cherwood"
            championName="Warwick"
            portraitSrc={WARWICK_SRC}
            isSelf
            spellSrcs={SPELL_PAIR}
          />
          <TeamPlayerRow
            state="picking"
            summonerName="HowarqLqUq"
            spellSrcs={SPELL_PAIR}
          />
          <TeamPlayerRow
            state="locked"
            summonerName="CallMeCallMeStar"
            championName="Kindred"
            portraitSrc={KINDRED_SRC}
            spellSrcs={SPELL_PAIR}
          />
        </div>
      ),
    },
    {
      name: "Locked — no spells",
      notes: "spellSrcs omitted: grey placeholder squares render instead.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64">
          <TeamPlayerRow
            state="locked"
            summonerName="SupportMain"
            championName="Lux"
            portraitSrc={LUX_SRC}
          />
        </div>
      ),
    },
    {
      name: "With CDragon spell icons",
      notes: "Real Flash+Ignite icons from CDragon icons2d — picking state shows spell art even before champion is locked.",
      render: () => (
        <div className="bg-blue-7 p-4 w-64 flex flex-col divide-y divide-grey-3">
          <TeamPlayerRow
            state="picking"
            summonerName="qlxHarlan"
            spellSrcs={[FLASH_SRC, GHOST_SRC]}
          />
          <TeamPlayerRow
            state="locked"
            summonerName="cherwood"
            championName="Warwick"
            portraitSrc={WARWICK_SRC}
            isSelf
            spellSrcs={SPELL_PAIR}
          />
        </div>
      ),
    },
  ],
};
