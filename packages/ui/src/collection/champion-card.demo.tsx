"use client";
import { useState } from "react";
import { ChampionCard } from "./champion-card";
import { loadingArtUrl, demoChampions } from "@low/fixtures";

export function ChampionCardClickableDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="p-6 flex gap-4 flex-wrap">
      {demoChampions.slice(0, 4).map((c) => (
        <ChampionCard
          key={c.id}
          champion={c}
          artSrc={loadingArtUrl(c.id)}
          onSelect={setSelected}
        />
      ))}
      {selected && (
        <p className="w-full font-body text-sm text-gold-1 mt-2">Selected: {selected}</p>
      )}
    </div>
  );
}
