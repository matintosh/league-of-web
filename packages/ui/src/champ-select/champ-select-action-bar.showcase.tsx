import type { ShowcaseEntry } from "../showcase";
import { ChampSelectActionBar } from "./champ-select-action-bar";
import {
  ChampSelectActionBarInteractiveDemo,
  ChampSelectActionBarAltSpellsDemo,
} from "./champ-select-action-bar.demo";

// Showcase files are server-safe — no 'use client', no inline handlers.
// Variants that require onClick handlers are delegated to *.demo.tsx client components.

const FLASH_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_flash.png";
const IGNITE_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_dot.png";

export const champSelectActionBarShowcase: ShowcaseEntry = {
  slug: "champ-select-action-bar",
  name: "Champ Select Action Bar",
  area: "champ-select",
  description:
    "Bottom strip bar in both champ-select screens: rune-page dropdown (red-orange border), two summoner-spell icon slots, and an emote button. Presentational — all clicks emit callbacks.",
  variants: [
    {
      name: "Default — Flash + Ignite (no handlers)",
      notes:
        "Rune page 'Sorcery: The Calamity' with Flash and Ignite. No handlers — cursor-default on interactive elements.",
      render: () => (
        <div className="h-14 w-full bg-hextech-black">
          <ChampSelectActionBar
            runePageName="Sorcery: The Calamity"
            spellSrcs={[FLASH_URL, IGNITE_URL]}
          />
        </div>
      ),
    },
    {
      name: "With click handlers (interactive)",
      notes:
        "All handlers wired — cursor-pointer on rune dropdown, spell slots, and emote button. Hover states active.",
      render: () => <ChampSelectActionBarInteractiveDemo />,
    },
    {
      name: "Alternate spells — Ghost + Heal",
      render: () => <ChampSelectActionBarAltSpellsDemo />,
    },
    {
      name: "Spell slots unset (loading state)",
      notes:
        "Empty strings produce grey-4 placeholder squares — matches 'loading' state before spell data resolves.",
      render: () => (
        <div className="h-14 w-full bg-hextech-black">
          <ChampSelectActionBar
            runePageName="Loading…"
            spellSrcs={["", ""]}
          />
        </div>
      ),
    },
    {
      name: "Long rune page name (truncation)",
      notes:
        "Names longer than the 200px dropdown width are truncated with an ellipsis.",
      render: () => (
        <div className="h-14 w-full bg-hextech-black">
          <ChampSelectActionBar
            runePageName="Sorcery: Arcane Comet Annihilation Supreme Build v2"
            spellSrcs={[FLASH_URL, IGNITE_URL]}
          />
        </div>
      ),
    },
  ],
};
