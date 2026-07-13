"use client";

import { useState } from "react";
import type { ForgeSlot, LootCategory, LootItem } from "@low/fixtures";
import {
  demoLootCategories,
  emptyLootCategories,
  demoForgeSlots,
  emptyForgeSlots,
  filledForgeSlots,
  demoLootResources,
  LOOT_SIDEBAR_ICON_URLS,
  LOOT_BAR_ICON_URLS,
  SAMPLE_MYTHIC_SHOP_ITEMS,
  mythicEssenceIconUrl,
} from "@low/fixtures";
import { LootTab } from "./loot-tab";
import type { LootSubTab } from "./loot-tab";

// ---------------------------------------------------------------------------
// Shared slot helpers (local module scope — not duplicated per demo)
// ---------------------------------------------------------------------------

function clearSlot(
  prev: [ForgeSlot, ForgeSlot, ForgeSlot],
  idx: number,
): [ForgeSlot, ForgeSlot, ForgeSlot] {
  const next = [...prev] as [ForgeSlot, ForgeSlot, ForgeSlot];
  next[idx] = null;
  return next;
}

function addToFirstEmpty(
  prev: [ForgeSlot, ForgeSlot, ForgeSlot],
  item: LootItem,
): [ForgeSlot, ForgeSlot, ForgeSlot] {
  const emptyIdx = prev.findIndex((s) => s === null);
  if (emptyIdx === -1) return prev;
  const next = [...prev] as [ForgeSlot, ForgeSlot, ForgeSlot];
  next[emptyIdx] = item;
  return next;
}

// ---------------------------------------------------------------------------
// Full inventory + one forge slot filled (reference state)
// ---------------------------------------------------------------------------

export function LootTabDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("crafting");
  const [slots, setSlots] =
    useState<[ForgeSlot, ForgeSlot, ForgeSlot]>(demoForgeSlots);

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
        sidebarIcons={LOOT_SIDEBAR_ICON_URLS}
        barIcons={LOOT_BAR_ICON_URLS}
        mythicShopSkins={SAMPLE_MYTHIC_SHOP_ITEMS}
        meIconSrc={mythicEssenceIconUrl()}
        onSearch={(q) => console.log("search:", q)}
        onItemClick={(item) => setSlots((prev) => addToFirstEmpty(prev, item))}
        onCraft={() => console.log("craft")}
        onClearSlot={(idx) => setSlots((prev) => clearSlot(prev, idx))}
        onMythicShopSkinClick={(skin) =>
          console.log("mythic shop skin clicked:", skin.skinName)
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty inventory + empty forge
// ---------------------------------------------------------------------------

export function LootTabEmptyDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("crafting");
  const emptyItems: LootCategory[] = emptyLootCategories;
  return (
    <div className="h-[500px] w-[900px]">
      <LootTab
        activeSubTab={subTab}
        onSubTabChange={setSubTab}
        lootItems={emptyItems}
        forgeSlots={emptyForgeSlots}
        keyFragments={0}
        keys={0}
        lootBags={0}
        sidebarIcons={LOOT_SIDEBAR_ICON_URLS}
        barIcons={LOOT_BAR_ICON_URLS}
        mythicShopSkins={SAMPLE_MYTHIC_SHOP_ITEMS}
        meIconSrc={mythicEssenceIconUrl()}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// All forge slots filled (all count > 0 — CRAFT button enabled)
// ---------------------------------------------------------------------------

export function LootTabFilledForgeDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("crafting");
  const [slots, setSlots] =
    useState<[ForgeSlot, ForgeSlot, ForgeSlot]>(filledForgeSlots);

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
        sidebarIcons={LOOT_SIDEBAR_ICON_URLS}
        barIcons={LOOT_BAR_ICON_URLS}
        mythicShopSkins={SAMPLE_MYTHIC_SHOP_ITEMS}
        meIconSrc={mythicEssenceIconUrl()}
        onItemClick={(item) => setSlots((prev) => addToFirstEmpty(prev, item))}
        onCraft={() => console.log("craft!")}
        onClearSlot={(idx) => setSlots((prev) => clearSlot(prev, idx))}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mythic Shop sub-tab active (reference screenshot state)
// ---------------------------------------------------------------------------

export function LootTabMythicShopDemo() {
  const [subTab, setSubTab] = useState<LootSubTab>("mythic-shop");

  return (
    <div className="h-[500px] w-[900px]">
      <LootTab
        activeSubTab={subTab}
        onSubTabChange={setSubTab}
        lootItems={demoLootCategories}
        forgeSlots={emptyForgeSlots}
        keyFragments={demoLootResources.keyFragments}
        keys={demoLootResources.keys}
        lootBags={demoLootResources.lootBags}
        sidebarIcons={LOOT_SIDEBAR_ICON_URLS}
        barIcons={LOOT_BAR_ICON_URLS}
        mythicShopSkins={SAMPLE_MYTHIC_SHOP_ITEMS}
        meIconSrc={mythicEssenceIconUrl()}
        onMythicShopSkinClick={(skin) =>
          console.log("mythic shop skin clicked:", skin.skinName)
        }
      />
    </div>
  );
}
