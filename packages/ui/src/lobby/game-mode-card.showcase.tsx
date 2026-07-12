import type { ShowcaseEntry } from "../showcase";
import { GameModeCard } from "./game-mode-card";
import {
  SummonersRiftCrest,
  TftCrest,
  GameModeCardRowDemo,
  GameModeCardRowRealCrests,
} from "./game-mode-card.demo";
import { gameModeMapUrl } from "@low/fixtures";

export const gameModeCardShowcase: ShowcaseEntry = {
  slug: "game-mode-card",
  name: "Game Mode Card",
  area: "lobby",
  description:
    "Game mode selection card: large crest icon, player-count label, and mode name. Supports real CommunityDragon map crest PNGs or inline SVG glyph fallback.",
  variants: [
    {
      name: "Selected (glyph)",
      notes:
        "Single card in selected state — brighter gold icon, gold-1 name. Icon: diamond-square crest (Summoner's Rift SVG glyph).",
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
      name: "Unselected (glyph)",
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
      name: "Mode card row (glyph fallback)",
      notes:
        "All 4 game mode cards in a row — the production PvP mode-select visual. Twisted Treeline is pre-selected. Click to switch selection.",
      render: () => <GameModeCardRowDemo />,
    },
    {
      name: "Real Crest — SR Selected",
      notes:
        "Single card with real CommunityDragon map crest (map_sr.png from parties plugin). Selected state.",
      render: () => (
        <div className="flex justify-center bg-hextech-black p-10">
          <GameModeCard
            icon={<img src={gameModeMapUrl("sr")} alt="" aria-hidden="true" width={128} height={128} style={{ objectFit: "contain" }} />}
            countLabel="5v5"
            name="Summoner's Rift"
            selected
          />
        </div>
      ),
    },
    {
      name: "Real Crests — Row",
      notes:
        "All 4 cards with real CommunityDragon map crest PNGs (sr/tt/ha/tft). This is the production mode-select screen layout. Click to switch.",
      render: () => <GameModeCardRowRealCrests />,
    },
  ],
};
