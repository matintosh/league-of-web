"use client";

import { useState } from "react";
import { StoreSubNavBar, FeaturedTab, StoreItemPurchaseModal, LootTab } from "@low/ui";
import type { StoreTab, LootSubTab } from "@low/ui";
import {
  demoHeroSlides,
  demoFeaturedItems,
  demoTopSellers,
  demoPurchaseBundles,
  rpIconUrl,
  demoLootCategories,
  demoForgeSlots,
  demoLootResources,
  LOOT_SIDEBAR_ICON_URLS,
  LOOT_BAR_ICON_URLS,
} from "@low/fixtures";
import type { StoreItem, ForgeSlot, LootItem } from "@low/fixtures";
import { clearForgeSlot } from "./store-utils";

// ---------------------------------------------------------------------------
// StoreScreen
// ---------------------------------------------------------------------------

export interface StoreScreenProps {
  /** Currently active tab — controlled by the parent (ClientShell). */
  activeTab: StoreTab;
  /** Called when the user clicks a sub-nav tab. */
  onTabChange: (tab: StoreTab) => void;
}

/**
 * StoreScreen renders the Store section of the client.
 *
 * Structure:
 * - StoreSubNavBar — horizontal tab strip (FEATURED through ESPORTS) + PURCHASE RP button
 * - Tab content panel — FEATURED and LOOT are live; other tabs show a placeholder
 * - StoreItemPurchaseModal — overlay opened when an item card is clicked
 *
 * `activeTab` and `onTabChange` are fully controlled by ClientShell so that the
 * loot nav-bar icon (and any future deep-links) can switch tabs even when the
 * store screen is already mounted.
 *
 * All other state (forge slots, wishlist, modal) is local (fixtures only, no fetching).
 */
export function StoreScreen({ activeTab, onTabChange }: StoreScreenProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<LootSubTab>("crafting");
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>(demoFeaturedItems);
  const [topSellers, setTopSellers] = useState<StoreItem[]>(demoTopSellers);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [forgeSlots, setForgeSlots] = useState<[ForgeSlot, ForgeSlot, ForgeSlot]>(demoForgeSlots);

  const rpIcon = rpIconUrl();

  const handleClearSlot = (idx: number) =>
    setForgeSlots((prev) => clearForgeSlot(prev, idx));

  /** Add a clicked inventory item to the first empty forge slot. */
  const handleItemClick = (item: LootItem) =>
    setForgeSlots((prev) => {
      const emptyIdx = prev.findIndex((s) => s === null);
      if (emptyIdx === -1) return prev; // all slots full — no-op
      const next = [...prev] as [ForgeSlot, ForgeSlot, ForgeSlot];
      next[emptyIdx] = item;
      return next;
    });

  const handleWishlist = (id: string) => {
    const toggle = (prev: StoreItem[]) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item,
      );
    setFeaturedItems(toggle);
    setTopSellers(toggle);
  };

  // Only featured-grid items have entries in demoPurchaseBundles — a
  // top-seller click selects an id with no bundle and is a deliberate no-op.
  const selectedBundle =
    selectedItemId !== null ? demoPurchaseBundles[selectedItemId] : undefined;

  return (
    <div className="flex h-full flex-col bg-blue-7">
      {/* Sub-nav bar */}
      <StoreSubNavBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onPurchaseRP={() => console.log("purchase RP")}
        rpIconSrc={rpIcon}
      />

      {/* Tab content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {activeTab === "featured" ? (
          <FeaturedTab
            heroSlides={demoHeroSlides}
            activeSlideIndex={activeSlideIndex}
            featuredItems={featuredItems}
            topSellers={topSellers}
            onSlideChange={setActiveSlideIndex}
            onItemClick={(id) => setSelectedItemId(id)}
            onWishlist={handleWishlist}
            rpIconSrc={rpIcon}
          />
        ) : activeTab === "loot" ? (
          <LootTab
            activeSubTab={activeSubTab}
            onSubTabChange={setActiveSubTab}
            lootItems={demoLootCategories}
            forgeSlots={forgeSlots}
            keyFragments={demoLootResources.keyFragments}
            keys={demoLootResources.keys}
            lootBags={demoLootResources.lootBags}
            sidebarIcons={LOOT_SIDEBAR_ICON_URLS}
            barIcons={LOOT_BAR_ICON_URLS}
            onSearch={(q) => console.log("loot search:", q)}
            onItemClick={handleItemClick}
            onCraft={() => console.log("craft")}
            onClearSlot={handleClearSlot}
          />
        ) : (
          /* Placeholder for unimplemented tabs */
          <div className="flex flex-1 items-center justify-center">
            <span className="font-display text-sm uppercase tracking-widest text-grey-2">
              {activeTab.toUpperCase()} — Coming soon
            </span>
          </div>
        )}
      </div>

      {/* Purchase modal — rendered at StoreScreen level so it overlays the full store */}
      {selectedBundle !== undefined && (
        <StoreItemPurchaseModal
          open={selectedItemId !== null}
          setArtUrl={selectedBundle.setArtUrl}
          setName={selectedBundle.setName}
          breakdown={selectedBundle.breakdown}
          originalPrice={selectedBundle.originalPrice}
          discountPct={selectedBundle.discountPct}
          finalPrice={selectedBundle.finalPrice}
          canAfford={false}
          items={selectedBundle.items}
          rpIconSrc={rpIcon}
          onPurchase={() => console.log("purchase", selectedItemId)}
          onWishlist={() => console.log("wishlist", selectedItemId)}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </div>
  );
}
