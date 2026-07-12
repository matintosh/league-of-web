"use client";

import { useState } from "react";
import { warwickDetail } from "@low/fixtures";
import { ChampionDetail } from "./champion-detail";

// Shared wrapper gives the overlay a fixed height matching the content area.
function OverlayWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-hextech-black" style={{ height: 580 }}>
      {children}
    </div>
  );
}

/** Overview tab — static snapshot (onClose is a no-op in showcase context). */
export function ChampionDetailOverviewDemo() {
  return (
    <OverlayWrapper>
      <ChampionDetail
        champion={warwickDetail}
        onClose={() => undefined}
        initialTab="overview"
      />
    </OverlayWrapper>
  );
}

/** Abilities tab — static snapshot showing P selected by default. */
export function ChampionDetailAbilitiesDemo() {
  return (
    <OverlayWrapper>
      <ChampionDetail
        champion={warwickDetail}
        onClose={() => undefined}
        initialTab="abilities"
      />
    </OverlayWrapper>
  );
}

/** Skins tab — static snapshot showing Warwick skin grid. */
export function ChampionDetailSkinsDemo() {
  return (
    <OverlayWrapper>
      <ChampionDetail
        champion={warwickDetail}
        onClose={() => undefined}
        initialTab="skins"
      />
    </OverlayWrapper>
  );
}

/**
 * Interactive demo: full round-trip — tab switching, close button returns to
 * "Open Overlay" button so the overlay can be re-opened.
 */
export function ChampionDetailInteractiveDemo() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="flex items-center justify-center bg-hextech-black" style={{ height: 580 }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-gold-4 px-6 py-2 font-display text-xs uppercase tracking-widest text-gold-cream hover:border-gold-3 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
        >
          Open Overlay
        </button>
      </div>
    );
  }

  return (
    <OverlayWrapper>
      <ChampionDetail champion={warwickDetail} onClose={() => setOpen(false)} />
    </OverlayWrapper>
  );
}
