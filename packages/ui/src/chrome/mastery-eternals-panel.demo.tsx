"use client";

import { MasteryEternalsPanel } from "./mastery-eternals-panel";
import {
  demoMasteryEntries,
  demoEternalEntries,
  masteryCrestUrl,
  championSquareUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Default — all data (reference state)
// ---------------------------------------------------------------------------

export function MasteryEternalsPanelDefaultDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 760 }}>
      <MasteryEternalsPanel
        masteryEntries={demoMasteryEntries}
        eternalEntries={demoEternalEntries}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty mastery — fewer than 3 champions played
// ---------------------------------------------------------------------------

export function MasteryEternalsPanelEmptyMasteryDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 760 }}>
      <MasteryEternalsPanel
        masteryEntries={[]}
        eternalEntries={demoEternalEntries}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty eternals — no eternals earned
// ---------------------------------------------------------------------------

export function MasteryEternalsPanelEmptyEternalsDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 760 }}>
      <MasteryEternalsPanel
        masteryEntries={demoMasteryEntries}
        eternalEntries={[]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Higher mastery levels — level 10 crests
// ---------------------------------------------------------------------------

export function MasteryEternalsPanelHighMasteryDemo() {
  return (
    <div className="bg-hextech-black p-6" style={{ width: 760 }}>
      <MasteryEternalsPanel
        masteryEntries={[
          {
            championId: "Jinx",
            championName: "JINX",
            championIconSrc: championSquareUrl("Jinx"),
            masteryCrestSrc: masteryCrestUrl(10),
            masteryLevel: 10,
            points: 1250000,
            bestGrade: "S+",
          },
          {
            championId: "Ezreal",
            championName: "EZREAL",
            championIconSrc: championSquareUrl("Ezreal"),
            masteryCrestSrc: masteryCrestUrl(10),
            masteryLevel: 10,
            points: 987654,
            bestGrade: "S",
          },
          {
            championId: "Lux",
            championName: "LUX",
            championIconSrc: championSquareUrl("Lux"),
            masteryCrestSrc: masteryCrestUrl(9),
            masteryLevel: 9,
            points: 654321,
            bestGrade: "S-",
          },
        ]}
        eternalEntries={demoEternalEntries}
      />
    </div>
  );
}
