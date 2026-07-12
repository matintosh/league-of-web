"use client";

import { useState } from "react";
import { StoreItemTile } from "./store-item-tile";
import type { StoreItem } from "./store-item-tile";
import { rpIconUrl, championSplashUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture items for demos
// ---------------------------------------------------------------------------

const SKIN_ITEM: StoreItem = {
  id: "demo-skin",
  name: "Demacia Vice Garen",
  type: "skin",
  rpPrice: 1350,
  imageUrl: championSplashUrl("Garen", 6),
  isWishlisted: false,
};

const BUNDLE_ITEM: StoreItem = {
  id: "demo-bundle",
  name: "10 + 1 Little Legends Series 1 Rare Eggs",
  type: "bundle",
  rpPrice: 4900,
  imageUrl: championSplashUrl("Lulu", 3),
  quantity: 10,
  isWishlisted: false,
};

const INSUFFICIENT_ITEM: StoreItem = {
  id: "demo-insufficient",
  name: "25 Arcade Orbs + 1 Arcade Jackpot + 400 Tokens",
  type: "bundle",
  rpPrice: 2000,
  imageUrl: championSplashUrl("MissFortune", 7),
  quantity: 25,
  isWishlisted: false,
  insufficientRP: true,
};

const WISHLISTED_ITEM: StoreItem = {
  id: "demo-wishlisted",
  name: "Star Guardian Jinx",
  type: "skin",
  rpPrice: 1350,
  imageUrl: championSplashUrl("Jinx", 4),
  isWishlisted: true,
};

// ---------------------------------------------------------------------------
// Interactive grid tile demo
// ---------------------------------------------------------------------------

export function StoreItemTileGridDemo() {
  const [items, setItems] = useState<StoreItem[]>([
    SKIN_ITEM,
    BUNDLE_ITEM,
    INSUFFICIENT_ITEM,
    WISHLISTED_ITEM,
  ]);

  const handleWishlist = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item,
      ),
    );
  };

  return (
    <div className="bg-blue-7 p-4">
      <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {items.map((item) => (
          <StoreItemTile
            key={item.id}
            item={item}
            size="grid"
            onClick={(id) => console.log("click:", id)}
            onWishlist={handleWishlist}
            rpIconSrc={rpIconUrl()}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Strip tile demo
// ---------------------------------------------------------------------------

const STRIP_ITEMS: StoreItem[] = [
  SKIN_ITEM,
  { ...WISHLISTED_ITEM, id: "demo-strip-2" },
  { ...BUNDLE_ITEM, id: "demo-strip-3", quantity: undefined },
  { ...INSUFFICIENT_ITEM, id: "demo-strip-4" },
  {
    id: "demo-strip-5",
    name: "PROJECT: Vayne",
    type: "skin",
    rpPrice: 1350,
    imageUrl: championSplashUrl("Vayne", 4),
  },
];

export function StoreItemTileStripDemo() {
  return (
    <div className="bg-blue-7 p-4">
      <div className="flex gap-2 overflow-x-auto">
        {STRIP_ITEMS.map((item) => (
          <StoreItemTile
            key={item.id}
            item={item}
            size="strip"
            onClick={(id) => console.log("click:", id)}
            onWishlist={(id) => console.log("wishlist:", id)}
            rpIconSrc={rpIconUrl()}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grid — insufficient RP only
// ---------------------------------------------------------------------------

export function StoreItemTileInsufficientDemo() {
  return (
    <div className="bg-blue-7 p-4">
      <StoreItemTile
        item={INSUFFICIENT_ITEM}
        size="grid"
        onClick={(id) => console.log("click:", id)}
        onWishlist={(id) => console.log("wishlist:", id)}
        rpIconSrc={rpIconUrl()}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grid — wishlisted (heart filled)
// ---------------------------------------------------------------------------

export function StoreItemTileWishlistedDemo() {
  const [item, setItem] = useState<StoreItem>(WISHLISTED_ITEM);
  return (
    <div className="bg-blue-7 p-4">
      <StoreItemTile
        item={item}
        size="grid"
        onClick={(id) => console.log("click:", id)}
        onWishlist={() => setItem((prev) => ({ ...prev, isWishlisted: !prev.isWishlisted }))}
        rpIconSrc={rpIconUrl()}
      />
    </div>
  );
}
