"use client";

import { useState } from "react";
import { StoreSubNavBar, FeaturedTab, StoreItemPurchaseModal } from "@low/ui";
import type { StoreTab } from "@low/ui";
import {
  demoHeroSlides,
  demoFeaturedItems,
  demoTopSellers,
  demoPurchaseBundles,
  rpIconUrl,
} from "@low/fixtures";
import type { StoreItem } from "@low/fixtures";

// ---------------------------------------------------------------------------
// StoreScreen
// ---------------------------------------------------------------------------

/**
 * StoreScreen renders the Store section of the client.
 *
 * Structure:
 * - StoreSubNavBar — horizontal tab strip (FEATURED through ESPORTS) + PURCHASE RP button
 * - Tab content panel — currently only FEATURED is live; other tabs are placeholder
 * - StoreItemPurchaseModal — overlay opened when an item card is clicked
 *
 * All state is local (fixtures only, no data fetching).
 */
export function StoreScreen() {
  const [activeTab, setActiveTab] = useState<StoreTab>("featured");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>(demoFeaturedItems);
  const [topSellers, setTopSellers] = useState<StoreItem[]>(demoTopSellers);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const rpIcon = rpIconUrl();

  const handleWishlist = (id: string) => {
    const toggle = (prev: StoreItem[]) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item,
      );
    setFeaturedItems(toggle);
    setTopSellers(toggle);
  };

  const selectedBundle =
    selectedItemId !== null ? demoPurchaseBundles[selectedItemId] : undefined;

  return (
    <div className="flex h-full flex-col bg-blue-7">
      {/* Sub-nav bar */}
      <StoreSubNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
