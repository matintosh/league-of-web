"use client";

import { useState } from "react";
import { FeaturedTab } from "./featured-tab";
import {
  demoHeroSlides,
  demoFeaturedItems,
  demoTopSellers,
  rpIconUrl,
} from "@low/fixtures";
import type { StoreItem } from "@low/fixtures";

export function FeaturedTabDemo() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [items, setItems] = useState<StoreItem[]>(demoFeaturedItems);
  const [topSellers, setTopSellers] = useState<StoreItem[]>(demoTopSellers);

  const handleWishlist = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item,
      ),
    );
    setTopSellers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item,
      ),
    );
  };

  return (
    <div className="bg-blue-7" style={{ width: 780, height: 440 }}>
      <FeaturedTab
        heroSlides={demoHeroSlides}
        activeSlideIndex={activeSlideIndex}
        featuredItems={items}
        topSellers={topSellers}
        onSlideChange={setActiveSlideIndex}
        onItemClick={(id) => console.log("item click:", id)}
        onWishlist={handleWishlist}
        rpIconSrc={rpIconUrl()}
      />
    </div>
  );
}
