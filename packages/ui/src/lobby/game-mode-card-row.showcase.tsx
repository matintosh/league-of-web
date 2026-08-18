import type { ShowcaseEntry } from "../showcase";
import { GameModeCardRowDemo, GameModeCardRowRealCrests } from "./game-mode-card.demo";

export const gameModeCardRowShowcase: ShowcaseEntry = {
  slug: "game-mode-card-row",
  name: "Game Mode Card Row",
  area: "lobby",
  description:
    "Full PvP mode-select row: 4 GameModeCards + gold separator + selected-state description and queue-type bullet list. Matches the reference client layout.",
  variants: [
    {
      name: "Row with info panel (glyph fallback)",
      notes:
        "All 4 game mode cards + selected-mode description paragraph + queue-type bullet list (◈ diamond glyph; warning item shows triangle icon). Click a card to switch selection and update the panel.",
      render: () => <GameModeCardRowDemo />,
    },
    {
      name: "Row with real crests + info panel",
      notes:
        "Same layout using real CommunityDragon map crest PNGs (sr/tt/ha/tft). Click to switch selection.",
      render: () => <GameModeCardRowRealCrests />,
    },
  ],
};
