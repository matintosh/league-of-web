"use client";

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import { YourShopScreen } from "./your-shop-screen";
import type { YourShopCard } from "./your-shop-screen";

// ---------------------------------------------------------------------------
// Shared fixture data — 6 personalised offers (October 2024 era)
// ---------------------------------------------------------------------------

const BASE_CARDS: Omit<YourShopCard, "revealed" | "onReveal" | "onPurchase">[] = [
  {
    id: "offer-vi-neon-strike",
    artSrc: championSplashUrl("Vi", 4),
    discountPct: 20,
    originalRpPrice: 1350,
    rpPrice: 1080,
    skinName: "Neon Strike Vi",
  },
  {
    id: "offer-sona-arcade",
    artSrc: championSplashUrl("Sona", 6),
    discountPct: 50,
    originalRpPrice: 1350,
    rpPrice: 675,
    skinName: "Arcade Sona",
  },
  {
    id: "offer-jinx-project",
    artSrc: championSplashUrl("Jinx", 6),
    discountPct: 40,
    originalRpPrice: 1350,
    rpPrice: 810,
    skinName: "PROJECT: Jinx",
  },
  {
    id: "offer-nidalee-challenger",
    artSrc: championSplashUrl("Nidalee", 3),
    discountPct: 50,
    originalRpPrice: 1350,
    rpPrice: 675,
    skinName: "Challenger Nidalee",
  },
  {
    id: "offer-amumu-little-knight",
    artSrc: championSplashUrl("Amumu", 5),
    discountPct: 60,
    originalRpPrice: 520,
    rpPrice: 208,
    skinName: "Little Knight Amumu",
  },
  {
    id: "offer-annie-goth",
    artSrc: championSplashUrl("Annie", 3),
    discountPct: 40,
    originalRpPrice: 1350,
    rpPrice: 810,
    skinName: "Goth Annie",
  },
];

const EXPIRY = "Offers expire October 30 at 18:00 EET";

// ---------------------------------------------------------------------------
// All Unrevealed — mystery state
// ---------------------------------------------------------------------------

export function YourShopUnrevealedDemo() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const cards: YourShopCard[] = BASE_CARDS.map((base) => ({
    ...base,
    revealed: revealedIds.has(base.id),
    onReveal: () =>
      setRevealedIds((prev) => new Set([...prev, base.id])),
    onPurchase: revealedIds.has(base.id)
      ? () => alert(`Purchase: ${base.skinName}`)
      : undefined,
  }));

  return (
    <div style={{ width: 1200, height: 560 }}>
      <YourShopScreen
        cards={cards}
        expiryLabel={EXPIRY}
        includesChampionNote
        onClose={() => alert("close")}
        onRevealAll={() =>
          setRevealedIds(new Set(BASE_CARDS.map((c) => c.id)))
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Partially Revealed — 3 revealed, 3 mystery
// ---------------------------------------------------------------------------

export function YourShopPartialDemo() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(
    new Set(BASE_CARDS.slice(0, 3).map((c) => c.id)),
  );

  const cards: YourShopCard[] = BASE_CARDS.map((base) => ({
    ...base,
    revealed: revealedIds.has(base.id),
    onReveal: () =>
      setRevealedIds((prev) => new Set([...prev, base.id])),
    onPurchase: revealedIds.has(base.id)
      ? () => alert(`Purchase: ${base.skinName}`)
      : undefined,
  }));

  return (
    <div style={{ width: 1200, height: 560 }}>
      <YourShopScreen
        cards={cards}
        expiryLabel={EXPIRY}
        includesChampionNote
        onClose={() => alert("close")}
        onRevealAll={() =>
          setRevealedIds(new Set(BASE_CARDS.map((c) => c.id)))
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// All Revealed — fully disclosed state
// ---------------------------------------------------------------------------

export function YourShopRevealedDemo() {
  const cards: YourShopCard[] = BASE_CARDS.map((base) => ({
    ...base,
    revealed: true,
    onPurchase: () => alert(`Purchase: ${base.skinName}`),
  }));

  return (
    <div style={{ width: 1200, height: 560 }}>
      <YourShopScreen
        cards={cards}
        expiryLabel={EXPIRY}
        includesChampionNote
        onClose={() => alert("close")}
      />
    </div>
  );
}
