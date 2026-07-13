"use client";

import { useState } from "react";
import { StatsTab } from "./stats-tab";

// ---------------------------------------------------------------------------
// Empty state — no games played this season
// ---------------------------------------------------------------------------

export function StatsTabDefaultDemo() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <div className="h-[540px] w-full">
      <StatsTab
        playstyle={[
          { role: "Fighter",  value: 0.15 },
          { role: "Mage",     value: 0.15 },
          { role: "Assassin", value: 0.15 },
          { role: "Support",  value: 0.15 },
          { role: "Tank",     value: 0.15 },
        ]}
        seasonLabel="Season 2019"
        seasonStats={{
          gamesPlayed: null,
          timePlayed:  null,
          kdaRatio:    null,
        }}
        searchValue={search}
        onSearchChange={setSearch}
        championFilter={filter}
        onChampionFilterChange={setFilter}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// With data — asymmetric radar polygon
// ---------------------------------------------------------------------------

export function StatsTabWithDataDemo() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <div className="h-[540px] w-full">
      <StatsTab
        playstyle={[
          { role: "Fighter",  value: 0.8 },
          { role: "Mage",     value: 0.4 },
          { role: "Assassin", value: 0.6 },
          { role: "Support",  value: 0.2 },
          { role: "Tank",     value: 0.3 },
        ]}
        seasonLabel="Season 2019"
        seasonStats={{
          gamesPlayed: 142,
          timePlayed:  "243h 12m",
          kdaRatio:    "3.24",
        }}
        searchValue={search}
        onSearchChange={setSearch}
        championFilter={filter}
        onChampionFilterChange={setFilter}
      />
    </div>
  );
}
