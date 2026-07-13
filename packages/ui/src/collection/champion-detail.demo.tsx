"use client";

import { useState } from "react";
import { warwickDetail, warwickMastery } from "@low/fixtures";
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

/** Mastery tab — has mastery data (Level 11, 111 178 pts, Milestone III). */
export function ChampionDetailMasteryDemo() {
  return (
    <OverlayWrapper>
      <ChampionDetail
        champion={warwickDetail}
        onClose={() => undefined}
        initialTab="mastery"
        mastery={warwickMastery}
      />
    </OverlayWrapper>
  );
}

/** Mastery tab — no mastery data; renders "Not Yet Ranked" placeholder state. */
export function ChampionDetailMasteryUnrankedDemo() {
  return (
    <OverlayWrapper>
      <ChampionDetail
        champion={warwickDetail}
        onClose={() => undefined}
        initialTab="mastery"
        /* mastery prop intentionally omitted — triggers unranked placeholder */
      />
    </OverlayWrapper>
  );
}

/** Eternals tab — empty state ("No Eternals Earned"). */
export function ChampionDetailEternalsDemo() {
  return (
    <OverlayWrapper>
      <ChampionDetail
        champion={warwickDetail}
        onClose={() => undefined}
        initialTab="eternals"
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
      <ChampionDetail
        champion={warwickDetail}
        mastery={warwickMastery}
        onClose={() => setOpen(false)}
      />
    </OverlayWrapper>
  );
}
