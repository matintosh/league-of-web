"use client";

import { useState } from "react";
import { MerchCategoryStrip } from "./merch-category-strip";
import type { MerchFranchiseChip } from "./merch-category-strip";

const CATEGORIES: MerchFranchiseChip[] = [
  {
    slug: "league-of-legends",
    label: "League of Legends",
    colorVar: "--color-merch-cat-lol",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "riftbound",
    label: "Riftbound",
    colorVar: "--color-merch-cat-riftbound",
    textColorVar: "--color-merch-on-dark",
    subLabel: "League of Legends",
  },
  {
    slug: "lol-esports",
    label: "LoL Esports",
    colorVar: "--color-merch-cat-esports",
    textColorVar: "--color-merch-ink",
  },
  {
    slug: "tft",
    label: "Teamfight Tactics",
    colorVar: "--color-merch-cat-tft",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "vct",
    label: "VCT",
    colorVar: "--color-merch-cat-vct",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "valorant",
    label: "Valorant",
    colorVar: "--color-merch-cat-valorant",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "2xko",
    label: "2XKO",
    colorVar: "--color-merch-cat-2xko",
    textColorVar: "--color-merch-ink",
  },
];

/**
 * Scroll demo at a narrow viewport (~480px) to demonstrate overflow + › affordance.
 * Shows last-clicked slug for interaction feedback.
 */
export function MerchCategoryStripScrollDemo() {
  const [lastSlug, setLastSlug] = useState<string | null>(null);

  return (
    <div>
      {/* Constrained width to force scroll */}
      <div style={{ maxWidth: 480 }}>
        <MerchCategoryStrip
          categories={CATEGORIES}
          onSelectFranchise={(slug) => setLastSlug(slug)}
        />
      </div>
      {lastSlug != null && (
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            fontFamily: "var(--font-merch)",
            color: "var(--color-merch-ink)",
          }}
        >
          Selected: <strong>{lastSlug}</strong>
        </p>
      )}
    </div>
  );
}
