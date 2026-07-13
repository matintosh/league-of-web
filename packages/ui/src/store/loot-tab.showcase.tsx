import type { ShowcaseEntry } from "../showcase";
import { LootTabDemo, LootTabEmptyDemo, LootTabFilledForgeDemo } from "./loot-tab.demo";

export const lootTabShowcase: ShowcaseEntry = {
  slug: "loot-tab",
  name: "LootTab",
  area: "store",
  description:
    "Store → LOOT tab — Hextech crafting inventory + three-spoke forge (2024+ era). " +
    "Left panel: sub-nav (THE SANCTUM / MYTHIC SHOP / CRAFTING), category sidebar, " +
    "search + sort, and grouped item tiles. Right panel: Hextech forge wheel + " +
    "slot tray. Bottom bar: key fragments, keys, loot bag counters.",
  variants: [
    {
      name: "Full inventory — one forge slot filled (reference state)",
      render: () => <LootTabDemo />,
    },
    {
      name: "Empty loot inventory + empty forge slots",
      render: () => <LootTabEmptyDemo />,
    },
    {
      name: "All three forge slots filled",
      render: () => <LootTabFilledForgeDemo />,
    },
  ],
};
