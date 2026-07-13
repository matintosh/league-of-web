"use client";

import { RankedQueuePanel } from "./ranked-queue-panel";
import { rankedMiniCrestUrl, rankedEmblemUrl, rankedUnrankedEmblemUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// All unranked — reference state (demo summoner has no rank)
// ---------------------------------------------------------------------------

export function RankedQueuePanelAllUnrankedDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 700 }}>
      <RankedQueuePanel
        queues={[
          { id: "flex3v3",    label: "FLEX 3V3" },
          { id: "soloduo",    label: "SOLO/DUO" },
          { id: "flex5v5",    label: "FLEX 5V5" },
          { id: "lastSeason", label: "LAST SEASON'S RANK" },
        ]}
        crestSrcFor={() => rankedUnrankedEmblemUrl()}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mixed — some ranked, last season Gold
// ---------------------------------------------------------------------------

export function RankedQueuePanelMixedDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 700 }}>
      <RankedQueuePanel
        queues={[
          { id: "flex3v3",    label: "FLEX 3V3",           rank: "SILVER II" },
          { id: "soloduo",    label: "SOLO/DUO",            rank: "GOLD I" },
          { id: "flex5v5",    label: "FLEX 5V5" },
          { id: "lastSeason", label: "LAST SEASON'S RANK",  rank: "GOLD III" },
        ]}
        crestSrcFor={(id) => {
          if (id === "flex3v3")    return rankedMiniCrestUrl("silver");
          if (id === "soloduo")    return rankedMiniCrestUrl("gold");
          if (id === "lastSeason") return rankedEmblemUrl("Gold");
          return rankedUnrankedEmblemUrl();
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Three queues only (no last-season cell)
// ---------------------------------------------------------------------------

export function RankedQueuePanelThreeQueuesDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 700 }}>
      <RankedQueuePanel
        queues={[
          { id: "flex3v3",  label: "FLEX 3V3" },
          { id: "soloduo",  label: "SOLO/DUO", rank: "PLATINUM II" },
          { id: "flex5v5",  label: "FLEX 5V5" },
        ]}
        crestSrcFor={(id) =>
          id === "soloduo"
            ? rankedMiniCrestUrl("platinum")
            : rankedUnrankedEmblemUrl()
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// All ranked — Grandmaster / Master / Diamond
// ---------------------------------------------------------------------------

export function RankedQueuePanelGrandmasterDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 700 }}>
      <RankedQueuePanel
        queues={[
          { id: "flex3v3",    label: "FLEX 3V3",          rank: "MASTER" },
          { id: "soloduo",    label: "SOLO/DUO",           rank: "GRANDMASTER" },
          { id: "flex5v5",    label: "FLEX 5V5",           rank: "DIAMOND I" },
          { id: "lastSeason", label: "LAST SEASON'S RANK", rank: "GRANDMASTER" },
        ]}
        crestSrcFor={(id) => {
          if (id === "flex3v3")    return rankedMiniCrestUrl("master");
          if (id === "soloduo")    return rankedMiniCrestUrl("grandmaster");
          if (id === "flex5v5")    return rankedMiniCrestUrl("diamond");
          return rankedEmblemUrl("Grandmaster");
        }}
      />
    </div>
  );
}
