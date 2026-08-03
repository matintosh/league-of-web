"use client";

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import { MerchCategoryTile } from "./merch-category-tile";

const IMAGE_URL = championSplashUrl("Vi", 0);

/**
 * Interactive demo for MerchCategoryTile when onClick is provided.
 * Demonstrates that tabIndex / keyboard support are gated behind onClick.
 */
export function MerchCategoryTileInteractiveDemo() {
  const [lastSlug, setLastSlug] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 400 }}>
      <MerchCategoryTile
        slug="arcane"
        name="Arcane (interactive)"
        imageUrl={IMAGE_URL}
        onClick={(slug) => setLastSlug(slug)}
      />
      {lastSlug != null && (
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            fontFamily: "var(--font-merch)",
            color: "var(--color-merch-ink)",
          }}
        >
          Clicked: <strong>{lastSlug}</strong>
        </p>
      )}
    </div>
  );
}
