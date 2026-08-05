"use client";

/**
 * LauncherContentCarouselDemo — stateful wrapper for the showcase.
 * Manages activeIndex state so thumbnail selection works interactively.
 * This is the ONLY client component; the showcase file is server-safe.
 */

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import { LauncherContentCarousel } from "./launcher-content-carousel";
import type { LauncherContentItem } from "./launcher-content-carousel";

const DEMO_ITEMS: LauncherContentItem[] = [
  { id: "1", thumbnailUrl: championSplashUrl("Warwick", 0), title: "League Classic Cinematic" },
  { id: "2", thumbnailUrl: championSplashUrl("Jinx", 0), title: "Patch 14.24 Highlights" },
  { id: "3", thumbnailUrl: championSplashUrl("Ahri", 0), title: "New Champion Reveal" },
  { id: "4", thumbnailUrl: championSplashUrl("Yasuo", 0), title: "Esports Weekly Recap" },
  { id: "5", thumbnailUrl: championSplashUrl("Thresh", 0), title: "Dev Update: Season 2025" },
];

export function LauncherContentCarouselDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ backgroundColor: "var(--color-launcher-bg)" }}>
      <LauncherContentCarousel
        items={DEMO_ITEMS}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
    </div>
  );
}
