"use client";

import { useState } from "react";
import { ChampionPickTile } from "./champion-pick-tile";

const DEMO_CHAMPIONS = [
  { id: "Morgana", name: "Morgana", badge: 6 },
  { id: "Ryze", name: "Ryze", badge: 6 },
  { id: "Jhin", name: "Jhin", badge: 6 },
  { id: "Nidalee", name: "Nidalee", badge: 6 },
  { id: "Teemo", name: "Teemo", badge: 6 },
  { id: "Warwick", name: "Warwick" },
];

/**
 * Interactive grid row demo — six tiles, click to select.
 * The last tile (Warwick) starts disabled to show the taken state.
 */
export function ChampionPickTileGridDemo() {
  const [selected, setSelected] = useState<string | null>("Morgana");

  return (
    <div className="flex flex-wrap gap-1">
      {DEMO_CHAMPIONS.map((champ, i) => (
        <ChampionPickTile
          key={champ.id}
          name={champ.name}
          imageSrc={`https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/${champ.id}.png`}
          selected={selected === champ.id}
          disabled={i === DEMO_CHAMPIONS.length - 1}
          badge={champ.badge}
          onSelect={() => setSelected(champ.id)}
        />
      ))}
    </div>
  );
}
