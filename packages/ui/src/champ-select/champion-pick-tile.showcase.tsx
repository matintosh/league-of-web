import type { ShowcaseEntry } from "../showcase";
import { ChampionPickTile } from "./champion-pick-tile";
import { ChampionPickTileGridDemo } from "./champion-pick-tile.demo";

/**
 * Showcase entries for ChampionPickTile.
 * Covers: default, hover (noted), selected, disabled-taken, badge variants,
 * and a multi-tile grid row that matches the pick-phase grid layout.
 */
export const championPickTileShowcase: ShowcaseEntry = {
  slug: "champion-pick-tile",
  name: "Champion Pick Tile",
  area: "champ-select",
  description:
    "Square champion icon cell used in the pick-phase champion grid. Shows name below; states: default, hover, selected (gold glow), disabled-taken (grayscale). Optional blue hex badge top-right.",
  variants: [
    {
      name: "Default",
      render: () => (
        <ChampionPickTile
          name="Morgana"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Morgana.png"
        />
      ),
    },
    {
      name: "Hover (gold-3 border)",
      notes: "Achieved via CSS group-hover — hover over the tile to see the border upgrade.",
      render: () => (
        <ChampionPickTile
          name="Ryze"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Ryze.png"
        />
      ),
    },
    {
      name: "Selected",
      notes: "gold-2 border + teal drop-shadow glow via filter",
      render: () => (
        <ChampionPickTile
          name="Morgana"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Morgana.png"
          selected
        />
      ),
    },
    {
      name: "Disabled (taken by teammate)",
      notes: "grayscale + opacity-50, aria-disabled, click no-op",
      render: () => (
        <ChampionPickTile
          name="Nidalee"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Nidalee.png"
          disabled
        />
      ),
    },
    {
      name: "With badge (number > 0)",
      notes: "Blue hex chip top-right — mastery badge. badge=6 shown.",
      render: () => (
        <ChampionPickTile
          name="Jhin"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Jhin.png"
          badge={6}
        />
      ),
    },
    {
      name: "Badge = 0 (rendered — not the zero-trap)",
      notes: "badge=0 still renders because the guard is != null, not !badge. Intentional.",
      render: () => (
        <ChampionPickTile
          name="Teemo"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Teemo.png"
          badge={0}
        />
      ),
    },
    {
      name: "Selected + Badge",
      render: () => (
        <ChampionPickTile
          name="Jhin"
          imageSrc="https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/Jhin.png"
          selected
          badge={6}
        />
      ),
    },
    {
      name: "Grid row (6-column layout)",
      notes: "6 tiles in a row — mirrors the pick-phase grid column count.",
      render: () => <ChampionPickTileGridDemo />,
    },
  ],
};
