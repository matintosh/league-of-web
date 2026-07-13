"use client";

import { useState } from "react";
import type { ForgeSlot, LootCategory } from "@low/fixtures";
import {
  demoLootCategories,
  emptyLootCategories,
  demoForgeSlots,
  emptyForgeSlots,
  filledForgeSlots,
  demoLootResources,
} from "@low/fixtures";
import { LootTab } from "./loot-tab";
import type { LootSubTab } from "./loot-tab";

// ---------------------------------------------------------------------------
// Full inventory + one forge slot filled
// ---------------------------------------------------------------------------

export function LootTabDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("crafting");
  const [slots, setSlots] =
    useState<[ForgeSlot, ForgeSlot, ForgeSlot]>(demoForgeSlots);

  const clearSlot = (idx: number) =>
    setSlots((prev) => {
      const next = [...prev] as [ForgeSlot, ForgeSlot, ForgeSlot];
      next[idx] = null;
      return next;
    });

  return (
    <div className="h-[500px] w-[900px]">
      <LootTab
        activeSubTab={subTab}
        onSubTabChange={setSubTab}
        lootItems={demoLootCategories}
        forgeSlots={slots}
        keyFragments={demoLootResources.keyFragments}
        keys={demoLootResources.keys}
        lootBags={demoLootResources.lootBags}
        onSearch={(q) => console.log("search:", q)}
        onCraft={() => console.log("craft")}
        onClearSlot={clearSlot}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty inventory + empty forge
// ---------------------------------------------------------------------------

export function LootTabEmptyDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("crafting");
  const slots: [ForgeSlot, ForgeSlot, ForgeSlot] = emptyForgeSlots;
  const emptyItems: LootCategory[] = emptyLootCategories;
  return (
    <div className="h-[500px] w-[900px]">
      <LootTab
        activeSubTab={subTab}
        onSubTabChange={setSubTab}
        lootItems={emptyItems}
        forgeSlots={slots}
        keyFragments={0}
        keys={0}
        lootBags={0}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// All forge slots filled
// ---------------------------------------------------------------------------

export function LootTabFilledForgeDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("crafting");
  const [slots, setSlots] =
    useState<[ForgeSlot, ForgeSlot, ForgeSlot]>(filledForgeSlots);

  const clearSlot = (idx: number) =>
    setSlots((prev) => {
      const next = [...prev] as [ForgeSlot, ForgeSlot, ForgeSlot];
      next[idx] = null;
      return next;
    });

  return (
    <div className="h-[500px] w-[900px]">
      <LootTab
        activeSubTab={subTab}
        onSubTabChange={setSubTab}
        lootItems={demoLootCategories}
        forgeSlots={slots}
        keyFragments={demoLootResources.keyFragments}
        keys={demoLootResources.keys}
        lootBags={demoLootResources.lootBags}
        onCraft={() => console.log("craft!")}
        onClearSlot={clearSlot}
      />
    </div>
  );
}
