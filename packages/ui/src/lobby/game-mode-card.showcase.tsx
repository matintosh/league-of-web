import type { ShowcaseEntry } from "../showcase";
import { GameModeCard } from "./game-mode-card";
import {
  SummonersRiftCrest,
  TftCrest,
  GameModeCardRowDemo,
} from "./game-mode-card.demo";

export const gameModeCardShowcase: ShowcaseEntry = {
  slug: "game-mode-card",
  name: "Game Mode Card",
  area: "lobby",
  description:
    "Game mode selection card: large crest icon, player-count label, and mode name. Four cards in a row make up the PvP mode-select screen.",
  variants: [
    {
      name: "Selected",
      notes:
        "Single card in selected state — brighter gold icon, gold-1 name. Icon: diamond-square crest (Summoner's Rift shape).",
      render: () => (
        <div className="flex justify-center bg-hextech-black p-10">
          <GameModeCard
            icon={<SummonersRiftCrest />}
            countLabel="5v5"
            name="Summoner's Rift"
            selected
          />
        </div>
      ),
    },
    {
      name: "Unselected",
      notes:
        "Single card in unselected state — dimmed icon, grey-1 name. Icon: shield crest (TFT shape).",
      render: () => (
        <div className="flex justify-center bg-hextech-black p-10">
          <GameModeCard
            icon={<TftCrest />}
            countLabel="FFA"
            name="Teamfight Tactics"
            selected={false}
          />
        </div>
      ),
    },
    {
      name: "Mode card row",
      notes:
        "All 4 game mode cards in a row — the production PvP mode-select visual. Twisted Treeline is pre-selected. Click to switch selection.",
      render: () => <GameModeCardRowDemo />,
    },
  ],
};
