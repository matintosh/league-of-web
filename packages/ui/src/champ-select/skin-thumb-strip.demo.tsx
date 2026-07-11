"use client";

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import { SkinThumbStrip } from "./skin-carousel";
import type { SkinOption } from "./skin-carousel";

const WARWICK_SKINS: SkinOption[] = [
  {
    name: "Warwick",
    thumbSrc: championSplashUrl("Warwick", 0),
    splashSrc: championSplashUrl("Warwick", 0),
  },
  {
    name: "Grey Warwick",
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
  },
];

/** Static snapshot — standalone strip as composed by the loadout screen's bottom bar. */
export function SkinThumbStripSnapshot() {
  return (
    <div className="bg-hextech-black p-4">
      <SkinThumbStrip
        skins={WARWICK_SKINS}
        selectedIndex={3}
        onSelect={() => {}}
      />
    </div>
  );
}

/** Interactive demo — owns selection; chevrons skip locked, locked thumbs no-op. */
export function SkinThumbStripDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="bg-hextech-black p-4">
      <SkinThumbStrip
        skins={WARWICK_SKINS}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <p className="mt-3 font-body text-xs text-grey-2">
        Selected: {WARWICK_SKINS[selectedIndex]?.name}
      </p>
    </div>
  );
}
