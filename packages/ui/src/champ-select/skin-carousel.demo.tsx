'use client';

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import { SkinCarousel } from "./skin-carousel";
import type { SkinOption } from "./skin-carousel";

// ---------------------------------------------------------------------------
// Fixture data — Warwick skins (DDragon casing verified: Warwick_0..4 → 200)
// ---------------------------------------------------------------------------

const WARWICK_SKINS_ALL_UNLOCKED: SkinOption[] = [
  {
    name: "Warwick",
    thumbSrc: championSplashUrl("Warwick", 0),
    splashSrc: championSplashUrl("Warwick", 0),
  },
  {
    name: "Big Bad Warwick",
    thumbSrc: championSplashUrl("Warwick", 1),
    splashSrc: championSplashUrl("Warwick", 1),
  },
  {
    name: "Urf the Manatee",
    thumbSrc: championSplashUrl("Warwick", 2),
    splashSrc: championSplashUrl("Warwick", 2),
  },
  {
    name: "Feral Warwick",
    thumbSrc: championSplashUrl("Warwick", 3),
    splashSrc: championSplashUrl("Warwick", 3),
  },
  {
    name: "Firefang Warwick",
    thumbSrc: championSplashUrl("Warwick", 4),
    splashSrc: championSplashUrl("Warwick", 4),
  },
];

/** Mixed owned/locked — mirrors reference screenshot (skins 1, 2, 4 locked). */
const WARWICK_SKINS_WITH_LOCKED: SkinOption[] = [
  {
    name: "Warwick",
    thumbSrc: championSplashUrl("Warwick", 0),
    splashSrc: championSplashUrl("Warwick", 0),
  },
  {
    name: "Big Bad Warwick",
    thumbSrc: championSplashUrl("Warwick", 1),
    splashSrc: championSplashUrl("Warwick", 1),
    locked: true,
  },
  {
    name: "Urf the Manatee",
    thumbSrc: championSplashUrl("Warwick", 2),
    splashSrc: championSplashUrl("Warwick", 2),
    locked: true,
  },
  {
    name: "Feral Warwick",
    thumbSrc: championSplashUrl("Warwick", 3),
    splashSrc: championSplashUrl("Warwick", 3),
  },
  {
    name: "Firefang Warwick",
    thumbSrc: championSplashUrl("Warwick", 4),
    splashSrc: championSplashUrl("Warwick", 4),
    locked: true,
  },
];

// ---------------------------------------------------------------------------
// Static snapshots (no-op onSelect — just for visual reference)
// ---------------------------------------------------------------------------

/** Feral Warwick selected with locks — mirrors reference screenshot. */
export function SkinCarouselReferenceSnapshot() {
  return (
    <div className="bg-hextech-black p-8 flex justify-center">
      <SkinCarousel
        skins={WARWICK_SKINS_WITH_LOCKED}
        selectedIndex={3}
        onSelect={() => {}}
      />
    </div>
  );
}

/** All skins unlocked, index 0 selected. */
export function SkinCarouselAllUnlockedSnapshot() {
  return (
    <div className="bg-hextech-black p-8 flex justify-center">
      <SkinCarousel
        skins={WARWICK_SKINS_ALL_UNLOCKED}
        selectedIndex={0}
        onSelect={() => {}}
      />
    </div>
  );
}

/** First skin selected, adjacent to locked — demonstrates chevron skip on interaction. */
export function SkinCarouselLockedAdjacentSnapshot() {
  return (
    <div className="bg-hextech-black p-8 flex justify-center">
      <SkinCarousel
        skins={WARWICK_SKINS_WITH_LOCKED}
        selectedIndex={0}
        onSelect={() => {}}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive demo — state owned here
// ---------------------------------------------------------------------------

/**
 * SkinCarouselDemo — interactive demo for the showcase.
 * Owns selectedIndex state; mirrors a real champ-select interaction.
 */
export function SkinCarouselDemo() {
  const [selectedIndex, setSelectedIndex] = useState(3); // Feral Warwick (index 3)

  return (
    <div className="bg-hextech-black p-8 flex justify-center">
      <SkinCarousel
        skins={WARWICK_SKINS_WITH_LOCKED}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
    </div>
  );
}
