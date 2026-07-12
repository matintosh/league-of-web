"use client";

import { useState } from "react";
import { StoreSubNavBar, FeaturedTab } from "@low/ui";
import type { StoreTab } from "@low/ui";
import {
  demoHeroSlides,
  demoFeaturedItems,
  demoTopSellers,
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
 *
 * All state is local (fixtures only, no data fetching).
 */
export function StoreScreen() {
  const [activeTab, setActiveTab] = useState<StoreTab>("featured");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>(demoFeaturedItems);
  const [topSellers, setTopSellers] = useState<StoreItem[]>(demoTopSellers);

  const handleWishlist = (id: string) => {
    const toggle = (prev: StoreItem[]) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item,
      );
    setFeaturedItems(toggle);
    setTopSellers(toggle);
  };

  return (
    <div className="flex h-full flex-col bg-blue-7">
      {/* Sub-nav bar */}
      <StoreSubNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPurchaseRP={() => console.log("purchase RP")}
        rpIconSrc={rpIconUrl()}
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
            onItemClick={(id) => console.log("item click:", id)}
            onWishlist={handleWishlist}
            rpIconSrc={rpIconUrl()}
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
    </div>
  );
}
