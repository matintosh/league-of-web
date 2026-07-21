'use client';

import { useState } from "react";
import { championSplashUrl, championRingUrl } from "@low/fixtures";
import { SkinCarousel } from "./skin-carousel";
import type { SkinOption } from "./skin-carousel";

/**
 * Authentic champ-select champion-ring frame art (issue #437), resolved here in
 * the demo (VALUES live in pages/showcase, never in `@low/ui`). Spread into each
 * `SkinCarousel` so the ornate ring uses the real dashed + filigree art.
 */
const RING_ART = {
  ringDashedSrc: championRingUrl("dashed"),
  ringInnerLeftSrc: championRingUrl("inner-left"),
  ringOuterLeftSrc: championRingUrl("outer-left"),
} as const;

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
        {...RING_ART}
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
        {...RING_ART}
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
        {...RING_ART}
      />
    </div>
  );
}

/** Large ringRadius — verifies the champion-ring art stays concentric at max radius. */
export function SkinCarouselLargeRadiusSnapshot() {
  return (
    <div className="bg-hextech-black p-8 flex justify-center">
      <SkinCarousel
        skins={WARWICK_SKINS_ALL_UNLOCKED}
        selectedIndex={3}
        onSelect={() => {}}
        ringRadius={190}
        showThumbStrip={false}
        {...RING_ART}
      />
    </div>
  );
}

/** No ring art supplied — graceful fallback: splash + name still render, no ring. */
export function SkinCarouselNoRingArtSnapshot() {
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
        {...RING_ART}
      />
    </div>
  );
}
