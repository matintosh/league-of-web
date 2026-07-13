import type { ShowcaseEntry } from "../showcase";
import {
  MasteryEternalsPanelDefaultDemo,
  MasteryEternalsPanelEmptyMasteryDemo,
  MasteryEternalsPanelEmptyEternalsDemo,
  MasteryEternalsPanelHighMasteryDemo,
} from "./mastery-eternals-panel.demo";

export const masteryEternalsPanelShowcase: ShowcaseEntry = {
  slug: "mastery-eternals-panel",
  name: "Mastery Eternals Panel",
  area: "chrome",
  description:
    "Dual-column panel (gold-5 hairline frame) on the Profile Overview tab. Left zone: 3 champion mastery columns with CDragon crest art, name, point total, and best grade — center column is larger (highest mastery). Right zone: 3 eternals stat columns with numeric value, label, and small champion icon. Both support empty states. Era: modern client (post-2020, issue #245).",
  variants: [
    {
      name: "Default — all data (reference state)",
      notes:
        "Mirrors the reference screenshot: Blitzcrank / Draven (center, largest) / Nautilus mastery + 3 eternals columns.",
      render: () => <MasteryEternalsPanelDefaultDemo />,
    },
    {
      name: "Empty mastery — no champions played",
      notes: "masteryEntries=[] → 3 dimmed placeholder crest slots; eternals intact.",
      render: () => <MasteryEternalsPanelEmptyMasteryDemo />,
    },
    {
      name: "Empty eternals — no eternals earned",
      notes: "eternalEntries=[] → right panel shows 'No Eternals earned' in text-grey-2.",
      render: () => <MasteryEternalsPanelEmptyEternalsDemo />,
    },
    {
      name: "High mastery — level 10 crests",
      notes: "Mastery level 10 crests (Jinx, Ezreal) and level 9 (Lux) — tests larger art.",
      render: () => <MasteryEternalsPanelHighMasteryDemo />,
    },
  ],
};
