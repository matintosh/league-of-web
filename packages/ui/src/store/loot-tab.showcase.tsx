import type { ShowcaseEntry } from "../showcase";
import {
  LootTabDemo,
  LootTabEmptyDemo,
  LootTabFilledForgeDemo,
  LootTabMythicShopDemo,
} from "./loot-tab.demo";

export const lootTabShowcase: ShowcaseEntry = {
  slug: "loot-tab",
  name: "LootTab",
  area: "store",
  description:
    "Store → LOOT tab — Hextech crafting inventory + sub-tab content switcher (2024+ era). " +
    "Left panel: sub-nav (THE SANCTUM / MYTHIC SHOP / CRAFTING), category sidebar, " +
    "search + sort, and grouped item tiles. Right panel switches on the active sub-tab: " +
    "CRAFTING → three-spoke forge wheel; MYTHIC SHOP → prestige skin 4-column grid with ME pricing; " +
    "THE SANCTUM → Coming Soon stub. Bottom bar: key fragments, keys, loot bag counters.",
  variants: [
    {
      name: "Full inventory — one forge slot filled (CRAFTING reference state)",
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
    {
      name: "MYTHIC SHOP sub-tab — prestige skin grid (2024+ reference state)",
      render: () => <LootTabMythicShopDemo />,
    },
  ],
};
